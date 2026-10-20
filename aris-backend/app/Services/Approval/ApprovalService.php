<?php

namespace App\Services\Approval;

use App\DTOs\WorkflowStep;
use App\Models\AccidentCase;
use App\Models\Approval;
use App\Models\FR1043;
use App\Models\FR1044;
use App\Models\FR109;
use App\Models\User;
use App\Http\Resources\FR1043Resource;
use App\Http\Resources\FR1044Resource;
use App\Http\Resources\FR109Resource;
use App\Services\Workflow\WorkflowResolverService;
use App\Services\AccidentTimelineService;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use App\Models\UserSignature;
use Illuminate\Validation\ValidationException;
use App\Services\Notifications\NotificationService;
use App\Services\AuditLogService;
use App\Enums\AuditAction;
use App\Enums\AuditModule;
use App\Services\Signature\SignatureCaptionService;
use App\Services\Signature\SignatureService;
use App\Services\Delegation\DelegationService;

class ApprovalService
{
    public function __construct(
        protected WorkflowResolverService $workflowResolver,
        protected AccidentTimelineService $timelineService,
        protected NotificationService $notificationService,
        protected AuditLogService $auditLogs,
        protected SignatureCaptionService $signatureCaptionService,
        protected SignatureService $signatureService,
        protected DelegationService $delegationService,
    ) {}

    /**
     * Resolve the submitted document revision represented by an approval.
     *
     * Keep document-specific lookup here so the approval document endpoint can
     * serve additional document types without expanding its controller.
     */
    public function getDocument(Approval $approval)
    {
        return match ($approval->document_type) {
            'FR1043' => new FR1043Resource(
                FR1043::query()
                    ->where('accident_case_id', $approval->accident_case_id)
                    ->where('revision', $approval->revision)
                    ->firstOrFail()
            ),
            'FR1044' => new FR1044Resource(
                FR1044::query()
                    ->where('accident_case_id', $approval->accident_case_id)
                    ->where('revision', $approval->revision)
                    ->firstOrFail()
            ),
            'FR109' => new FR109Resource(
                FR109::query()
                    ->where('accident_case_id', $approval->accident_case_id)
                    ->where('revision', $approval->revision)
                    ->firstOrFail()
            ),
            default => abort(404, "Unsupported document type: {$approval->document_type}"),
        };
    }

    /**
     * Create approval workflow for a document.
     */
    public function submit(AccidentCase $case,string $documentType,int $revision): void 
    {
        set_time_limit(120);
        
        $exists = Approval::query()
            ->where('accident_case_id', $case->id)
            ->where('document_type', $documentType)
            ->where('revision', $revision)
            ->exists();

        if ($exists) {
            throw new RuntimeException(
                'Approval workflow already exists.'
            );
        }

        DB::transaction(function () use (
            $case,
            $documentType,
            $revision
        ) {
            $workflow = $this->workflowResolver->resolve($case, $documentType, $revision);

            $firstPendingApproval = null;

            foreach ($workflow as $step) {

                $approver = $this->findApprover($step);

                $approval = Approval::create([

                    'accident_case_id' => $case->id,

                    'document_type' => $documentType,

                    'revision' => $revision,

                    'step' => $step->step,

                    'institution_id' => $step->institution->id,

                    'approver_id' => $approver->id,

                    'status' => $step->step === 1
                        ? 'PENDING'
                        : 'WAITING',

                ]);

                if ($approval->status === 'PENDING') {
                    $firstPendingApproval = $approval;
                }
            }

            if ($firstPendingApproval) {
                DB::afterCommit(function () use ($firstPendingApproval) {
                    $this->notificationService->notifyNextApprover($firstPendingApproval);
                });
            }
        });
    }

    /**
     * Resolve the user who should approve a workflow step.
     */
    protected function findApprover(WorkflowStep $step): User 
    {
        if ($step->approverId) {
            return User::query()
                ->role($step->role)
                ->findOrFail($step->approverId);
        }

        if (
            $step->institution->type === 'MINISTRY'
            &&
            $step->role === 'subject_officer'
        ) {

            return User::query()

                ->role('subject_officer')

                ->where(
                    'institution_id',
                    $step->institution->id
                )

                ->whereHas(
                    'districts',
                    function ($query) use ($step) {

                        $query->where(
                            'district',
                            $step->district
                        );

                    }
                )

                ->firstOrFail();
        }

        return User::query()

            ->role($step->role)

            ->where(
                'institution_id',
                $step->institution->id
            )

            ->firstOrFail();
    }

    /**
     * Approve current step.
     */
    public function approve(Approval $approval,User $user,?string $comments = null): Approval 
    {

        $isDesignated = $approval->approver_id === $user->id;
        $delegation = $this->delegationService->findActiveDelegation($user, $approval->approver_id);
        $isActing = ! is_null($delegation);

        abort_unless(
            $isDesignated || $isActing,
            403,
            'You are not authorized to approve this workflow step.'
        );

        abort_unless(
            $approval->status === 'PENDING',
            400
        );

        $accidentCase = $this->resolveApprovalCase($approval);

        // Determine if the approver requires a signature for this approval step
        $designatedRole = $approval->approver?->roles->first()?->name;
        $signatureRoles = [
            'medical_superintendent',
            'regional_director',
            'provincial_director',
            'chief_accountant',
            'accountant',
            'secretary',
            'chief_secretary',
        ];
        $signatureRequired = $user->hasAnyRole($signatureRoles) || in_array($designatedRole, $signatureRoles, true);

        $signature = $signatureRequired
            ? $this->getActiveSignature($user)
            : null;

        $signatureCaption = $signature
            ? $this->signatureCaptionService->forUser($user)
            : null;

        if ($signatureCaption && $isActing) {
            $designatedUser = $approval->approver;
            $formattedRole = $designatedRole ? ucwords(str_replace('_', ' ', $designatedRole)) : 'Officer';
            $signatureCaption['is_acting'] = true;
            $signatureCaption['acting_for'] = $designatedUser?->name;
            if (! empty($signatureCaption['designation'])) {
                $signatureCaption['designation'] .= " (Acting for {$formattedRole})";
            }
        }

        DB::transaction(function () use (
            $approval,
            $comments,
            $user,
            $accidentCase,
            $signature,
            $signatureCaption,
            $delegation,
        ) {

            $document = null;
            $caseStatusBeforeCompletion = null;

            $nextApproval = Approval::query()

                ->where(
                    'accident_case_id',
                    $approval->accident_case_id
                )
                ->where(
                    'document_type',
                    $approval->document_type
                )
                ->where(
                    'revision',
                    $approval->revision
                )
                ->where(
                    'step',
                    $approval->step + 1
                )
                ->first();

            // Intermediate steps recommend the document. Only the final
            // workflow step gives the document its final approval.
            $decisionStatus = $nextApproval ? 'RECOMMENDED' : 'APPROVED';

            $approval->update([

                'status' => $decisionStatus,
                'comments' => $comments,
                'acted_at' => now(),
                'acted_by_id' => $user->id,
                'delegation_id' => $delegation?->id,
                'user_signature_id' => $signature?->id,
                'signature_caption_snapshot' => $signatureCaption,
            ]);

            DB::afterCommit(function () use ($approval, $decisionStatus) {
                $this->auditLogs->log(
                    $decisionStatus === 'RECOMMENDED' ? AuditAction::RECOMMEND : AuditAction::APPROVE,
                    AuditModule::APPROVAL,
                    $approval,
                    ['status' => 'PENDING'],
                    ['status' => $decisionStatus, 'comments' => $approval->comments],
                    $decisionStatus === 'RECOMMENDED'
                        ? 'Recommended approval step '.$approval->step.'.'
                        : 'Granted final approval.',
                );
            });

            if ($nextApproval) {
                $nextApproval->update([
                    'status' => 'PENDING',
                ]);   
                
                DB::afterCommit(function () use ($nextApproval) {
                    $this->notificationService->notifyNextApprover($nextApproval);
                });

            } else {
                $document = match ($approval->document_type) {
                    'FR1043' => FR1043::query(),
                    'FR1044' => FR1044::query(),
                    'FR109' => FR109::query(),
                    default => null,
                };

                $document = $document?->where('accident_case_id', $approval->accident_case_id)
                    ->where('revision', $approval->revision)
                    ->first();

                if ($document) {
                    $document->update([
                        'status' => 'APPROVED',
                        'approved_at' => now(),
                    ]);

                    if ($approval->document_type === 'FR1043') {
                        $accidentCase->update(['current_stage' => 'FR1044']);
                    }

                    if ($approval->document_type === 'FR1044') {
                        $accidentCase->update([
                            'current_stage' => 'FR109',
                            'status' => 'IN_PROGRESS',
                        ]);
                    }

                    if ($approval->document_type === 'FR109') {
                        $caseStatusBeforeCompletion = $accidentCase->status;

                        $accidentCase->update([
                            'current_stage' => 'FR109',
                            'status' => 'COMPLETED',
                        ]);
                    }
                }

            }

            $this->timelineService->createDocumentEvent(
                $accidentCase,
                $user,
                $approval->document_type,
                $decisionStatus,
                $approval->revision,
                step: $approval->step,
            );
           

            if (!$nextApproval) {
                if ($approval->document_type === 'FR109' && $document) {
                    $this->timelineService->create(
                        accidentCase: $accidentCase,
                        user: $user,
                        action: 'CASE_COMPLETED',
                        description: 'Case completed after final FR109 approval.',
                        oldValue: ['status' => $caseStatusBeforeCompletion ?? 'IN_PROGRESS'],
                        newValue: ['status' => 'COMPLETED', 'current_stage' => 'FR109'],
                    );
                }

                $this->timelineService->createDocumentEvent(
                    $accidentCase,
                    $user,
                    $approval->document_type,
                    'WORKFLOW_COMPLETED',
                    $approval->revision,
                );

                $recipient = $document?->creator;

                if ($document && $recipient) {
                    DB::afterCommit(function () use ($recipient, $document, $approval) {
                        $this->notificationService->notifyWorkflowCompleted(
                            recipient: $recipient,
                            document: $document,
                            approval: $approval,
                        );
                    });
                }
            }

        });

        return $approval->fresh();
    }

    /**
     * Reject current step.
     */
    public function reject(Approval $approval,User $user,string $comments): Approval 
    {
        $isDesignated = $approval->approver_id === $user->id;
        $delegation = $this->delegationService->findActiveDelegation($user, $approval->approver_id);
        $isActing = ! is_null($delegation);

        abort_unless(
            $isDesignated || $isActing,
            403,
            'You are not authorized to reject this workflow step.'
        );

        abort_unless(
            $approval->status === 'PENDING',
            400
        );

        $accidentCase = $this->resolveApprovalCase($approval);

        DB::transaction(function () use (
            $approval,
            $comments,
            $user,
            $accidentCase,
            $delegation,
        ) {

            $approval->update([
                'status' => 'REJECTED',
                'comments' => $comments,
                'acted_at' => now(),
                'acted_by_id' => $user->id,
                'delegation_id' => $delegation?->id,
            ]);

            DB::afterCommit(function () use ($approval, $comments) {
                $this->auditLogs->log(
                    AuditAction::REJECT,
                    AuditModule::APPROVAL,
                    $approval,
                    ['status' => 'PENDING'],
                    ['status' => 'REJECTED', 'comments' => $comments],
                    'Rejected approval step '.$approval->step.'.',
                );
            });

            if (in_array($approval->document_type, ['FR1043', 'FR1044', 'FR109'], true)) {
                $document = (match ($approval->document_type) {
                    'FR1043' => FR1043::query(),
                    'FR1044' => FR1044::query(),
                    'FR109' => FR109::query(),
                })
                    ->where('accident_case_id', $approval->accident_case_id)
                    ->where('revision', $approval->revision)
                    ->first();

                if ($document) {
                    $document->update(['status' => 'CHANGES_REQUESTED']);
                }
            }

            $this->timelineService->createDocumentEvent(
                $accidentCase,
                $user,
                $approval->document_type,
                'REJECTED',
                $approval->revision,
                comments: $comments,
            );

            $recipient = $document?->creator;

            if ($recipient) {
                DB::afterCommit(function () use ($document, $approval, $comments, $recipient) {
                    $this->notificationService->notifyRejected(
                        recipient: $recipient,
                        document: $document,
                        approval: $approval,
                        reason: $comments,
                    );
                });
            }

        });

        return $approval->fresh();
    }

    /** Resolve the case before changing approval state or writing timeline events. */
    protected function resolveApprovalCase(Approval $approval): AccidentCase
    {
        return AccidentCase::query()->findOrFail($approval->accident_case_id);
    }

    /**
     * Pending approvals for logged-in user (including officers they are acting for).
     */
    public function getPendingApprovals(User $user,?string $search = null)
    {
        $approverIds = array_merge([$user->id], $this->delegationService->getActingForOfficerIds($user));

        return Approval::query()

            ->whereIn(
                'approver_id',
                $approverIds
            )

            ->where(
                'status',
                'PENDING'
            )

            ->when(
                $search,
                function ($query) use ($search) {

                    $query->whereHas(
                        'accidentCase',
                        function ($q) use ($search) {

                            $q->where(
                                'case_number',
                                'like',
                                "%{$search}%"
                            );

                        }
                    );

                }
            )

            ->with([

                'institution',

                'approver.roles',

                'actedBy.roles',

                'delegation.officer',

                'reassignedFrom',

                'signature',

                'accidentCase.accident',

            ])

            ->latest()

            ->paginate(10);
    }

    /** Decisions already made by the logged-in approver (or acted on by them). */
    public function getDecidedApprovals(User $user, ?string $documentType = null, ?string $status = null, ?string $search = null)
    {
        return Approval::query()
            ->where(function ($query) use ($user) {
                $query->where('approver_id', $user->id)
                    ->orWhere('acted_by_id', $user->id);
            })
            ->whereIn('status', ['RECOMMENDED', 'APPROVED', 'REJECTED'])
            ->when($documentType, fn ($query) => $query->where('document_type', $documentType))
            ->when($status, fn ($query) => $query->where('status', $status))
            ->when($search, function ($query) use ($search) {
                $query->whereHas('accidentCase', fn ($case) => $case->where('case_number', 'like', "%{$search}%"));
            })
            ->with([
                'institution',
                'approver.roles',
                'actedBy.roles',
                'delegation.officer',
                'reassignedFrom',
                'accidentCase.accident',
                'accidentCase.creator',
                'signature',
            ])
            ->orderByDesc('acted_at')
            ->paginate(10);
    }

    /** Summary counts for the Approval Center cards. */
    public function getApprovalStats(User $user): array
    {
        $approverIds = array_merge([$user->id], $this->delegationService->getActingForOfficerIds($user));

        $counts = Approval::query()
            ->where(function ($query) use ($approverIds, $user) {
                $query->whereIn('approver_id', $approverIds)
                    ->orWhere('acted_by_id', $user->id);
            })
            ->selectRaw("SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending")
            ->selectRaw("SUM(CASE WHEN status = 'RECOMMENDED' THEN 1 ELSE 0 END) as recommended")
            ->selectRaw("SUM(CASE WHEN status = 'APPROVED' THEN 1 ELSE 0 END) as approved")
            ->selectRaw("SUM(CASE WHEN status = 'REJECTED' THEN 1 ELSE 0 END) as rejected")
            ->selectRaw("SUM(CASE WHEN status IN ('PENDING', 'RECOMMENDED', 'APPROVED', 'REJECTED') THEN 1 ELSE 0 END) as total")
            ->first();

        return [
            'pending' => (int) $counts->pending,
            'recommended' => (int) $counts->recommended,
            'approved' => (int) $counts->approved,
            'rejected' => (int) $counts->rejected,
            'total' => (int) $counts->total,
        ];
    }
    /**
     * Approval history.
     */
    public function getApprovalHistory(AccidentCase $case, ?string $documentType = null, ?int $revision = null)
    {

        $query = Approval::query()

            ->where(
                'accident_case_id',
                $case->id
            )

            ->when($documentType, fn ($query) => $query->where('document_type', $documentType));

        if ($revision !== null) {

            $query->where(
                'revision',
                $revision
            );
        }

        return $query

            ->with([
                'accidentCase.creator',
                'approver.roles',
                'actedBy.roles',
                'delegation.officer',
                'reassignedFrom',
                'institution',
                'signature',
            ])

            ->orderBy('document_type')
            ->orderByDesc('revision')
            ->orderBy('step')

            ->get();
    }

    /**
     * Reassign an approval step to another approver.
     */
    public function reassignApproval(Approval $approval, User $newApprover, User $actor, string $reason): Approval
    {
        abort_unless(
            in_array($approval->status, ['PENDING', 'WAITING'], true),
            400,
            'Only pending or waiting approvals can be reassigned.'
        );

        if (! $newApprover->is_active) {
            throw ValidationException::withMessages([
                'approver_id' => 'The selected new approver is not active.',
            ]);
        }

        $oldApprover = $approval->approver;

        DB::transaction(function () use ($approval, $newApprover, $actor, $reason, $oldApprover) {
            $approval->update([
                'reassigned_from_id' => $oldApprover?->id,
                'approver_id' => $newApprover->id,
                'reassign_reason' => $reason,
            ]);

            $accidentCase = $this->resolveApprovalCase($approval);

            $oldName = $oldApprover?->name ?? 'Unassigned';
            $this->timelineService->createDocumentEvent(
                $accidentCase,
                $actor,
                $approval->document_type,
                'REASSIGNED',
                $approval->revision,
                comments: "Step {$approval->step} reassigned from {$oldName} to {$newApprover->name}. Reason: {$reason}",
            );

            $this->auditLogs->log(
                AuditAction::ASSIGN,
                AuditModule::APPROVAL,
                $approval,
                ['approver_id' => $oldApprover?->id],
                ['approver_id' => $newApprover->id, 'reason' => $reason],
                "Reassigned approval step {$approval->step} from {$oldName} to {$newApprover->name}.",
            );

            if ($approval->status === 'PENDING') {
                DB::afterCommit(function () use ($approval) {
                    $this->notificationService->notifyNextApprover($approval);
                });
            }
        });

        return $approval->fresh(['approver.roles', 'actedBy', 'reassignedFrom', 'institution']);
    }

    /**
     * Handover all pending approvals and active cases from a departing user to a successor.
     */
    public function handoverWorkload(User $departingUser, User $successorUser, User $actor, string $reason): array
    {
        return DB::transaction(function () use ($departingUser, $successorUser, $actor, $reason) {
            $openCases = AccidentCase::query()
                ->where('assigned_to', $departingUser->id)
                ->whereIn('status', ['OPEN', 'IN_PROGRESS'])
                ->get();

            $caseCount = 0;
            foreach ($openCases as $case) {
                $case->update(['assigned_to' => $successorUser->id]);
                $this->timelineService->create(
                    accidentCase: $case,
                    user: $actor,
                    action: 'ASSIGNED',
                    description: "Case reassigned from {$departingUser->name} to {$successorUser->name} (Handover: {$reason})",
                    oldValue: ['assigned_to' => $departingUser->id],
                    newValue: ['assigned_to' => $successorUser->id],
                );
                $caseCount++;
            }

            $openApprovals = Approval::query()
                ->where('approver_id', $departingUser->id)
                ->whereIn('status', ['PENDING', 'WAITING'])
                ->get();

            $approvalCount = 0;
            foreach ($openApprovals as $approval) {
                $approval->update([
                    'reassigned_from_id' => $departingUser->id,
                    'approver_id' => $successorUser->id,
                    'reassign_reason' => $reason,
                ]);
                $approvalCount++;
            }

            $this->auditLogs->log(
                AuditAction::ASSIGN,
                AuditModule::WORKFLOW,
                $departingUser,
                ['assigned_cases' => $caseCount, 'pending_approvals' => $approvalCount],
                ['successor_id' => $successorUser->id, 'reason' => $reason],
                "Handed over {$caseCount} cases and {$approvalCount} approvals from {$departingUser->name} to {$successorUser->name}.",
            );

            return [
                'reassigned_cases' => $caseCount,
                'reassigned_approvals' => $approvalCount,
            ];
        });
    }

    protected function getActiveSignature(User $user): UserSignature
    {
        $signature = $user->signatures()
            ->where('is_active', true)
            ->latest()
            ->first();

        if (! $signature) {
            throw ValidationException::withMessages([
                'signature' => 'Active signature not found. Please upload your signature before approving.',
            ]);
        }

        // Verify that the signature file on disk has not been tampered with
        // by recomputing its SHA-256 and comparing against the stored hash.
        $this->signatureService->verify($signature);

        return $signature;
    }

}

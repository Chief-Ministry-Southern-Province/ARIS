<?php

namespace App\Services\Approval;

use App\DTOs\WorkflowStep;
use App\Models\AccidentCase;
use App\Models\Approval;
use App\Models\FR1043;
use App\Models\FR1044;
use App\Models\User;
use App\Notifications\FR1043ChangesRequested;
use App\Http\Resources\FR1043Resource;
use App\Http\Resources\FR1044Resource;
use App\Services\Workflow\WorkflowResolverService;
use App\Services\AccidentTimelineService;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Illuminate\Support\Facades\Log;
use App\Models\UserSignature;
use Illuminate\Validation\ValidationException;
use App\Services\Notifications\NotificationService;

class ApprovalService
{
    public function __construct(
        protected WorkflowResolverService $workflowResolver,
        protected AccidentTimelineService $timelineService,
        protected NotificationService $notificationService,
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
            logger()->info("1");

            $workflow = $this->workflowResolver->resolve($case);

            logger()->info("2");

            // $workflow = $this->workflowResolver
            //     ->resolve($case);

            foreach ($workflow as $step) {

                $approver = $this->findApprover($step);

                Approval::create([

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
            }

            /*
            |--------------------------------------------------------------------------
            | Later
            |--------------------------------------------------------------------------
            |
            | Timeline
            | Notification
            |
            */
        });
    }

    /**
     * Resolve the user who should approve a workflow step.
     */
    protected function findApprover(WorkflowStep $step): User 
    {

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

        abort_unless(
            $approval->approver_id === $user->id,
            403
        );

        abort_unless(
            $approval->status === 'PENDING',
            400
        );

        $accidentCase = $this->resolveApprovalCase($approval);

        // Determine if the approver requires a signature for this approval step
        $signatureRequired = $user->hasAnyRole([
            'medical_superintendent',
            'regional_director',
            'provincial_director',
            'secretary',
        ]);

        $signature = $signatureRequired
            ? $this->getActiveSignature($user)
            : null;

        DB::transaction(function () use (
            $approval,
            $comments,
            $user,
            $accidentCase,
            $signature,
        ) {

            $approval->update([

                'status' => 'APPROVED',
                'comments' => $comments,
                'acted_at' => now(),
                'user_signature_id' => $signature?->id,
            ]);

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
                        $accidentCase->update(['current_stage' => 'FR109']);
                    }
                }

            }

            $this->timelineService->createDocumentEvent(
                $accidentCase,
                $user,
                $approval->document_type,
                'APPROVED',
                $approval->revision,
                step: $approval->step,
            );
           

            if (!$nextApproval) {
                $this->timelineService->createDocumentEvent(
                    $accidentCase,
                    $user,
                    $approval->document_type,
                    'WORKFLOW_COMPLETED',
                    $approval->revision,
                );
            }

        });

        return $approval->fresh();
    }

    /**
     * Reject current step.
     */
    public function reject(Approval $approval,User $user,string $comments): Approval 
    {
        abort_unless(
            $approval->approver_id === $user->id,
            403
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
            $accidentCase
        ) {

            $approval->update([

                'status' => 'REJECTED',

                'comments' => $comments,

                'acted_at' => now(),

            ]);

            if (in_array($approval->document_type, ['FR1043', 'FR1044'], true)) {
                $document = ($approval->document_type === 'FR1043' ? FR1043::query() : FR1044::query())
                    ->where('accident_case_id', $approval->accident_case_id)
                    ->where('revision', $approval->revision)
                    ->first();

                if ($document) {
                    $document->update(['status' => 'CHANGES_REQUESTED']);

                    if ($approval->document_type === 'FR1043') {
                        $document->creator->notify(new FR1043ChangesRequested($document, $comments));
                    }
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

        });

        return $approval->fresh();
    }

    /** Resolve the case before changing approval state or writing timeline events. */
    protected function resolveApprovalCase(Approval $approval): AccidentCase
    {
        return AccidentCase::query()->findOrFail($approval->accident_case_id);
    }

    /**
     * Pending approvals for logged-in user.
     */
    public function getPendingApprovals(User $user,?string $search = null)
    {
        return Approval::query()

            ->where(
                'approver_id',
                $user->id
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

                'signature',

                'accidentCase.accident',

            ])

            ->latest()

            ->paginate(10);
    }

    /** Decisions already made by the logged-in approver. */
    public function getDecidedApprovals(User $user, ?string $documentType = null, ?string $status = null, ?string $search = null)
    {
        return Approval::query()
            ->where('approver_id', $user->id)
            ->whereIn('status', ['APPROVED', 'REJECTED'])
            ->when($documentType, fn ($query) => $query->where('document_type', $documentType))
            ->when($status, fn ($query) => $query->where('status', $status))
            ->when($search, function ($query) use ($search) {
                $query->whereHas('accidentCase', fn ($case) => $case->where('case_number', 'like', "%{$search}%"));
            })
            ->with([
                'institution',
                'approver.roles',
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
        $counts = Approval::query()
            ->where('approver_id', $user->id)
            ->selectRaw("SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending")
            ->selectRaw("SUM(CASE WHEN status = 'APPROVED' THEN 1 ELSE 0 END) as approved")
            ->selectRaw("SUM(CASE WHEN status = 'REJECTED' THEN 1 ELSE 0 END) as rejected")
            ->selectRaw("SUM(CASE WHEN status IN ('PENDING', 'APPROVED', 'REJECTED') THEN 1 ELSE 0 END) as total")
            ->first();

        return [
            'pending' => (int) $counts->pending,
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
                'institution',
                'signature',
            ])

            ->orderBy('document_type')
            ->orderByDesc('revision')
            ->orderBy('step')

            ->get();
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

        return $signature;
    }
}

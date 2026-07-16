<?php

namespace App\Services\Approval;

use App\DTOs\WorkflowStep;
use App\Models\AccidentCase;
use App\Models\Approval;
use App\Models\FR1043;
use App\Models\User;
use App\Notifications\FR1043ChangesRequested;
use App\Http\Resources\FR1043Resource;
use App\Services\Workflow\WorkflowResolverService;
use App\Services\AccidentTimelineService;
use Illuminate\Support\Facades\DB;
use RuntimeException;
use Illuminate\Support\Facades\Log;

class ApprovalService
{
    public function __construct(
        protected WorkflowResolverService $workflowResolver,
        protected AccidentTimelineService $timelineService
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

        DB::transaction(function () use (
            $approval,
            $comments,
            $user
        ) {

            $approval->update([

                'status' => 'APPROVED',

                'comments' => $comments,

                'acted_at' => now(),

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

                /*
                |--------------------------------------------------------------------------
                | Later
                |--------------------------------------------------------------------------
                |
                | Notify next approver
                |
                */

            } else {
                $fr1043 = FR1043::query()
                    ->where('accident_case_id', $approval->accident_case_id)
                    ->where('revision', $approval->revision)
                    ->first();

                if ($approval->document_type === 'FR1043' && $fr1043) {
                    $fr1043->update([
                        'status' => 'APPROVED',
                        'approved_at' => now(),
                    ]);

                    $approval->accidentCase->update([
                        'current_stage' => 'FR1044',
                    ]);
                }

            }

            $this->timelineService->createDocumentEvent(
                $approval->accidentCase,
                $user,
                $approval->document_type,
                'APPROVED',
                $approval->revision,
                step: $approval->step,
            );

            if (!$nextApproval) {
                $this->timelineService->createDocumentEvent(
                    $approval->accidentCase,
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

        DB::transaction(function () use (
            $approval,
            $comments,
            $user
        ) {

            $approval->update([

                'status' => 'REJECTED',

                'comments' => $comments,

                'acted_at' => now(),

            ]);

            if ($approval->document_type === 'FR1043') {
                $fr1043 = FR1043::query()
                    ->where('accident_case_id', $approval->accident_case_id)
                    ->where('revision', $approval->revision)
                    ->first();

                if ($fr1043) {
                    $fr1043->update(['status' => 'CHANGES_REQUESTED']);
                    $fr1043->creator->notify(new FR1043ChangesRequested($fr1043, $comments));
                }
            }

            $this->timelineService->createDocumentEvent(
                $approval->accidentCase,
                $user,
                $approval->document_type,
                'REJECTED',
                $approval->revision,
                comments: $comments,
            );

        });

        return $approval->fresh();
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

                'accidentCase.accident',

            ])

            ->latest()

            ->paginate(10);
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
            ])

            ->orderBy('document_type')
            ->orderByDesc('revision')
            ->orderBy('step')

            ->get();
    }
}

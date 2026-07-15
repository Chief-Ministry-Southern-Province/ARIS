<?php

namespace App\Services\Approval;

use App\DTOs\WorkflowStep;
use App\Models\AccidentCase;
use App\Models\Approval;
use App\Models\FR1043;
use App\Models\User;
use App\Notifications\FR1043ChangesRequested;
use App\Services\Workflow\WorkflowResolverService;
use App\Services\AccidentTimelineService;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ApprovalService
{
    public function __construct(
        protected WorkflowResolverService $workflowResolver,
        protected AccidentTimelineService $timelineService
    ) {}

    /**
     * Create approval workflow for a document.
     */
    public function submit(AccidentCase $case,string $documentType,int $revision): void 
    {
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

            $workflow = $this->workflowResolver
                ->resolve($case);

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
                }

            }

            $action = $nextApproval ? 'FR1043_APPROVAL_STEP_APPROVED' : 'FR1043_APPROVED';
            $description = $nextApproval
                ? "FR1043 revision {$approval->revision} approved at step {$approval->step}."
                : "FR1043 revision {$approval->revision} fully approved.";

            $this->timelineService->create($approval->accidentCase, $user, $action, $description);

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

            $this->timelineService->create(
                $approval->accidentCase,
                $user,
                'FR1043_REJECTED',
                "FR1043 revision {$approval->revision} rejected: {$comments}"
            );

        });

        return $approval->fresh();
    }

    /**
     * Pending approvals for logged-in user.
     */
    public function getPendingApprovals(User $user) {

        return Approval::query()

            ->where(
                'approver_id',
                $user->id
            )

            ->where(
                'status',
                'PENDING'
            )

            ->with([
                'accidentCase.creator',
                'institution',
                'approver.roles',
            ])

            ->orderBy('created_at')

            ->paginate(15);
    }

    /**
     * Approval history.
     */
    public function getApprovalHistory(AccidentCase $case,string $documentType,?int $revision = null) 
    {

        $query = Approval::query()

            ->where(
                'accident_case_id',
                $case->id
            )

            ->where(
                'document_type',
                $documentType
            );

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

            ->orderBy('step')

            ->get();
    }
}

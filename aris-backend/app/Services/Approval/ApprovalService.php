<?php

namespace App\Services\Approval;

use App\Data\WorkflowStep;
use App\Models\AccidentCase;
use App\Models\Approval;
use App\Models\User;
use App\Services\Workflow\WorkflowResolverService;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class ApprovalService
{
    public function __construct(
        protected WorkflowResolverService $workflowResolver
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
            $comments
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

                /*
                |--------------------------------------------------------------------------
                | Workflow Completed
                |--------------------------------------------------------------------------
                |
                | Later:
                |
                | Update Form Status
                | Timeline
                | Notification
                | Change Case Stage
                |
                */

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
            $comments
        ) {

            $approval->update([

                'status' => 'REJECTED',

                'comments' => $comments,

                'acted_at' => now(),

            ]);

            /*
            |--------------------------------------------------------------------------
            | Later
            |--------------------------------------------------------------------------
            |
            | Update document status to CHANGES_REQUESTED
            | Timeline
            | Notify Subject Officer
            |
            */

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
                'accidentCase',
                'institution',
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
                'approver.roles',
                'institution',
            ])

            ->orderBy('step')

            ->get();
    }
}
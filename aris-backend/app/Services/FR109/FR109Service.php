<?php

namespace App\Services\FR109;

use App\Models\AccidentCase;
use App\Models\Approval;
use App\Models\FR109;
use App\Models\User;
use App\Services\AccidentTimelineService;
use App\Services\Approval\ApprovalService;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class FR109Service
{
    public function __construct(
        protected ApprovalService $approvalService,
        protected AccidentTimelineService $timelineService,
    ) {
    }

    public function saveDraft(AccidentCase $case, User $user, array $data): FR109
    {
        if (filled($data['secretaryOfMinistry'] ?? null)) {
            $user->loadMissing('institution');

            abort_unless(
                $user->hasRole('subject_officer') && $user->institution?->type === 'PDHS',
                403,
                'Only a PDHS Subject Officer can complete the Secretary to the Ministry of field.'
            );
        }

        return DB::transaction(function () use ($case, $user, $data) {
            $latest = $case->fr109s()->latest('revision')->first();

            if (! $latest) {
                $this->ensureFR1044Approved($case);
                $latest = FR109::create([
                    'reference_number' => $this->generateReferenceNumber(),
                    'accident_case_id' => $case->id,
                    'created_by' => $user->id,
                    'revision' => 1,
                    'status' => 'DRAFT',
                    'data' => $data,
                ]);
                $action = 'DRAFT_CREATED';
            } else {
                abort_unless($latest->created_by === $user->id, 403);

                if ($latest->status === 'CHANGES_REQUESTED') {
                    $latest = FR109::create([
                        'reference_number' => $latest->reference_number,
                        'accident_case_id' => $case->id,
                        'created_by' => $user->id,
                        'revision' => $latest->revision + 1,
                        'status' => 'DRAFT',
                        'data' => $data,
                    ]);
                    $action = 'REVISION_CREATED';
                } else {
                    abort_unless($latest->status === 'DRAFT', 400, 'This form cannot be edited.');
                    $latest->update(['data' => $data]);
                    $action = 'DRAFT_UPDATED';
                }
            }

            $case->update([
                'current_stage' => 'FR109',
                'status' => 'IN_PROGRESS',
            ]);

            $this->timelineService->createDocumentEvent(
                $case,
                $user,
                'FR109',
                $action,
                $latest->revision,
                $latest->reference_number,
            );

            return $latest->fresh();
        });
    }

    public function submit(FR109 $fr109, User $user): FR109
    {
        abort_unless($fr109->created_by === $user->id && $fr109->status === 'DRAFT', 400, 'This form cannot be submitted.');

        if (blank($fr109->data['netLoss'] ?? null)) {
            throw ValidationException::withMessages([
                'data.netLoss' => 'Net loss is required to determine the FR109 approval workflow.',
            ]);
        }

        return DB::transaction(function () use ($fr109, $user) {
            $fr109->update(['status' => 'UNDER_APPROVAL', 'submitted_at' => now()]);
            $this->approvalService->submit($fr109->accidentCase, 'FR109', $fr109->revision);
            $fr109->accidentCase->update([
                'current_stage' => 'FR109',
                'status' => 'IN_PROGRESS',
            ]);
            $this->timelineService->createDocumentEvent(
                $fr109->accidentCase,
                $user,
                'FR109',
                $fr109->revision > 1 ? 'RESUBMITTED' : 'SUBMITTED',
                $fr109->revision,
                $fr109->reference_number,
            );

            return $fr109->fresh();
        });
    }

    public function latest(AccidentCase $case): ?FR109
    {
        return $case->fr109s()->latest('revision')->first();
    }

    /**
     * The approved FR109 remains immutable except for Part G, which is
     * completed by the officer who created the document after approval.
     */
    public function updateWriteOffEntries(FR109 $fr109, User $user, array $writeOffEntries): FR109
    {
        abort_unless($fr109->created_by === $user->id, 403, 'Only the FR109 creator can complete the write-off register.');
        abort_unless($fr109->status === 'APPROVED', 409, 'Write-off details can be completed only after final FR109 approval.');

        return DB::transaction(function () use ($fr109, $user, $writeOffEntries) {
            $data = $fr109->data;
            $data['writeOffEntries'] = $writeOffEntries;

            $fr109->update(['data' => $data]);

            $this->timelineService->createDocumentEvent(
                $fr109->accidentCase,
                $user,
                'FR109',
                'WRITE_OFF_NOTED',
                $fr109->revision,
                $fr109->reference_number,
            );

            return $fr109->fresh();
        });
    }

    /** Complete Part I before the Ministry Account Subject Officer recommends FR109. */
    public function updateChiefAccountingOrder(FR109 $fr109, User $user, array $data): FR109
    {
        $isAssignedMinistryAccountSubjectOfficer = Approval::query()
            ->where('accident_case_id', $fr109->accident_case_id)
            ->where('document_type', 'FR109')
            ->where('revision', $fr109->revision)
            ->where('approver_id', $user->id)
            ->where('status', 'PENDING')
            ->exists();

        abort_unless(
            $user->hasRole('ministry_account_subject_officer') && $isAssignedMinistryAccountSubjectOfficer,
            403,
            'Only the assigned Ministry Account Subject Officer can complete the Chief Accounting Officer order.'
        );

        return DB::transaction(function () use ($fr109, $user, $data) {
            $documentData = $fr109->data;
            $documentData['chiefAccountingOfficerSTNo'] = $data['chiefAccountingOfficerSTNo'];
            $documentData['chiefAccountingOfficerRefNo'] = $data['chiefAccountingOfficerRefNo'];
            $fr109->update(['data' => $documentData]);

            $this->timelineService->createDocumentEvent(
                $fr109->accidentCase,
                $user,
                'FR109',
                'CHIEF_ACCOUNTING_ORDER_COMPLETED',
                $fr109->revision,
                $fr109->reference_number,
            );

            return $fr109->fresh();
        });
    }

    /** Record Part J without changing the Chief Secretary's approval decision. */
    public function updateChiefSecretaryDecision(FR109 $fr109, User $user, array $data): FR109
    {
        $isPendingChiefSecretary = Approval::query()
            ->where('accident_case_id', $fr109->accident_case_id)
            ->where('document_type', 'FR109')
            ->where('revision', $fr109->revision)
            ->where('approver_id', $user->id)
            ->where('status', 'PENDING')
            ->exists();

        abort_unless(
            $user->hasRole('chief_secretary') && $isPendingChiefSecretary,
            403,
            'Only the pending Chief Secretary can complete the write-off decision.'
        );

        return DB::transaction(function () use ($fr109, $user, $data) {
            $documentData = $fr109->data;
            $documentData['chiefSecretaryToMinistryOf'] = $data['secretaryToMinistryOf'];
            $documentData['chiefSecretaryRefNo'] = $data['refNo'];
            $documentData['writeOffStatus'] = $data['writeOffStatus'];
            $fr109->update(['data' => $documentData]);

            $this->timelineService->createDocumentEvent(
                $fr109->accidentCase,
                $user,
                'FR109',
                'WRITE_OFF_DECISION_RECORDED',
                $fr109->revision,
                $fr109->reference_number,
            );

            return $fr109->fresh();
        });
    }

    private function ensureFR1044Approved(AccidentCase $case): void
    {
        abort_unless($case->fr1044s()->latest('revision')->value('status') === 'APPROVED', 409, 'An approved FR1044 report is required before creating FR109.');
    }

    private function generateReferenceNumber(): string
    {
        return sprintf('FR109-%d-%04d', now()->year, (FR109::max('id') ?? 0) + 1);
    }
}

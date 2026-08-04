<?php

namespace App\Services\FR109;

use App\Models\AccidentCase;
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
            $fr109->accidentCase->update(['current_stage' => 'FR109']);
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

    private function ensureFR1044Approved(AccidentCase $case): void
    {
        abort_unless($case->fr1044s()->latest('revision')->value('status') === 'APPROVED', 409, 'An approved FR1044 report is required before creating FR109.');
    }

    private function generateReferenceNumber(): string
    {
        return sprintf('FR109-%d-%04d', now()->year, (FR109::max('id') ?? 0) + 1);
    }
}

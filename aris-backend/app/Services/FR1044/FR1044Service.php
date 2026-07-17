<?php

namespace App\Services\FR1044;

use App\Models\AccidentCase;
use App\Models\FR1044;
use App\Models\AccidentEvidence;
use App\Models\User;
use App\Services\Approval\ApprovalService;
use App\Services\AccidentTimelineService;
use Illuminate\Support\Facades\DB;

class FR1044Service
{
  public function __construct(
      protected ApprovalService $approvalService,
      protected AccidentTimelineService $timelineService
  ) {}

  protected function generateReferenceNumber(): string
  {
      $year = now()->year;
      $last = FR1044::latest('id')->first();
      $next = $last ? $last->id + 1 : 1;

      return sprintf(
          'FR1044-%d-%04d',
          $year,
          $next
      );
  }

  public function createDraft(AccidentCase $case,User $user,array $data): FR1044 
  {
      return DB::transaction(function () use ($case,$user,$data) {

          abort_if(
              $case->fr1044s()->exists(),
              409,
              'An FR1044 form already exists for this case.'
          );

          $fr1044 = FR1044::create([
              'reference_number' => $this->generateReferenceNumber(),
              'accident_case_id' => $case->id,
              'created_by' => $user->id,
              'revision' => 1,
              'status' => 'DRAFT',
              'data' => $data,
          ]);

          $this->timelineService->createDocumentEvent(
            $case,
            $user,
            'FR1044',
            'DRAFT_CREATED',
            $fr1044->revision,
            $fr1044->reference_number
          );

          return $fr1044;
      });
  }

  public function updateDraft(FR1044 $fr1044, User $user, array $data): FR1044
  {
      abort_unless($fr1044->created_by === $user->id, 403);
      $this->validateEvidenceReferences($fr1044->accidentCase, $data);

      if ($fr1044->status === 'CHANGES_REQUESTED') {
          return $this->createRevision($fr1044, $user, $data);
      }

      abort_unless(
          $fr1044->status === 'DRAFT',
          400,
          'This form cannot be edited.'
      );

      $fr1044->update([
          'data' => $data,
      ]);

      $this->timelineService->createDocumentEvent(
          $fr1044->accidentCase,
          $user,
          'FR1044',
          'DRAFT_UPDATED',
          $fr1044->revision,
          $fr1044->reference_number,
      );

      return $fr1044->fresh();
  }

  /** Ensure attachment IDs are evidence for this case's accident and FR1044. */
  protected function validateEvidenceReferences(AccidentCase $case, array $data): void
  {
      $ids = collect([
          $data['policeReportEvidenceId'] ?? null,
          $data['courtOrderEvidenceId'] ?? null,
          $data['boardReportEvidenceId'] ?? null,
      ])->filter()->unique()->values();

      if ($ids->isEmpty()) {
          return;
      }

      $valid = AccidentEvidence::query()
          ->where('accident_id', $case->accident_id)
          ->where('document_type', 'FR1044')
          ->whereIn('id', $ids)
          ->count();

      abort_unless($valid === $ids->count(), 422, 'One or more attachments do not belong to this FR1044 case.');
  }

  protected function createRevision(FR1044 $rejectedRevision, User $user, array $data): FR1044
  {
      return DB::transaction(function () use ($rejectedRevision, $user, $data) {
          $rejectedRevision = FR1044::query()->lockForUpdate()->findOrFail($rejectedRevision->id);

          abort_unless($rejectedRevision->status === 'CHANGES_REQUESTED', 400, 'This form cannot be revised.');

          $latest = FR1044::query()
              ->where('accident_case_id', $rejectedRevision->accident_case_id)
              ->lockForUpdate()
              ->latest('revision')
              ->firstOrFail();

          abort_unless($latest->id === $rejectedRevision->id, 409, 'A newer revision already exists.');

          $revision = FR1044::create([
              'reference_number' => $rejectedRevision->reference_number,
              'accident_case_id' => $rejectedRevision->accident_case_id,
              'created_by' => $user->id,
              'revision' => $rejectedRevision->revision + 1,
              'status' => 'DRAFT',
              'data' => $data,
          ]);

          $this->timelineService->createDocumentEvent(
              $revision->accidentCase,
              $user,
              'FR1044',
              'REVISION_CREATED',
              $revision->revision,
              $revision->reference_number,
              sourceRevision: $rejectedRevision->revision,
          );

          return $revision;
      });
  }

  public function submit(FR1044 $fr1044, User $user): FR1044
  {
    abort_unless($fr1044->created_by === $user->id, 403);

    abort_unless(
        $fr1044->status === 'DRAFT',
        400
    );

    return DB::transaction(function () use ($fr1044, $user) {

        $fr1044->update([
            'status' => 'UNDER_APPROVAL',
            'submitted_at' => now(),
        ]);

        $this->approvalService->submit(

            case: $fr1044->accidentCase,

            documentType: 'FR1044',

            revision: $fr1044->revision,

        );

        $fr1044->accidentCase->update(['current_stage' => 'FR1044']);

        $isResubmission = $fr1044->revision > 1;
        $this->timelineService->createDocumentEvent(
            $fr1044->accidentCase,
            $user,
            'FR1044',
            $isResubmission ? 'RESUBMITTED' : 'SUBMITTED',
            $fr1044->revision,
            $fr1044->reference_number,
        );

        return $fr1044->fresh();

    });
  }

  public function getLatest(AccidentCase $case): ?FR1044 
  {
    return $case->fr1044s()
        ->latest('revision')
        ->first();
  }

  public function getHistory(AccidentCase $case)
  {
      return $case->fr1044s()
          ->latest('revision')
          ->get();
  }

  public function getRevision(AccidentCase $case, int $revision): ?FR1044
  {
      return $case->fr1044s()
          ->where('revision', $revision)
          ->first();
  }

  public function getByReference(string $reference): ?FR1044
  {
      return FR1044::query()
          ->where(
              'reference_number',
              $reference
          )
          ->latest('revision')
          ->first();
  }

}

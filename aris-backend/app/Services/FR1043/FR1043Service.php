<?php

namespace App\Services\FR1043;

use App\Models\AccidentCase;
use App\Models\FR1043;
use App\Models\User;
use App\Services\Approval\ApprovalService;
use App\Services\AccidentTimelineService;
use App\Services\FRSubmissionValidationService;
use Illuminate\Support\Facades\DB;

class FR1043Service
{
  public function __construct(
      protected ApprovalService $approvalService,
      protected AccidentTimelineService $timelineService,
      protected FRSubmissionValidationService $submissionValidator,
  ) {}

  public function createDraft(AccidentCase $case,User $user,array $data): FR1043 
  {

      return DB::transaction(function () use ($case,$user,$data) {

          abort_if(
              $case->fr1043s()->exists(),
              409,
              'An FR1043 form already exists for this case.'
          );

          $fr1043 = FR1043::create([

              'reference_number' => $case->case_number,

              'accident_case_id' => $case->id,

              'created_by' => $user->id,

              'revision' => 1,

              'status' => 'DRAFT',

              'data' => $data,

          ]);

          $this->timelineService->createDocumentEvent(
              $case,
              $user,
              'FR1043',
              'DRAFT_CREATED',
              $fr1043->revision,
              $fr1043->reference_number,
          );

          return $fr1043;

      });
  }

  public function updateDraft(FR1043 $fr1043, User $user, array $data): FR1043
  {
      abort_unless($fr1043->created_by === $user->id, 403);

      if ($fr1043->status === 'CHANGES_REQUESTED') {
          return $this->createRevision($fr1043, $user, $data);
      }

      abort_unless(
          $fr1043->status === 'DRAFT',
          400,
          'This form cannot be edited.'
      );

      $fr1043->update([
          'data' => $data,
      ]);

      $this->timelineService->createDocumentEvent(
          $fr1043->accidentCase,
          $user,
          'FR1043',
          'DRAFT_UPDATED',
          $fr1043->revision,
          $fr1043->reference_number,
      );

      return $fr1043->fresh();
  }

  /** Start a new immutable revision from a rejected document. */
  protected function createRevision(FR1043 $rejectedRevision, User $user, array $data): FR1043
  {
      return DB::transaction(function () use ($rejectedRevision, $user, $data) {
          $rejectedRevision = FR1043::query()->lockForUpdate()->findOrFail($rejectedRevision->id);

          abort_unless($rejectedRevision->status === 'CHANGES_REQUESTED', 400, 'This form cannot be revised.');

          $latest = FR1043::query()
              ->where('accident_case_id', $rejectedRevision->accident_case_id)
              ->lockForUpdate()
              ->latest('revision')
              ->firstOrFail();

          abort_unless($latest->id === $rejectedRevision->id, 409, 'A newer revision already exists.');

          $revision = FR1043::create([
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
              'FR1043',
              'REVISION_CREATED',
              $revision->revision,
              $revision->reference_number,
              sourceRevision: $rejectedRevision->revision,
          );

          return $revision;
      });
  }

  public function submit(FR1043 $fr1043, User $user): FR1043
  {
    abort_unless($fr1043->created_by === $user->id, 403);

    abort_unless(
        $fr1043->status === 'DRAFT',
        400
    );

    $this->submissionValidator->validateFR1043($fr1043->data ?? []);

    return DB::transaction(function () use ($fr1043, $user) {

        $fr1043->update([
            'status' => 'UNDER_APPROVAL',
            'submitted_at' => now(),
        ]);

        $this->approvalService->submit(

            case: $fr1043->accidentCase,

            documentType: 'FR1043',

            revision: $fr1043->revision,

        );

        $fr1043->accidentCase->update(['current_stage' => 'FR1043']);

        $isResubmission = $fr1043->revision > 1;
        $this->timelineService->createDocumentEvent(
            $fr1043->accidentCase,
            $user,
            'FR1043',
            $isResubmission ? 'RESUBMITTED' : 'SUBMITTED',
            $fr1043->revision,
            $fr1043->reference_number,
        );

        return $fr1043->fresh();

    });
  }

  public function getLatest(AccidentCase $case): ?FR1043 
  {
    return $case->fr1043s()
        ->latest('revision')
        ->first();
  }

  public function getHistory(AccidentCase $case)
  {
      return $case->fr1043s()
          ->latest('revision')
          ->get();
  }

  public function getRevision(AccidentCase $case, int $revision): ?FR1043
  {
      return $case->fr1043s()
          ->where('revision', $revision)
          ->first();
  }

  public function getByReference(string $reference): ?FR1043
  {
      return FR1043::query()
          ->where(
              'reference_number',
              $reference
          )
          ->latest('revision')
          ->first();
  }
}

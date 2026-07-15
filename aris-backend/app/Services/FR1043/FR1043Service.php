<?php

namespace App\Services\FR1043;

use App\Models\AccidentCase;
use App\Models\FR1043;
use App\Models\User;
use App\Services\Approval\ApprovalService;
use App\Services\AccidentTimelineService;
use Illuminate\Support\Facades\DB;

class FR1043Service
{
  public function __construct(
      protected ApprovalService $approvalService,
      protected AccidentTimelineService $timelineService
  ) {}

  protected function generateReferenceNumber(): string
  {
      $year = now()->year;

      $last = FR1043::latest('id')->first();

      $next = $last ? $last->id + 1 : 1;

      return sprintf(
          'FR1043-%d-%04d',
          $year,
          $next
      );
  }

  public function createDraft(AccidentCase $case,User $user,array $data): FR1043 
  {

      return DB::transaction(function () use ($case,$user,$data) {

          $latest = $case->fr1043s()
              ->latest('revision')
              ->first();

          $revision = $latest
              ? $latest->revision + 1
              : 1;

          $fr1043 = FR1043::create([

              'reference_number' => $this->generateReferenceNumber(),

              'accident_case_id' => $case->id,

              'created_by' => $user->id,

              'revision' => $revision,

              'status' => 'DRAFT',

              'data' => $data,

          ]);

          $this->timelineService->create(
              $case,
              $user,
              'FR1043_DRAFT_CREATED',
              "FR1043 draft {$fr1043->reference_number} (revision {$fr1043->revision}) created."
          );

          return $fr1043;

      });
  }

  public function updateDraft(FR1043 $fr1043, User $user, array $data): FR1043
  {
      abort_unless(
          in_array(
              $fr1043->status,
              [
                  'DRAFT',
                  'CHANGES_REQUESTED',
              ]
          ),
          400,
          'This form cannot be edited.'
      );

      $fr1043->update([
          'data' => $data,
      ]);

      $this->timelineService->create(
          $fr1043->accidentCase,
          $user,
          'FR1043_DRAFT_UPDATED',
          "FR1043 draft {$fr1043->reference_number} (revision {$fr1043->revision}) updated."
      );

      return $fr1043->fresh();
  }

  public function submit(FR1043 $fr1043, User $user): FR1043
  {
    abort_unless(
        in_array(
            $fr1043->status,
            [
                'DRAFT',
                'CHANGES_REQUESTED',
            ]
        ),
        400
    );

    return DB::transaction(function () use ($fr1043, $user) {

        if ($fr1043->status === 'CHANGES_REQUESTED') {
            $previousRevision = $fr1043;
            $fr1043 = FR1043::create([
                'reference_number' => $previousRevision->reference_number,
                'accident_case_id' => $previousRevision->accident_case_id,
                'created_by' => $user->id,
                'revision' => $previousRevision->revision + 1,
                'status' => 'DRAFT',
                'data' => $previousRevision->data,
            ]);

            $this->timelineService->create(
                $fr1043->accidentCase,
                $user,
                'FR1043_RESUBMITTED',
                "FR1043 {$fr1043->reference_number} resubmitted as revision {$fr1043->revision}."
            );
        }

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

        $this->timelineService->create(
            $fr1043->accidentCase,
            $user,
            'FR1043_SUBMITTED',
            "FR1043 {$fr1043->reference_number} (revision {$fr1043->revision}) submitted for approval."
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

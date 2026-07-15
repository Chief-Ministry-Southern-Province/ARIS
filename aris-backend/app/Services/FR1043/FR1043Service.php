<?php

namespace App\Services\FR1043;

use App\Models\AccidentCase;
use App\Models\FR1043;
use App\Models\User;
use App\Services\Approval\ApprovalService;
use Illuminate\Support\Facades\DB;

class FR1043Service
{
  public function __construct(
      protected ApprovalService $approvalService
  ) {}

  public function createDraft(AccidentCase $case,User $user,array $data): FR1043 
  {

      return DB::transaction(function () use ($case,$user,$data) {

          $latest = $case->fr1043s()
              ->latest('revision')
              ->first();

          $revision = $latest
              ? $latest->revision + 1
              : 1;

          return FR1043::create([

              'accident_case_id' => $case->id,

              'created_by' => $user->id,

              'revision' => $revision,

              'status' => 'DRAFT',

              'data' => $data,

          ]);

      });
  }

  public function updateDraft(FR1043 $fr1043,array $data): FR1043 
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

      return $fr1043->fresh();
  }

  public function submit(FR1043 $fr1043): FR1043 
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

    DB::transaction(function () use ($fr1043) {

        $fr1043->update([
            'status' => 'UNDER_APPROVAL',
            'submitted_at' => now(),
        ]);

        $this->approvalService->submit(

            case: $fr1043->accidentCase,

            documentType: 'FR1043',

            revision: $fr1043->revision,

        );

        /*
        | Timeline
        | Notification
        | Case Stage
        */

    });

    return $fr1043->fresh();
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
}
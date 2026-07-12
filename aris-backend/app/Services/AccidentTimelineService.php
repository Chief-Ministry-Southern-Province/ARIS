<?php

namespace App\Services;

use App\Models\AccidentCase;
use App\Models\User;
use App\Models\CaseHistory;

class AccidentTimelineService
{
  public function create(
    AccidentCase $accidentCase,
    ?User $user,
    string $action,
    ?string $description,
    ?array $oldValue = null,
    ?array $newValue = null
  ): CaseHistory {
    return CaseHistory::create([
      'accident_case_id' => $accidentCase->id,
      'user_id' => $user?->id,
      'action' => $action,
      'description' => $description,
      'old_value' => $oldValue,
      'new_value' => $newValue,
    ]);
  }


}
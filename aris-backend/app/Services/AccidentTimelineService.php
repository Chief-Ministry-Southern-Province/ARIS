<?php

namespace App\Services;

use App\Models\AccidentCase;
use App\Models\User;
use App\Models\CaseHistory;

class AccidentTimelineService
{
  public function create(AccidentCase $accidentCase,?User $user,string $action,?string $description,?array $oldValue = null,?array $newValue = null
  ): CaseHistory 
  {
    return CaseHistory::create([
      'accident_case_id' => $accidentCase->id,
      'user_id' => $user?->id,
      'action' => $action,
      'description' => $description,
      'old_value' => $oldValue,
      'new_value' => $newValue,
    ]);
  }

  public function getTimelineForCase(AccidentCase $accidentCase,?string $search = null,int $perPage = 10)
  {
    $query = CaseHistory::where('accident_case_id', $accidentCase->id)
      ->with(['user'])
      ->orderBy('created_at', 'desc');

    if ($search) {
      $query->where(function ($q) use ($search) {
        $q->where('action', 'like', "%{$search}%")
          ->orWhere('description', 'like', "%{$search}%")
          ->orWhere('accident_case_id', 'like', "%{$search}%");
      });
    }

    return $query->paginate($perPage);
  }
 
}
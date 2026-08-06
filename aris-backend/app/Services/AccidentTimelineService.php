<?php

namespace App\Services;

use App\Models\AccidentCase;
use App\Models\User;
use App\Models\CaseHistory;

class AccidentTimelineService
{
  /**
   * Record a document workflow event with one consistent action and description format.
   */
  public function createDocumentEvent(
      AccidentCase $accidentCase,
      ?User $user,
      string $documentType,
      string $event,
      int $revision,
      ?string $referenceNumber = null,
      ?int $step = null,
      ?string $comments = null,
      ?int $sourceRevision = null,
  ): CaseHistory {
    $document = $referenceNumber
      ? "{$documentType} {$referenceNumber}"
      : $documentType;
    $revisionLabel = "revision {$revision}";

    $description = match ($event) {
      'DRAFT_CREATED' => "{$document} draft {$revisionLabel} created.",
      'DRAFT_UPDATED' => "{$document} draft {$revisionLabel} updated.",
      'SUBMITTED' => "{$document} {$revisionLabel} submitted for approval.",
      'REVISION_CREATED' => "{$document} {$revisionLabel} created from rejected revision {$sourceRevision}.",
      'RESUBMITTED' => "{$document} {$revisionLabel} resubmitted for approval.",
      'RECOMMENDED' => "{$document} {$revisionLabel} recommended at step {$step}.",
      'APPROVED' => "{$document} {$revisionLabel} approved at step {$step}.",
      'REJECTED' => "{$document} {$revisionLabel} rejected: {$comments}",
      'WORKFLOW_COMPLETED' => "{$document} {$revisionLabel} approval workflow completed.",
      'WRITE_OFF_NOTED' => "{$document} {$revisionLabel} write-off register completed.",
      'CHIEF_ACCOUNTING_ORDER_COMPLETED' => "{$document} {$revisionLabel} Chief Accounting Officer order completed.",
      'WRITE_OFF_DECISION_RECORDED' => "{$document} {$revisionLabel} write-off decision recorded.",
      default => "{$document} {$revisionLabel} {$event}.",
    };

    return $this->create(
      $accidentCase,
      $user,
      "{$documentType}_{$event}",
      $description,
    );
  }

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

  public function getTimelineForCase(AccidentCase $accidentCase)
  {
      return CaseHistory::where('accident_case_id', $accidentCase->id)
          ->with('user')
          ->latest()
          ->get()->reverse();
  }
 
}

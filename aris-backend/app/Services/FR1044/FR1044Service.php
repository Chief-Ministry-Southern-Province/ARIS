<?php

namespace App\Services\FR1044;

use App\Models\AccidentCase;
use App\Models\FR1044;
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

      $last = FR1044::latest('id')->first();

      $next = $last ? $last->id + 1 : 1;

      return sprintf(
          'FR1044-%d-%04d',
          $year,
          $next
      );
  }
}
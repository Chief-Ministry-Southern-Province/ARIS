<?php

namespace App\DTOs;

use App\Models\Institution;

class WorkflowStep
{
    public function __construct(
        public int $step,
        public Institution $institution,
        public string $role,
        public ?string $district = null,
        public ?int $approverId = null,
    ) {}
}

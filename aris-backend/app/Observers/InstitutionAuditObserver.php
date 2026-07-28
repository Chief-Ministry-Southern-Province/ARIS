<?php

namespace App\Observers;

use App\Enums\AuditModule;

class InstitutionAuditObserver extends AuditsModelChanges
{
    protected function module(): AuditModule { return AuditModule::INSTITUTIONS; }
}

<?php

namespace App\Observers;

use App\Enums\AuditModule;

class AccidentAuditObserver extends AuditsModelChanges
{
    protected function module(): AuditModule { return AuditModule::ACCIDENTS; }
}

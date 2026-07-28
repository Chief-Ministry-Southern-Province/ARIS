<?php

namespace App\Observers;

use App\Enums\AuditModule;

class VehicleAuditObserver extends AuditsModelChanges
{
    protected function module(): AuditModule { return AuditModule::VEHICLES; }
}

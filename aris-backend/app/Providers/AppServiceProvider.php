<?php

namespace App\Providers;

use App\Models\Institution;
use App\Models\Accident;
use App\Models\User;
use App\Models\Vehicle;
use App\Observers\InstitutionAuditObserver;
use App\Observers\AccidentAuditObserver;
use App\Observers\UserAuditObserver;
use App\Observers\VehicleAuditObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        User::observe(UserAuditObserver::class);
        Vehicle::observe(VehicleAuditObserver::class);
        Institution::observe(InstitutionAuditObserver::class);
        Accident::observe(AccidentAuditObserver::class);
    }
}

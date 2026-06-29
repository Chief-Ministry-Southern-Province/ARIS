<?php

namespace App\Models\Traits;

use App\Models\Scopes\InstitutionScope;

trait BelongsToInstitution
{
    protected static function bootBelongsToInstitution(): void
    {
        static::addGlobalScope(new InstitutionScope());

        static::creating(function ($model) {

            if (!auth()->check()) {
                return;
            }

            $user = auth()->user();

            if ($user->isSystemAdmin()) {
                return;
            }

            if (empty($model->institution_id)) {
                $model->institution_id = $user->institution_id;
            }

        });
    }
}
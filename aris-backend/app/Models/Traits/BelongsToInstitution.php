<?php

namespace App\Models\Traits;

use App\Models\Scopes\InstitutionScope;

trait BelongsToInstitution
{
    protected static function bootBelongsToInstitution(): void
    {
        /**
         * Apply the InstitutionScope to the model.
         */
        static::addGlobalScope(new InstitutionScope());

        /**
         * Set the institution_id to the authenticated user's institution_id.
         */
        // static::creating(function ($model) {

        //     if (!auth()->check()) {
        //         return;
        //     } 

        //     $user = auth()->user();

        //     if ($user->isSystemAdmin()) {
        //         return;
        //     }

        //     if (empty($model->institution_id)) {
        //         $model->institution_id = $user->institution_id;
        //     }

        // });
    }
}
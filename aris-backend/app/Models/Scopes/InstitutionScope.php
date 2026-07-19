<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use App\Services\InstitutionService;

class InstitutionScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        if (!auth()->check()) {
            return;
        }

        $user = auth()->user();

        if ($user->isSystemAdmin()) {
            return;
        }

         $institutionIds = app(InstitutionService::class)->accessibleInstitutionIds($user);

        $builder->whereIn(
            $model->qualifyColumn('institution_id'),
            $institutionIds
        );
    }
}

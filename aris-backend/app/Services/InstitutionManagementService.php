<?php

namespace App\Services;

use App\Models\Institution;
use App\Models\User;

class InstitutionManagementService
{
    public function allowedInstitutionTypes(User $user): array
    {
        if ($user->isSystemAdmin()) {
            return [
                'PDHS',
                'RDHS',
                'BASE_HOSPITAL',
            ];
        }

        if ($user->hasRole('subject_officer')) {
            return match ($user->institution->type) {

                'PDHS' => [],

                'RDHS' => [
                    'DIVISIONAL_HOSPITAL',
                    'MOH',
                    'PMCU',
                    'UNITS',
                    'OTHER',
                ],

                default => [],
            };
        }

        return [];
    }

    public function canCreateInstitution(User $user, string $type): bool
    {
        return in_array($type, $this->allowedInstitutionTypes($user));
    }

    public function expectedParentType(string $type): ?string
    {
        return match ($type) {

            'PDHS' => 'MINISTRY',

            'RDHS' => 'PDHS',

            'BASE_HOSPITAL' => 'PDHS',

            'DIVISIONAL_HOSPITAL' => 'RDHS',

            'MOH' => 'RDHS',

            'PMCU' => 'RDHS',

            'UNITS' => 'RDHS',

            'OTHER' => 'RDHS',

            default => null,
        };
    }

    public function validateParent(string $institutionType, Institution $parent): bool
    {
        return $parent->type === $this->expectedParentType($institutionType);
    }

    
    public function createInstitution(array $data,User $user): Institution 
    {

        if (! $this->canCreateInstitution($user, $data['type'])) {
            abort(403, 'You are not allowed to create this institution.');
        }

        if (!empty($data['parent_institution_id'])) {

            $parent = Institution::findOrFail(
                $data['parent_institution_id']
            );

            if (! $this->validateParent($data['type'], $parent)) {

                throw new \InvalidArgumentException(
                    'Invalid parent institution.'
                );

            }
        }

        return Institution::create($data);
    }

    public function updateInstitution(Institution $institution,array $data,User $user): Institution 
    {

        if (!empty($data['parent_institution_id'])) {

            $parent = Institution::findOrFail(
                $data['parent_institution_id']
            );

            if (! $this->validateParent($data['type'] ?? $institution->type, $parent)) {

                throw new \InvalidArgumentException(
                    'Invalid parent institution.'
                );

            }
        }

        $institution->update($data);

        return $institution->fresh();
    }

    public function canDeleteInstitution(User $user, Institution $institution): bool 
    {

        if ($user->isSystemAdmin()) {
            return true;
        }

        if ($institution->childInstitutions()->exists()) {
            return false;
        }
        return false;
    }

    public function deleteInstitution(Institution $institution,User $user): bool 
    {

        if (! $this->canDeleteInstitution( $user,$institution)) {

            abort(403, 'You are not allowed to delete this institution.');

        }

        return (bool) $institution->delete();
    }

    public function getVisibleInstitutions(User $user)
    {
        if ($user->isSystemAdmin()) {
            return Institution::all();
        }

        if ($user->hasRole('subject_officer')) {
            return Institution::where(
                'parent_institution_id',
                $user->institution_id
            )->get();
        }

        return collect();
    }

    public function getParentInstitutions(User $user)
    {
        if ($user->isSystemAdmin()) {
            return Institution::whereNull('parent_institution_id')->get();
        }

        if ($user->hasRole('subject_officer')) {
            return Institution::where('id', $user->institution_id)->get();
        }

        return collect();
    }
}
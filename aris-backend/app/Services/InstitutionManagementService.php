<?php
  
  namespace App\Services;

  use App\Models\Institution;
  use App\Models\User;

  class InstitutionManagementService
  {
      public function allowedInstitutionTypes(User $user): array
      {
          if ($user->isSystemAdmin()){
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
                            ],

                  default => [],
              };
          }

          return [];
      }
      
    public function createInstitution(User $user, string $type): bool
    {
        return in_array($type, $this->allowedInstitutionTypes($user));
    }

    public function validParentType(string $type): ?string
    {
        return match ($type) {

            'PDHS' => 'MINISTRY',

            'RDHS' => 'PDHS',

            'BASE_HOSPITAL' => 'PDHS',

            'DIVISIONAL_HOSPITAL' => 'RDHS',

            'MOH' => 'RDHS',

            'PMCU' => 'RDHS',

            'UNITS' => 'RDHS',

            default => null,
        };
    }

  }
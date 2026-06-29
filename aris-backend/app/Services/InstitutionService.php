<?php
  namespace App\Services;

  use App\Models\Institution;
  use App\Models\User;

  class InstitutionService
  {
      /**
       * Get the institution associated with a user.
       *
       * @param User $user
       * @return Institution
       */
      public function institution(User $user): ?Institution
      {
          return $user->institution;
      }

      /**
       * Get the parent institution of a given institution.
       *
       * @param Institution $institution
       * @return Institution
       */
      public function parent(Institution $institution): ?Institution
      {
          return $institution->parentInstitution;
      }

      /**
       * Get the child institutions of a given institution.
       *
       * @param Institution $institution
       * @return \Illuminate\Database\Eloquent\Collection
       */
      public function children(Institution $institution)
      {
          return $institution->childInstitutions;
      }

      /**
     * Recursive helper.
     */
      protected function collectDescendants(Institution $institution,array &$ids): void {

          foreach ($institution->childInstitutions as $child) {

              $ids[] = $child->id;

              $this->collectDescendants(
                  $child,
                  $ids
              );
          }
      }

      /**
       * Get all descendant institutions of a given institution.
       *
       * @param Institution $institution
       * @return \Illuminate\Database\Eloquent\Collection
       */
      public function descendantIds(Institution $institution): array
      {
           $ids = [];

          $this->collectDescendants(
              $institution,
              $ids
          );

          return array_values(array_unique($ids));
      }

      /**
       * Get the IDs of institutions accessible to a user.
       *
       * @param User $user
       * @return array
       */
      public function accessibleInstitutionIds(User $user): array
      {
          if ($user->hasRole('system_admin')) {
              return Institution::pluck('id')->toArray();
          }

          if(!$user->institution){
            return [];
          }

          return array_unique(array_merge(
            [$user->institution_id],
            $this->descendantIds($user->institution)
        ));
      }

      /**
       * Get the root institution of a given institution.
       *
       * @param Institution $institution
       * @return Institution
       */
      public function root(Institution $institution): Institution
      {
          while ($institution->parentInstitution) {
              $institution = $institution->parentInstitution;
          }
          return $institution;
      }

  }
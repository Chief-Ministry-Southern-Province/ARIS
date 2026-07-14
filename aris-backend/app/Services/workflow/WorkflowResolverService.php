<?php

namespace App\Services\Workflow;

use App\Models\AccidentCase;
use App\Models\Institution;

use App\DTOs\WorkflowStep;

class WorkflowResolverService
{
  public function resolve(AccidentCase $case): array
  {
      $institution = $case->institution;

      return match ($institution->type) {

          'PDHS' => $this->resolveProvincial($institution),

          'BASE_HOSPITAL' => $this->resolveBaseHospital($institution),

          'RDHS' => $this->resolveRegional($institution),

          'DIVISIONAL_HOSPITAL',
          'MOH',
          'PMCU',
          'UNITS',
          'OTHER' => $this->resolveRegional($institution->parentInstitution),

          default => throw new \Exception(
              'Workflow not found.'
          ),
      };
  }

  protected function resolveBaseHospital(Institution $hospital): array
  {
      $pdhs = $hospital->parentInstitution;
      $ministry = $pdhs->parentInstitution;

      return [
        new WorkflowStep(
          step: 1,
          institution: $hospital,
          role: 'subject_officer',
        ),
        new WorkflowStep(
          step: 2,
          institution: $hospital,
          role: 'administrative_officer',
        ),
        new WorkflowStep(
          step: 3,
          institution: $hospital,
          role: 'medical_superintendent',
        ),

        ...$this->resolvePDHS($pdhs,4),

        ...$this->resolveMinistry($ministry,$hospital->district,8),
      ];
  }

  protected function resolveRegional(Institution $rdhs): array 
  {

      $pdhs = $rdhs->parentInstitution;

      $ministry = $pdhs->parentInstitution;

      return [

          new WorkflowStep(
              step: 1,
              institution: $rdhs,
              role: 'subject_officer',
          ),

          new WorkflowStep(
              step: 2,
              institution: $rdhs,
              role: 'administrative_officer',
          ),

          new WorkflowStep(
              step: 3,
              institution: $rdhs,
              role: 'regional_director',
          ),

          ...$this->resolvePDHS($pdhs,4),

          ...$this->resolveMinistry($ministry,$rdhs->district,8)

      ];
  }

  protected function resolvePDHS(Institution $pdhs,int $start): array 
  {

      return [

          new WorkflowStep(
              step: $start,
              institution: $pdhs,
              role: 'subject_officer',
          ),

          new WorkflowStep(
              step: $start + 1,
              institution: $pdhs,
              role: 'administrative_officer',
          ),

          new WorkflowStep(
              step: $start + 2,
              institution: $pdhs,
              role: 'deputy_director',
          ),

          new WorkflowStep(
              step: $start + 3,
              institution: $pdhs,
              role: 'provincial_director',
          ),

      ];
  }

  protected function resolveMinistry(Institution $ministry,string $district,int $start): array 
  {

      return [

          new WorkflowStep(
              step: $start,
              institution: $ministry,
              role: 'subject_officer',
              district: $district,
          ),

          new WorkflowStep(
              step: $start + 1,
              institution: $ministry,
              role: 'administrative_officer',
          ),

          new WorkflowStep(
              step: $start + 2,
              institution: $ministry,
              role: 'assistant_secretary',
          ),

          new WorkflowStep(
              step: $start + 3,
              institution: $ministry,
              role: 'senior_assistant_secretary',
          ),

          new WorkflowStep(
              step: $start + 4,
              institution: $ministry,
              role: 'secretary',
          ),

      ];
  }

  protected function resolveProvincial(Institution $pdhs): array 
  {

      $ministry = $pdhs->parentInstitution;

      return [

          [
              'step'=>1,
              'institution'=>$pdhs,
              'role'=>'subject_officer',
          ],

          [
              'step'=>2,
              'institution'=>$pdhs,
              'role'=>'administrative_officer',
          ],

          [
              'step'=>3,
              'institution'=>$pdhs,
              'role'=>'deputy_director',
          ],

          [
              'step'=>4,
              'institution'=>$pdhs,
              'role'=>'provincial_director',
          ],

          ...$this->resolveMinistry($ministry,'Galle',5)

      ];
  }
}
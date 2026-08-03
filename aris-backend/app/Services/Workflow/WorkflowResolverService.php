<?php

namespace App\Services\Workflow;

use App\Models\AccidentCase;
use App\Models\FR1043;
use App\Models\FR1044;
use App\Models\Institution;
use App\Models\User;
use App\Services\WorkflowSettingService;
use Illuminate\Validation\ValidationException;

use App\DTOs\WorkflowStep;

class WorkflowResolverService
{
  public function __construct(
      private readonly WorkflowSettingService $settings,
  ) {
  }

  public function resolve(AccidentCase $case, string $documentType, int $revision): array
  {
      $case->loadMissing(['institution.parentInstitution', 'accident.vehicle.institution']);
      $institution = $case->institution;
      // Ministry subject-officer assignment follows the vehicle owner's institution,
      // not the geographical district where the accident occurred.
      $vehicleInstitutionDistrict = trim((string) $case->accident?->vehicle?->institution?->district);

      [$steps, $ministry] = match ($institution->type) {
          'PDHS' => [$this->resolveProvincial($institution), $institution->parentInstitution],
          'BASE_HOSPITAL' => [$this->resolveBaseHospital($institution), $institution->parentInstitution?->parentInstitution],
          'RDHS' => [$this->resolveRegional($institution), $institution->parentInstitution?->parentInstitution],
          'DIVISIONAL_HOSPITAL', 'MOH', 'PMCU', 'UNITS', 'OTHER' => [
              $this->resolveRegional($institution->parentInstitution),
              $institution->parentInstitution?->parentInstitution?->parentInstitution,
          ],
          default => throw new \Exception('Workflow not found.'),
      };

      if (! $ministry || $ministry->type !== 'MINISTRY') {
          throw new \Exception('The Ministry institution could not be resolved for this workflow.');
      }

      $lossAmount = $this->lossAmount($case, $documentType, $revision);
      $configuration = $this->thresholdConfiguration();

      if ($lossAmount > $configuration['pdhs_threshold']) {
          if ($vehicleInstitutionDistrict === '') {
              throw ValidationException::withMessages([
                  'workflow' => 'The accident vehicle institution must have a district before resolving the Ministry approval workflow.',
              ]);
          }

          $steps = [...$steps, ...$this->resolveMinistry($ministry, $vehicleInstitutionDistrict, 1)];
      }

      if ($lossAmount > $configuration['ministry_threshold']) {
          $steps[] = $this->resolveTreasurySecretary();
      }

      return $this->renumber($steps);
  }

  private function thresholdConfiguration(): array
  {
      $pdhsThreshold = (float) $this->settings->get('workflow.pdhs_threshold', 0);
      $ministryThreshold = (float) $this->settings->get('workflow.ministry_threshold', 0);

      if ($pdhsThreshold <= 0 || $ministryThreshold <= $pdhsThreshold) {
          throw ValidationException::withMessages([
              'workflow_settings' => 'Set valid shared thresholds: PDHS must be greater than 0 and lower than Ministry.',
          ]);
      }

      return [
          'pdhs_threshold' => $pdhsThreshold,
          'ministry_threshold' => $ministryThreshold,
      ];
  }

  private function lossAmount(AccidentCase $case, string $documentType, int $revision): float
  {
      $data = match ($documentType) {
          'FR1043' => FR1043::query()
              ->where('accident_case_id', $case->id)
              ->where('revision', $revision)
              ->value('data'),
          'FR1044' => FR1044::query()
              ->where('accident_case_id', $case->id)
              ->where('revision', $revision)
              ->value('data'),
          default => throw new \InvalidArgumentException("Unsupported document type: {$documentType}"),
      };

      $data = is_array($data) ? $data : (json_decode((string) $data, true) ?: []);

      return match ($documentType) {
          'FR1043' => collect($data['items'] ?? [])->sum(function (array $item): float {
              $quantity = $this->money($item['quantity'] ?? 1);

              return $this->money($item['value'] ?? 0) * ($quantity > 0 ? $quantity : 1);
          }),
          'FR1044' => collect($data['lostItems'] ?? [])->sum(fn (array $item) => $this->money($item['originalCost'] ?? 0)),
      };
  }

  private function money(mixed $value): float
  {
      return (float) preg_replace('/[^0-9.\-]/', '', (string) $value ?: '0');
  }

  private function resolveTreasurySecretary(): WorkflowStep
  {
      $user = User::query()
          ->role('treasury_secretary')
          ->whereHas('institution', fn ($query) => $query->where('type', 'MINISTRY'))
          ->with('institution')
          ->orderBy('id')
          ->first();

      if (! $user || ! $user->institution) {
          throw ValidationException::withMessages([
              'workflow' => 'Create a Treasury Secretary user with an assigned institution before submitting a loss above the Ministry threshold.',
          ]);
      }

      return new WorkflowStep(
          step: 1,
          institution: $user->institution,
          role: 'treasury_secretary',
          approverId: $user->id,
      );
  }

  private function renumber(array $steps): array
  {
      return array_map(fn (WorkflowStep $step, int $index) => new WorkflowStep(
          step: $index + 1,
          institution: $step->institution,
          role: $step->role,
          district: $step->district,
          approverId: $step->approverId,
      ), $steps, array_keys($steps));
  }

  protected function resolveBaseHospital(Institution $hospital): array
  {
      $pdhs = $hospital->parentInstitution;
      return [
        new WorkflowStep(
          step: 1,
          institution: $hospital,
          role: 'administrative_officer',
        ),
        new WorkflowStep(
          step: 2,
          institution: $hospital,
          role: 'medical_superintendent',
        ),

        ...$this->resolvePDHS($pdhs,3),
      ];
  }

  protected function resolveRegional(Institution $rdhs): array 
  {

      $pdhs = $rdhs->parentInstitution;

      return [

          new WorkflowStep(
              step: 1,
              institution: $rdhs,
              role: 'administrative_officer',
          ),

          new WorkflowStep(
              step: 2,
              institution: $rdhs,
              role: 'regional_director',
          ),

          ...$this->resolvePDHS($pdhs,3),

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

      return [
          new WorkflowStep(
              step: 1,
              institution: $pdhs,
              role: 'administrative_officer',
          ),

          new WorkflowStep(
              step: 2,
              institution: $pdhs,
              role: 'deputy_director',
          ),

          new WorkflowStep(
              step: 3,
              institution: $pdhs,
              role: 'provincial_director',
          ),
      ];
  }
}

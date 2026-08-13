<?php

namespace App\Services;

use App\Models\Accident;
use App\Models\Institution;
use App\Models\User;
use App\Http\Requests\Accident\StoreAccidentRequest;
use Illuminate\Support\Facades\DB;
use App\Services\EvidenceService;
use App\Services\AccidentCaseService;
use App\Services\AccidentTimelineService;

class AccidentService
{
    protected EvidenceService $evidenceService;

    protected AccidentCaseService $accidentCaseService;

    protected AccidentTimelineService $timelineService;

    public function __construct(
        EvidenceService $evidenceService,
        AccidentCaseService $accidentCaseService,
        AccidentTimelineService $timelineService
    ) {
        $this->evidenceService = $evidenceService;
        $this->accidentCaseService = $accidentCaseService;
        $this->timelineService = $timelineService;
    }

    /**
     * Generate the shared case and document reference number.
     * Format: CMSP/HLTH/PARENT[/LOCATION]/YYYY/0001
     */
    protected function generateReferenceNumber(Institution $institution): string
    {
        $year = now()->year;
        [$parent, $location] = $this->resolveCodingGroup($institution);
        $segments = [config('case-codes.prefix'), config('case-codes.sector'), $parent];

        if ($location) {
            $segments[] = $location;
        }

        $segments[] = $year;
        $prefix = implode('/', $segments) . '/';

        $lastAccident = Accident::withoutGlobalScopes()
            ->where('reference_number', 'like', "{$prefix}%")
            ->lockForUpdate()
            ->orderByDesc('reference_number')
            ->first();

        if ($lastAccident) {
            $lastNumber = (int) substr($lastAccident->reference_number, -4);
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        return sprintf('%s%04d', $prefix, $nextNumber);
    }

    /**
     * Determine the coding group without replacing the vehicle-owning
     * institution saved on the accident itself.
     *
     * @return array{string, string|null}
     */
    protected function resolveCodingGroup(Institution $institution): array
    {
        if ($institution->type === 'PDHS') {
            return ['PDHS', null];
        }

        if ($institution->type === 'BASE_HOSPITAL') {
            $location = config('case-codes.base_hospitals.' . strtolower(trim($institution->name)));

            abort_unless($location, 422, "A case-code location is not configured for {$institution->name}.");

            return ['BH', $location];
        }

        $current = $institution;

        while ($current) {
            if ($current->type === 'RDHS') {
                $district = config('case-codes.districts.' . strtolower(trim((string) $current->district)));

                abort_unless($district, 422, "A case-code district is not configured for {$current->name}.");

                return ['RDHS', $district];
            }

            $current = $current->parentInstitution;
        }

        abort(422, "A case-code group could not be resolved for {$institution->name}.");
    }

    /**
     * Create a new accident record.
     */
    public function createAccident(StoreAccidentRequest $request, User $user): Accident
    {
        $data = $request->validated();

        $files = $request->file('files');

        $data['reported_by'] = $user->id;
        $data['institution_id'] = $user->institution_id;

        DB::beginTransaction();

        try {

            $institution = Institution::query()->findOrFail($data['institution_id']);
            $data['reference_number'] = $this->generateReferenceNumber($institution);

            $accident = Accident::create($data);

            $case = $this->accidentCaseService->create($accident, $user);

            $this->timelineService->create(
                accidentCase: $case,
                user: $user,
                action: 'ACCIDENT_REPORTED',
                description: "Accident {$accident->reference_number} reported",
                newValue: [
                    'reference_number' => $accident->reference_number,
                    'severity' => $accident->severity,
                    'location' => $accident->location,
                ],
            );

            if ($request->hasFile('files')) {

                $this->evidenceService->upload(
                    $accident,
                    $request->file('files'),
                    $data['evidence_description'] ?? null,
                    $user
                );
            }

            DB::commit();

            return $accident;

        } catch (\Throwable $e) {

            DB::rollBack();

            throw $e;
        }
    }

    /**
     * Update an existing accident record.
     */
    public function updateAccident(Accident $accident, array $data): Accident
    {
        $old = $accident->only(array_keys($data));

        $accident->update($data);

        if ($accident->accidentCase) {
            $this->timelineService->create(
                accidentCase: $accident->accidentCase,
                user: auth()->user(),
                action: 'ACCIDENT_UPDATED',
                description: "Accident {$accident->reference_number} details updated",
                oldValue: $old,
                newValue: $accident->only(array_keys($data)),
            );
        }

        return $accident->fresh();
    }

    /**
     * Delete an accident record.
     */
    public function deleteAccident(Accident $accident): bool
    {
        if ($accident->accidentCase) {
            $this->timelineService->create(
                accidentCase: $accident->accidentCase,
                user: auth()->user(),
                action: 'ACCIDENT_DELETED',
                description: "Accident {$accident->reference_number} deleted",
            );
        }

        return (bool) $accident->delete();
    }

}

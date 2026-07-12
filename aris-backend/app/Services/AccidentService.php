<?php

namespace App\Services;

use App\Models\Accident;
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
     * Generate a unique reference number for the accident.
     * Format: ACC-YYYYMMDD-XXXXX
     */
    protected function generateReferenceNumber(): string
    {
        $date = now()->format('Ymd');

        $lastAccident = Accident::withoutGlobalScopes()
            ->where('reference_number', 'like', "ACC-{$date}-%")
            ->orderByDesc('reference_number')
            ->first();

        if ($lastAccident) {
            $lastNumber = (int) substr($lastAccident->reference_number, -5);
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        return sprintf('ACC-%s-%05d', $date, $nextNumber);
    }

    /**
     * Create a new accident record.
     */
    public function createAccident(StoreAccidentRequest $request, User $user): Accident
    {
        $data = $request->validated();

        $files = $request->file('files');

        $data['reference_number'] = $this->generateReferenceNumber();
        $data['reported_by'] = $user->id;
        $data['institution_id'] = $user->institution_id;

        DB::beginTransaction();

        try {

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
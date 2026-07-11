<?php

namespace App\Services;

use App\Models\Accident;
use App\Models\User;
use App\Http\Requests\Accident\StoreAccidentRequest;
use Illuminate\Support\Facades\DB;
use App\Services\EvidenceService;
use App\Services\AccidentCaseService;

class AccidentService
{
    protected EvidenceService $evidenceService;

    protected AccidentCaseService $accidentCaseService;

    public function __construct(EvidenceService $evidenceService, AccidentCaseService $accidentCaseService)
    {
        $this->evidenceService = $evidenceService;
        $this->accidentCaseService = $accidentCaseService;
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

            $this->accidentCaseService->create($accident, $user);

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
        $accident->update($data);

        return $accident->fresh();
    }

    /**
     * Delete an accident record.
     */
    public function deleteAccident(Accident $accident): bool
    {
        return (bool) $accident->delete();
    }
}

<?php

namespace App\Services;

use App\Models\Accident;
use App\Models\AccidentCase;
use App\Models\User;

class AccidentCaseService
{

    protected function generateCaseNumber():string
    {
        $year = now()->year;

        $lastCase = AccidentCase::latest('id')->first();

        $next = $lastCase ? $lastCase->id + 1 : 1;

        return sprintf('CASE-%d-%04d', $year, $next);
    }

    public function create(Accident $accident,User $creator): AccidentCase
    {
        return AccidentCase::create([

            'case_number' => $this->generateCaseNumber(),

            'accident_id' => $accident->id,

            'institution_id' => $accident->institution_id,

            'created_by' => $creator->id,

            'assigned_to' => null,

            'current_stage' => 'ACCIDENT_REPORTED',

            'status' => 'OPEN',

            'priority' => 'MEDIUM',

        ]);
    }

    public function assign(AccidentCase $case,User $subjectOfficer): AccidentCase
    {
        $case->update([
            'assigned_to' => $subjectOfficer->id,
            'status' => 'IN_PROGRESS',
        ]);

        return $case;
    }

    public function changeStage(AccidentCase $case,string $stage): AccidentCase
    {
        $case->update([
            'current_stage' => $stage,
        ]);

        return $case;
    }

    public function changeStatus(AccidentCase $case,string $status): AccidentCase
    {
        $case->update([
            'status' => $status,
        ]);

        return $case;
    }

    public function close(AccidentCase $case): AccidentCase
    {
        $case->update([
            'current_stage' => 'CLOSED',
            'status' => 'CLOSED',
            'closed_at' => now(),
        ]);

        return $case;
    }

    public function update(AccidentCase $case,array $data): AccidentCase 
    {

        if (isset($data['assigned_to'])) {
            $case->assigned_to = $data['assigned_to'];
        }

        if (isset($data['priority'])) {
            $case->priority = $data['priority'];
        }

        if (isset($data['status'])) {
            $case->status = $data['status'];
        }

        if (isset($data['current_stage'])) {
            $case->current_stage = $data['current_stage'];
        }

        $case->save();

        return $case->fresh();
    }

}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\AccidentCase\UpdateAccidentCaseRequest;
use App\Http\Requests\AccidentCase\AssignAccidentCaseRequest;
use App\Http\Resources\AccidentCaseResource;
use App\Models\AccidentCase;
use App\Models\User;
use App\Services\AccidentCaseService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AccidentCaseController extends Controller
{
    protected AccidentCaseService $accidentCaseService;
    
    public function __construct(AccidentCaseService $accidentCaseService)
    {
        $this->accidentCaseService = $accidentCaseService;
    }

    public function index(Request $request)
    {
        $this->authorize('viewAny', AccidentCase::class);

        $filters = $this->validatedFilters($request);

        $cases = $this->accidentCaseService->getAll(
            $request->user(),
            $filters['case_number'] ?? null,
            $filters['status'] ?? null,
            $filters['stage'] ?? null,
        );

        return AccidentCaseResource::collection($cases);
    }

    /** Export the currently filtered Case Management results as CSV. */
    public function export(Request $request)
    {
        $this->authorize('viewAny', AccidentCase::class);

        $filters = $this->validatedFilters($request);
        $cases = $this->accidentCaseService->exportCases(
            $request->user(),
            $filters['case_number'] ?? null,
            $filters['status'] ?? null,
            $filters['stage'] ?? null,
        );

        return response()->streamDownload(function () use ($cases) {
            $output = fopen('php://output', 'w');
            fwrite($output, "\xEF\xBB\xBF");

            fputcsv($output, [
                'Case ID',
                'Institution',
                'Date',
                'Stage',
            ]);

            foreach ($cases as $case) {
                $accident = $case->accident;

                fputcsv($output, array_map([$this, 'csvValue'], [
                    $case->case_number,
                    $case->institution?->name,
                    $accident?->accident_date?->format('Y-m-d'),
                    $case->current_stage,
                ]));
            }

            fclose($output);
        }, 'case-management-' . now()->format('Y-m-d') . '.csv', [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    private function validatedFilters(Request $request): array
    {
        return $request->validate([
            'case_number' => ['nullable', 'string', 'max:50'],
            'status' => ['nullable', Rule::in([
                'OPEN',
                'IN_PROGRESS',
                'COMPLETED',
            ])],
            'stage' => ['nullable', Rule::in([
                'ACCIDENT_REPORTED',
                'FR1043',
                'FR1044',
                'FR109',
                'CLOSED',
            ])],
        ]);
    }

    private function csvValue(mixed $value): string
    {
        $value = (string) ($value ?? '');

        return preg_match('/^[=+\-@]/', $value) ? "'{$value}" : $value;
    }

    public function show(AccidentCase $accidentCase)
    {
        $this->authorize('view', $accidentCase);

        $case = $this->accidentCaseService->findById($accidentCase->id);

        return new AccidentCaseResource($case);
    }

    public function update(UpdateAccidentCaseRequest $request, AccidentCase $accidentCase)
    {
        $this->authorize('update', $accidentCase);

        $this->accidentCaseService->update($accidentCase, $request->validated());

        return new AccidentCaseResource($accidentCase);
    }

    public function assign(AssignAccidentCaseRequest $request, AccidentCase $accidentCase)
    {
        $this->authorize('assign', $accidentCase);

        $case = $this->accidentCaseService->assign(
            $accidentCase,
            User::findOrFail($request->integer('assigned_to')),
            $request->user(),
        );

        return new AccidentCaseResource($case);
    }

}

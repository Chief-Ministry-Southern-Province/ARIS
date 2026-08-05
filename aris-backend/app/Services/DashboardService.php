<?php

namespace App\Services;

use App\Models\Accident;
use App\Models\AccidentCase;
use App\Models\Approval;
use App\Models\FR109;
use App\Models\User;
use Carbon\CarbonImmutable;

class DashboardService
{
    public function __construct(private readonly InstitutionService $institutions)
    {
    }

    public function statisticsFor(User $user): array
    {
        $institutionIds = $this->institutions->accessibleInstitutionIds($user);
        $fiscalYearStart = $this->fiscalYearStart();
        $fiscalYearEnd = $fiscalYearStart->addYear()->subDay();

        $caseScope = AccidentCase::query()
            ->whereIn('institution_id', $institutionIds);

        $fiscalCaseScope = (clone $caseScope)->whereHas(
            'accident',
            fn ($query) => $query->whereBetween('accident_date', [$fiscalYearStart->toDateString(), $fiscalYearEnd->toDateString()]),
        );

        $latestWriteOffReports = FR109::query()
            ->whereIn('accident_case_id', $fiscalCaseScope->select('id'))
            ->get(['accident_case_id', 'revision', 'data'])
            ->groupBy('accident_case_id')
            ->map(fn ($revisions) => $revisions->sortByDesc('revision')->first());

        return [
            'total_incidents' => Accident::query()
                ->whereIn('institution_id', $institutionIds)
                ->whereBetween('accident_date', [$fiscalYearStart->toDateString(), $fiscalYearEnd->toDateString()])
                ->count(),
            'open_investigations' => (clone $caseScope)
                ->whereIn('status', ['OPEN', 'IN_PROGRESS'])
                ->count(),
            'pending_approvals' => Approval::query()
                ->where('approver_id', $user->id)
                ->where('status', 'PENDING')
                ->count(),
            'completed_cases' => $fiscalCaseScope
                ->where('status', 'COMPLETED')
                ->count(),
            'total_losses' => $latestWriteOffReports->sum(
                fn (FR109 $report) => $this->money($report->data['netLoss'] ?? 0),
            ),
            'recoveries' => $latestWriteOffReports->sum(
                fn (FR109 $report) => $this->money($report->data['amountRecovered'] ?? 0),
            ),
            'fiscal_year_start' => $fiscalYearStart->toDateString(),
            'fiscal_year_end' => $fiscalYearEnd->toDateString(),
        ];
    }

    private function fiscalYearStart(): CarbonImmutable
    {
        $today = CarbonImmutable::today();

        return $today->month >= 7
            ? $today->setDate($today->year, 7, 1)
            : $today->subYear()->setDate($today->year - 1, 7, 1);
    }

    private function money(mixed $value): float
    {
        return (float) preg_replace('/[^0-9.\-]/', '', (string) $value ?: '0');
    }
}

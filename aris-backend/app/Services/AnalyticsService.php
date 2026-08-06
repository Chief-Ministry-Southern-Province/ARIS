<?php

namespace App\Services;

use App\Models\Accident;
use App\Models\AccidentCase;
use App\Models\FR109;
use App\Models\User;
use Carbon\CarbonImmutable;

class AnalyticsService
{
    public function __construct(private readonly InstitutionService $institutions)
    {
    }

    public function contextFor(User $user, ?string $period): array
    {
        [$periodLabel, $start, $end] = $this->resolvePeriod($period);
        $institutionIds = $this->institutions->accessibleInstitutionIds($user);
        $monthsInPeriod = $this->monthsInPeriod($start, $end);
        $comparisonStart = $start->subYear();
        $comparisonEnd = $comparisonStart->addMonths($monthsInPeriod)->subDay();
        $current = $this->periodMetrics($institutionIds, $start, $end, $monthsInPeriod);
        $previous = $this->periodMetrics($institutionIds, $comparisonStart, $comparisonEnd, $monthsInPeriod);

        return [
            'period' => $periodLabel,
            'period_start' => $start->toDateString(),
            'period_end' => $end->toDateString(),
            'available_periods' => $this->availablePeriods(),
            'accessible_institution_count' => count($institutionIds),
            'kpis' => [
                'monthly_accident_frequency' => [
                    'value' => $current['monthly_accident_frequency'],
                    'change_percentage' => $this->percentageChange($current['monthly_accident_frequency'], $previous['monthly_accident_frequency']),
                ],
                'high_risk_vehicles' => [
                    'value' => $current['high_risk_vehicles'],
                    'change_percentage' => $this->percentageChange($current['high_risk_vehicles'], $previous['high_risk_vehicles']),
                ],
                'total_cost_impact' => [
                    'value' => $current['total_cost_impact'],
                    'change_percentage' => $this->percentageChange($current['total_cost_impact'], $previous['total_cost_impact']),
                ],
                'recovery_rate' => [
                    'value' => $current['recovery_rate'],
                    'change_percentage' => $this->percentageChange($current['recovery_rate'], $previous['recovery_rate']),
                ],
            ],
            'accident_frequency_trend' => $this->monthlyAccidentTrend($institutionIds, $start, $end),
            'cost_analysis_trend' => $this->monthlyCostAnalysisTrend($institutionIds, $start, $end),
        ];
    }

    private function monthlyCostAnalysisTrend(array $institutionIds, CarbonImmutable $start, CarbonImmutable $end): array
    {
        $lastMonth = CarbonImmutable::today()->lessThanOrEqualTo($end)
            ? CarbonImmutable::today()->startOfMonth()
            : $end->startOfMonth();
        $months = [];

        for ($month = $start->startOfMonth(); $month->lessThanOrEqualTo($lastMonth); $month = $month->addMonth()) {
            $months[$month->format('Y-m')] = [
                'month' => $month->format('M'),
                'losses' => 0.0,
                'recoveries' => 0.0,
            ];
        }

        $caseScope = AccidentCase::query()
            ->whereIn('institution_id', $institutionIds)
            ->whereHas('accident', fn ($query) => $query->whereBetween('accident_date', [$start->toDateString(), $end->toDateString()]));

        $latestReports = FR109::query()
            ->whereIn('accident_case_id', $caseScope->select('id'))
            ->with('accidentCase.accident:id,accident_date')
            ->get(['accident_case_id', 'revision', 'data'])
            ->groupBy('accident_case_id')
            ->map(fn ($revisions) => $revisions->sortByDesc('revision')->first());

        foreach ($latestReports as $report) {
            $accidentDate = $report->accidentCase?->accident?->accident_date;

            if (! $accidentDate) {
                continue;
            }

            $key = $accidentDate->format('Y-m');

            if (! isset($months[$key])) {
                continue;
            }

            $months[$key]['losses'] += $this->money($report->data['netLoss'] ?? 0);
            $months[$key]['recoveries'] += $this->money($report->data['amountRecovered'] ?? 0);
        }

        return array_values($months);
    }

    private function monthlyAccidentTrend(array $institutionIds, CarbonImmutable $start, CarbonImmutable $end): array
    {
        $lastMonth = CarbonImmutable::today()->lessThanOrEqualTo($end)
            ? CarbonImmutable::today()->startOfMonth()
            : $end->startOfMonth();
        $months = [];

        for ($month = $start->startOfMonth(); $month->lessThanOrEqualTo($lastMonth); $month = $month->addMonth()) {
            $months[$month->format('Y-m')] = [
                'month' => $month->format('M'),
                'accidents' => 0,
            ];
        }

        Accident::query()
            ->whereIn('institution_id', $institutionIds)
            ->whereBetween('accident_date', [$start->toDateString(), $end->toDateString()])
            ->get(['accident_date'])
            ->each(function (Accident $accident) use (&$months): void {
                $key = $accident->accident_date->format('Y-m');

                if (isset($months[$key])) {
                    $months[$key]['accidents']++;
                }
            });

        return array_values($months);
    }

    private function periodMetrics(array $institutionIds, CarbonImmutable $start, CarbonImmutable $end, int $monthsInPeriod): array
    {
        $accidents = Accident::query()
            ->whereIn('institution_id', $institutionIds)
            ->whereBetween('accident_date', [$start->toDateString(), $end->toDateString()])
            ->get(['id', 'vehicle_id']);

        $caseScope = AccidentCase::query()
            ->whereIn('institution_id', $institutionIds)
            ->whereHas('accident', fn ($query) => $query->whereBetween('accident_date', [$start->toDateString(), $end->toDateString()]));

        $latestReports = FR109::query()
            ->whereIn('accident_case_id', $caseScope->select('id'))
            ->get(['accident_case_id', 'revision', 'data'])
            ->groupBy('accident_case_id')
            ->map(fn ($revisions) => $revisions->sortByDesc('revision')->first());

        $totalCostImpact = $latestReports->sum(
            fn (FR109 $report) => $this->money($report->data['netLoss'] ?? 0),
        );
        $recoveries = $latestReports->sum(
            fn (FR109 $report) => $this->money($report->data['amountRecovered'] ?? 0),
        );

        return [
            'monthly_accident_frequency' => round($accidents->count() / $monthsInPeriod, 1),
            // A vehicle is considered high risk when it has two or more
            // recorded accidents in the selected fiscal period.
            'high_risk_vehicles' => $accidents
                ->filter(fn (Accident $accident) => $accident->vehicle_id !== null)
                ->countBy('vehicle_id')
                ->filter(fn (int $count) => $count >= 2)
                ->count(),
            'total_cost_impact' => (float) $totalCostImpact,
            'recovery_rate' => $totalCostImpact > 0
                ? round(($recoveries / $totalCostImpact) * 100, 1)
                : 0.0,
        ];
    }

    private function monthsInPeriod(CarbonImmutable $start, CarbonImmutable $end): int
    {
        $lastMonth = CarbonImmutable::today()->lessThanOrEqualTo($end)
            ? CarbonImmutable::today()->startOfMonth()
            : $end->startOfMonth();

        return max(1, $start->startOfMonth()->diffInMonths($lastMonth) + 1);
    }

    private function percentageChange(float|int $current, float|int $previous): ?float
    {
        if ((float) $previous === 0.0) {
            return null;
        }

        return round((($current - $previous) / abs($previous)) * 100, 1);
    }

    private function money(mixed $value): float
    {
        return (float) preg_replace('/[^0-9.\-]/', '', (string) $value ?: '0');
    }

    private function resolvePeriod(?string $period): array
    {
        $start = $period
            ? CarbonImmutable::create((int) substr($period, 2, 4), 7, 1)
            : $this->currentFiscalYearStart();

        return [
            $this->periodLabel($start),
            $start,
            $start->addYear()->subDay(),
        ];
    }

    private function availablePeriods(): array
    {
        $current = $this->currentFiscalYearStart();

        return collect(range(0, 4))
            ->map(fn (int $offset) => $this->periodLabel($current->subYears($offset)))
            ->all();
    }

    private function currentFiscalYearStart(): CarbonImmutable
    {
        $today = CarbonImmutable::today();

        return $today->month >= 7
            ? $today->setDate($today->year, 7, 1)
            : $today->subYear()->setDate($today->year - 1, 7, 1);
    }

    private function periodLabel(CarbonImmutable $start): string
    {
        return sprintf('FY%d-%02d', $start->year, ($start->year + 1) % 100);
    }
}

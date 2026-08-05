<?php

namespace App\Services;

use App\Models\User;
use Carbon\CarbonImmutable;

class AnalyticsService
{
    public function __construct(private readonly InstitutionService $institutions)
    {
    }

    /**
     * Provides the shared analytics period and access context. Chart data is
     * intentionally added to this response one component at a time.
     */
    public function contextFor(User $user, ?string $period): array
    {
        [$periodLabel, $start, $end] = $this->resolvePeriod($period);

        return [
            'period' => $periodLabel,
            'period_start' => $start->toDateString(),
            'period_end' => $end->toDateString(),
            'available_periods' => $this->availablePeriods(),
            // Resolve the same hierarchy-scoped institution set used by the
            // dashboard. Subsequent analytics queries use this service context.
            'accessible_institution_count' => count($this->institutions->accessibleInstitutionIds($user)),
        ];
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

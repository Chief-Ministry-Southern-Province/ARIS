<?php

namespace App\Services;

use App\Models\Accident;
use App\Models\AccidentCase;
use App\Models\Approval;
use App\Models\CaseHistory;
use App\Models\FR109;
use App\Models\User;
use App\Models\Vehicle;
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

        $fiscalAccidents = Accident::query()
            ->whereIn('institution_id', $institutionIds)
            ->whereBetween('accident_date', [$fiscalYearStart->toDateString(), $fiscalYearEnd->toDateString()])
            ->get(['id', 'vehicle_id', 'accident_date', 'latitude', 'longitude', 'location']);

        $accessibleVehicles = Vehicle::query()
            ->whereIn('institution_id', $institutionIds)
            ->where('status', '!=', 'DISPOSED')
            ->get(['id', 'vehicle_type']);

        $latestWriteOffReports = FR109::query()
            ->whereIn('accident_case_id', $fiscalCaseScope->select('id'))
            ->with('accidentCase.accident:id,accident_date')
            ->get(['accident_case_id', 'revision', 'data'])
            ->groupBy('accident_case_id')
            ->map(fn ($revisions) => $revisions->sortByDesc('revision')->first());

        return [
            'total_incidents' => $fiscalAccidents->count(),
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
            'accident_trends' => $this->monthlyTrends($fiscalAccidents, $latestWriteOffReports, $fiscalYearStart, $fiscalYearEnd),
            'vehicle_risks' => $this->vehicleRisks($fiscalAccidents, $accessibleVehicles),
            'recent_activities' => $this->recentActivities($institutionIds),
            'recent_cases' => $this->recentCases($caseScope),
            'hotspots' => $this->hotspots($fiscalAccidents),
            'overdue_approvals' => $this->overdueApprovals($user),
            'case_stage_funnel' => $this->caseStageFunnel($caseScope),
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

    private function monthlyTrends($accidents, $reports, CarbonImmutable $start, CarbonImmutable $end): array
    {
        $lastMonth = CarbonImmutable::today()->lessThanOrEqualTo($end)
            ? CarbonImmutable::today()->startOfMonth()
            : $end->startOfMonth();
        $months = [];

        for ($month = $start->startOfMonth(); $month->lessThanOrEqualTo($lastMonth); $month = $month->addMonth()) {
            $months[$month->format('Y-m')] = [
                'month' => $month->format('M'),
                'accidents' => 0,
                'losses' => 0.0,
            ];
        }

        foreach ($accidents as $accident) {
            $key = $accident->accident_date->format('Y-m');

            if (isset($months[$key])) {
                $months[$key]['accidents']++;
            }
        }

        foreach ($reports as $report) {
            $accidentDate = $report->accidentCase?->accident?->accident_date;

            if (! $accidentDate) {
                continue;
            }

            $key = $accidentDate->format('Y-m');

            if (isset($months[$key])) {
                $months[$key]['losses'] += $this->money($report->data['netLoss'] ?? 0);
            }
        }

        return array_values($months);
    }

    private function vehicleRisks($accidents, $vehicles): array
    {
        $vehiclesById = $vehicles->keyBy('id');
        $fleetByType = $vehicles->groupBy('vehicle_type');
        $incidentsByType = $accidents
            ->filter(fn (Accident $accident) => $vehiclesById->has($accident->vehicle_id))
            ->groupBy(fn (Accident $accident) => $vehiclesById->get($accident->vehicle_id)->vehicle_type);

        return $fleetByType
            ->map(function ($fleet, string $vehicleType) use ($incidentsByType) {
                $incidents = $incidentsByType->get($vehicleType)?->count() ?? 0;
                $risk = min(100, (int) round(($incidents / $fleet->count()) * 100));

                return [
                    'vehicle' => ucwords(strtolower(str_replace('_', ' ', $vehicleType))),
                    'incidents' => $incidents,
                    'risk' => $risk,
                ];
            })
            ->sort(fn (array $left, array $right) => [$right['risk'], $right['incidents']] <=> [$left['risk'], $left['incidents']])
            ->take(5)
            ->values()
            ->all();
    }

    private function recentActivities(array $institutionIds): array
    {
        return CaseHistory::query()
            ->whereHas('accidentCase', fn ($query) => $query->whereIn('institution_id', $institutionIds))
            ->with([
                'user:id,name',
                'accidentCase:id,case_number',
            ])
            ->latest()
            ->limit(6)
            ->get(['id', 'accident_case_id', 'user_id', 'action', 'description', 'created_at'])
            ->map(fn (CaseHistory $history) => [
                'id' => $history->id,
                'action' => $history->action,
                'description' => $history->description ?: "Case {$history->accidentCase?->case_number} updated.",
                'case_number' => $history->accidentCase?->case_number,
                'user_name' => $history->user?->name,
                'created_at' => $history->created_at?->toISOString(),
            ])
            ->all();
    }

    private function recentCases($caseScope): array
    {
        return (clone $caseScope)
            ->where('created_at', '>=', now()->subDays(30))
            ->with([
                'accident:id,reference_number,location,accident_date',
                'institution:id,name',
            ])
            ->latest()
            ->limit(5)
            ->get(['id', 'case_number', 'status', 'current_stage', 'institution_id', 'accident_id', 'created_at'])
            ->map(fn (AccidentCase $case) => [
                'id' => $case->id,
                'case_number' => $case->case_number,
                'incident' => $case->accident?->reference_number,
                'location' => $case->accident?->location,
                'accident_date' => $case->accident?->accident_date?->toDateString(),
                'institution' => $case->institution?->name,
                'stage' => $case->current_stage,
                'status' => $case->status,
            ])
            ->all();
    }

    private function hotspots($accidents): array
    {
        return $accidents
            ->filter(fn (Accident $accident) => $this->hasSriLankanCoordinates($accident))
            ->groupBy(fn (Accident $accident) => round((float) $accident->latitude, 2) . ':' . round((float) $accident->longitude, 2))
            ->map(function ($nearbyAccidents) {
                $count = $nearbyAccidents->count();

                return [
                    'id' => $nearbyAccidents->first()->id,
                    'name' => $nearbyAccidents->pluck('location')->filter()->first() ?: 'Accident hotspot',
                    'latitude' => round((float) $nearbyAccidents->avg('latitude'), 6),
                    'longitude' => round((float) $nearbyAccidents->avg('longitude'), 6),
                    'count' => $count,
                    'risk' => $count >= 5 ? 'HIGH' : ($count >= 3 ? 'MEDIUM' : 'LOW'),
                ];
            })
            ->sortByDesc('count')
            ->take(10)
            ->values()
            ->all();
    }

    private function hasSriLankanCoordinates(Accident $accident): bool
    {
        if ($accident->latitude === null || $accident->longitude === null) {
            return false;
        }

        return (float) $accident->latitude >= 5.8
            && (float) $accident->latitude <= 10.1
            && (float) $accident->longitude >= 79.5
            && (float) $accident->longitude <= 82.1;
    }

    private function overdueApprovals(User $user): array
    {
        $now = now();

        return Approval::query()
            ->where('approver_id', $user->id)
            ->where('status', 'PENDING')
            ->where('updated_at', '<=', $now->copy()->subHours(24))
            ->with([
                'accidentCase:id,case_number',
                'approver:id,name',
            ])
            ->orderBy('updated_at')
            ->limit(5)
            ->get(['id', 'accident_case_id', 'document_type', 'revision', 'step', 'approver_id', 'updated_at'])
            ->map(fn (Approval $approval) => [
                'id' => $approval->id,
                'case_number' => $approval->accidentCase?->case_number,
                'document_type' => $approval->document_type,
                'revision' => $approval->revision,
                'step' => $approval->step,
                'approver_name' => $approval->approver?->name,
                'waiting_hours' => $approval->updated_at->diffInHours($now),
            ])
            ->all();
    }

    private function caseStageFunnel($caseScope): array
    {
        $stageCounts = (clone $caseScope)
            ->where('status', '!=', 'COMPLETED')
            ->selectRaw('current_stage, COUNT(*) as total')
            ->groupBy('current_stage')
            ->pluck('total', 'current_stage');

        $stages = [
            'ACCIDENT_REPORTED' => 'Accident Reported',
            'FR1043' => 'FR1043',
            'FR1044' => 'FR1044',
            'FR109' => 'FR109',
        ];

        $funnel = collect($stages)
            ->map(fn (string $label, string $stage) => [
                'stage' => $stage,
                'label' => $label,
                'count' => (int) ($stageCounts[$stage] ?? 0),
            ])
            ->values();

        $funnel->push([
            'stage' => 'COMPLETED',
            'label' => 'Completed',
            'count' => (clone $caseScope)->where('status', 'COMPLETED')->count(),
        ]);

        return $funnel->all();
    }
}

<?php

namespace App\Services;

use App\Models\Accident;
use App\Models\AccidentCase;
use App\Models\User;
use App\Services\Notifications\NotificationService;
use App\Services\AccidentTimelineService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;

class AccidentCaseService
{
    protected AccidentTimelineService $timelineService;
    protected NotificationService $notificationService;

    public function __construct(AccidentTimelineService $timelineService, NotificationService $notificationService)
    {
        $this->timelineService = $timelineService;
        $this->notificationService = $notificationService;
    }

    protected function generateCaseNumber(): string
    {
        $year = now()->year;

        $lastCase = AccidentCase::latest('id')->first();

        $next = $lastCase ? $lastCase->id + 1 : 1;

        return sprintf('CASE-%d-%04d', $year, $next);
    }

    public function create(Accident $accident, User $creator): AccidentCase
    {
        $case = AccidentCase::create([
            'case_number' => $this->generateCaseNumber(),
            'accident_id' => $accident->id,
            'institution_id' => $accident->institution_id,
            'created_by' => $creator->id,
            'assigned_to' => $this->getSubjectOfficerBaseOnInstitution($accident, $creator)?->id,
            'current_stage' => 'ACCIDENT_REPORTED',
            'status' => 'OPEN',
            'priority' => 'MEDIUM',
        ]);

        $this->timelineService->create(
            accidentCase: $case,
            user: $creator,
            action: 'CASE_CREATED',
            description: "Case {$case->case_number} created",
        );

        $this->notificationService->notifyNewAccidentReported($accident);

        return $case;
    }

    public function assign(AccidentCase $case, User $subjectOfficer, User $actor): AccidentCase
    {
        if (! in_array($case->status, ['OPEN', 'IN_PROGRESS'], true)) {
            throw ValidationException::withMessages([
                'status' => 'Only open or in-progress cases can be assigned.',
            ]);
        }

        if (! $subjectOfficer->hasRole('subject_officer')
            || ! app(InstitutionService::class)->canAccessInstitution($subjectOfficer, $case->institution)) {
            throw ValidationException::withMessages([
                'assigned_to' => 'The assignee must be a subject officer who can access this case.',
            ]);
        }

        $oldAssignee = $case->assigned_to;

        $case->update([
            'assigned_to' => $subjectOfficer->id,
            'status' => 'IN_PROGRESS',
        ]);

        $this->timelineService->create(
            accidentCase: $case,
            user: $actor,
            action: 'ASSIGNED',
            description: "Case assigned to {$subjectOfficer->name}",
            oldValue: ['assigned_to' => $oldAssignee],
            newValue: ['assigned_to' => $subjectOfficer->id],
        );

        return $case;
    }

    public function update(AccidentCase $case, array $data): AccidentCase
    {
        $old = $case->only(['priority']);

        if (isset($data['priority'])) {
            $case->priority = $data['priority'];
        }

        $case->save();

        $this->timelineService->create(
            accidentCase: $case,
            user: auth()->user(),
            action: 'CASE_UPDATED',
            description: 'Case details updated',
            oldValue: $old,
            newValue: $case->only(['priority']),
        );

        return $case->fresh();
    }

    public function delete(AccidentCase $case): bool
    {
        $caseNumber = $case->case_number;

        $deleted = (bool) $case->delete();

        if ($deleted) {
            $this->timelineService->create(
                accidentCase: $case,
                user: auth()->user(),
                action: 'CASE_DELETED',
                description: "Case {$caseNumber} deleted",
            );
        }

        return $deleted;
    }

    public function getSubjectOfficerBaseOnInstitution(Accident $accident, User $creator): ?User
    {
        if ($creator->hasRole('subject_officer')) {
            return $creator;
        }

        $subjectOfficer = $accident->institution
            ->users()
            ->whereHas('roles', function ($query) {
                $query->where('name', 'subject_officer');
            })
            ->first();

        if ($subjectOfficer) {
            return $subjectOfficer;
        }

        return $accident->institution
            ->parentInstitution
            ?->users()
            ->whereHas('roles', function ($query) {
                $query->where('name', 'subject_officer');
            })
            ->first();
    }

    public function getAll(
        ?string $caseNumber = null,
        ?string $status = null,
        ?string $stage = null,
    ): LengthAwarePaginator
    {
        return AccidentCase::query()
            ->with([
                'accident',
                'creator',
                'assignee',
                'institution',
            ])
            ->when($caseNumber, function ($query) use ($caseNumber) {
                $caseNumber = trim($caseNumber);

                $query->where(function ($caseQuery) use ($caseNumber) {
                    if (ctype_digit($caseNumber)) {
                        $caseQuery->whereKey((int) $caseNumber);
                    }

                    $caseQuery->orWhere(
                        'case_number',
                        'like',
                        '%' . addcslashes($caseNumber, '\\%_') . '%',
                    );
                });
            })
            ->when($status, fn ($query) => $query->where('status', $status))
            ->when($stage, fn ($query) => $query->where('current_stage', $stage))
            ->latest()
            ->paginate(10)
            ->withQueryString();
    }

    public function findById(int $id): AccidentCase
    {
        return AccidentCase::with([
                'accident',
                'creator',
                'assignee',
                'institution',
                'histories.user',
            ])
            ->findOrFail($id);
    }
}

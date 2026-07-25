<?php

namespace App\Services;

use App\Models\Accident;
use App\Models\AccidentCase;
use App\Models\User;
use App\Services\NotificationService;

use App\Services\AccidentTimelineService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

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

        $this->notificationService->sendCaseCreatedNotification($case);

        return $case;
    }

    public function assign(AccidentCase $case, User $subjectOfficer): AccidentCase
    {
        $oldAssignee = $case->assigned_to;

        $case->update([
            'assigned_to' => $subjectOfficer->id,
            'status' => 'IN_PROGRESS',
        ]);

        $this->timelineService->create(
            accidentCase: $case,
            user: auth()->user(),
            action: 'ASSIGNED',
            description: "Case assigned to {$subjectOfficer->name}",
            oldValue: ['assigned_to' => $oldAssignee],
            newValue: ['assigned_to' => $subjectOfficer->id],
        );

        return $case;
    }

    public function changeStage(AccidentCase $case, string $stage): AccidentCase
    {
        $old = $case->current_stage;

        $case->update([
            'current_stage' => $stage,
        ]);

        $this->timelineService->create(
            accidentCase: $case,
            user: auth()->user(),
            action: 'STAGE_CHANGED',
            description: "Stage changed from {$old} to {$stage}",
            oldValue: ['stage' => $old],
            newValue: ['stage' => $stage],
        );

        return $case;
    }

    public function changeStatus(AccidentCase $case, string $status): AccidentCase
    {
        $old = $case->status;

        $case->update([
            'status' => $status,
        ]);

        $this->timelineService->create(
            accidentCase: $case,
            user: auth()->user(),
            action: 'STATUS_CHANGED',
            description: "Status changed from {$old} to {$status}",
            oldValue: ['status' => $old],
            newValue: ['status' => $status],
        );

        return $case;
    }

    public function close(AccidentCase $case): AccidentCase
    {
        $case->update([
            'current_stage' => 'CLOSED',
            'status' => 'CLOSED',
            'closed_at' => now(),
        ]);

        $this->timelineService->create(
            accidentCase: $case,
            user: auth()->user(),
            action: 'CASE_CLOSED',
            description: "Case {$case->case_number} closed",
        );

        return $case;
    }

    public function update(AccidentCase $case, array $data): AccidentCase
    {
        $old = $case->only(['assigned_to', 'priority', 'status', 'current_stage']);

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

        $this->timelineService->create(
            accidentCase: $case,
            user: auth()->user(),
            action: 'CASE_UPDATED',
            description: 'Case details updated',
            oldValue: $old,
            newValue: $case->only(['assigned_to', 'priority', 'status', 'current_stage']),
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

   public function getAll(?string $search = null): LengthAwarePaginator
    {
        return AccidentCase::query()
            ->with([
                'accident',
                'creator',
                'assignee',
                'institution',
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {

                    // Accident Case fields
                    $q->where('case_number', 'like', "%{$search}%")
                        ->orWhere('status', 'like', "%{$search}%")
                        ->orWhere('priority', 'like', "%{$search}%")
                        ->orWhere('current_stage', 'like', "%{$search}%")

                        // Accident fields
                        ->orWhereHas('accident', function ($accident) use ($search) {
                            $accident
                                ->where('id', 'like', "%{$search}%");
                                // Add other accident columns here
                                // ->orWhere('accident_number', 'like', "%{$search}%")
                                // ->orWhere('vehicle_number', 'like', "%{$search}%")
                                // ->orWhere('location', 'like', "%{$search}%");
                        })

                        // Creator
                        ->orWhereHas('creator', function ($creator) use ($search) {
                            $creator->where('name', 'like', "%{$search}%");
                        })

                        // Assignee
                        ->orWhereHas('assignee', function ($assignee) use ($search) {
                            $assignee->where('name', 'like', "%{$search}%");
                        })

                        // Institution
                        ->orWhereHas('institution', function ($institution) use ($search) {
                            $institution->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate(10);
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
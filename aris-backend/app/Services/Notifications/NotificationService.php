<?php

namespace App\Services\Notifications;

use App\Events\UserNotificationCreated;
use App\Jobs\SendTextitSmsNotification;
use App\Jobs\SendWebPushNotification;
use App\Models\Accident;
use App\Models\Approval;
use App\Models\FR1043;
use App\Models\FR1044;
use App\Models\FR109;
use App\Models\Institution;
use App\Models\Notification as UserNotification;
use App\Models\User;
use App\Notifications\DocumentRejectedNotification;
use App\Notifications\NextApprovalNotification;
use App\Notifications\RevisionRequestedNotification;
use App\Notifications\WorkflowCompletedNotification;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Model;

class NotificationService
{
    private function storeAndBroadcast(array $attributes): UserNotification
    {
        $notification = UserNotification::create($attributes);

        UserNotificationCreated::dispatch($notification);
        SendWebPushNotification::dispatch($notification)->afterCommit();

        return $notification;
    }

    /** Return the authenticated user's database notifications, newest first. */
    public function paginateFor(User $user, int $perPage = 20): LengthAwarePaginator
    {
        return UserNotification::query()
            ->where('user_id', $user->id)
            ->latest()
            ->paginate(min(max($perPage, 1), 100));
    }

    public function unreadCountFor(User $user): int
    {
        return UserNotification::query()
            ->where('user_id', $user->id)
            ->where('read', false)
            ->count();
    }

    public function markAsRead(User $user, string $notificationId): UserNotification
    {
        /** @var UserNotification $notification */
        $notification = UserNotification::query()
            ->where('user_id', $user->id)
            ->findOrFail($notificationId);

        if (is_null($notification->read_at)) {
            $notification->update([
                'read' => true,
                'read_at' => now(),
            ]);
        }

        return $notification->fresh();
    }

    public function markAllAsRead(User $user): int
    {
        return UserNotification::query()
            ->where('user_id', $user->id)
            ->where('read', false)
            ->update([
                'read' => true,
                'read_at' => now(),
            ]);
    }

    public function notifyNextApprover(Approval $approval): void
    {
        $approval->loadMissing(['approver', 'accidentCase']);

        if (! $approval->approver || ! $approval->accidentCase) {
            return;
        }

        $referenceNumber = match ($approval->document_type) {
            'FR1043' => FR1043::query()
                ->where('accident_case_id', $approval->accident_case_id)
                ->where('revision', $approval->revision)
                ->value('reference_number'),
            'FR1044' => FR1044::query()
                ->where('accident_case_id', $approval->accident_case_id)
                ->where('revision', $approval->revision)
                ->value('reference_number'),
            'FR109' => FR109::query()
                ->where('accident_case_id', $approval->accident_case_id)
                ->where('revision', $approval->revision)
                ->value('reference_number'),
            default => null,
        };

        $payload = (new NextApprovalNotification($approval, $referenceNumber))
            ->toArray($approval->approver);

        $this->storeAndBroadcast([
            'user_id' => $approval->approver_id,
            'title' => $payload['title'],
            'message' => $payload['message'],
            'type' => $payload['type'],
            'action_url' => $payload['url'],
            'read' => false,
            'data' => $payload,
        ]);
    }

    public function notifyWorkflowCompleted(User $recipient, Model $document, Approval $approval): void
    {
        $payload = (new WorkflowCompletedNotification($document, $approval))
            ->toArray($recipient);

        $this->storeAndBroadcast([
            'user_id' => $recipient->id,
            'title' => $payload['title'],
            'message' => $payload['message'],
            'type' => $payload['type'],
            'action_url' => $payload['url'],
            'read' => false,
            'data' => $payload,
        ]);
    }

    public function notifyRejected(User $recipient, Model $document, Approval $approval, string $reason): void
    {
        $payload = (new DocumentRejectedNotification($document, $approval, $reason))
            ->toArray($recipient);

        $this->storeAndBroadcast([
            'user_id' => $recipient->id,
            'title' => $payload['title'],
            'message' => $payload['message'],
            'type' => $payload['type'],
            'action_url' => $payload['url'],
            'read' => false,
            'data' => $payload,
        ]);
    }

    public function notifyRevisionRequested(User $user, Model $document, string $comments): void
    {
        $user->notify(
            new RevisionRequestedNotification(
                $document,
                $comments
            )
        );
    }

    public function notifyNewAccidentReported(Accident $accident): void
    {
        $accident->loadMissing(['institution.parentInstitution', 'reporter', 'accidentCase']);

        $institution = $accident->institution;
        $reportedUser = $accident->reporter;

        if (! $institution) {
            return;
        }

        // Ministry routing follows the reporting institution's responsibility,
        // not the geographical district where the accident happened.
        $district = trim((string) $institution->district);
        $recipients = collect();
        $current = $reportedUser?->hasRole('subject_officer')
            ? $institution->parentInstitution
            : $institution;
        $visited = [];

        while ($current && ! isset($visited[$current->id])) {
            $visited[$current->id] = true;
            $recipients = $recipients->merge($this->subjectOfficersFor($current, $district));
            $current = $current->parentInstitution;
        }

        foreach ($recipients->unique('id')->reject(fn (User $user): bool => $user->id === $reportedUser?->id) as $user) {
            $this->storeNewAccidentNotification($user, $accident);
        }
    }

    private function subjectOfficersFor(Institution $institution, string $district)
    {
        $query = User::query()
            ->where('institution_id', $institution->id)
            ->role('subject_officer');

        if ($institution->type === 'MINISTRY') {
            if ($district === '') {
                return collect();
            }

            $query->whereHas('districts', function ($query) use ($district) {
                $query->where('district', $district);
            });
        }

        return $query->get();
    }

    protected function storeNewAccidentNotification(User $user, Accident $accident): void
    {
        $case = $accident->accidentCase;
        $institutionName = $accident->institution?->name ?? 'Unknown institution';

        if (! $case) {
            return;
        }

        $message = "A new accident ({$case->case_number}) has been reported by {$institutionName}.";

        $this->storeAndBroadcast([
            'user_id' => $user->id,
            'title' => 'New Accident Report',
            'message' => $message,
            'type' => 'ACCIDENT_REPORTED',
            'action_url' => "/cases/{$case->id}/details",
            'read' => false,
            'data' => [
                'title' => 'New Accident Report',
                'message' => $message,
                'type' => 'ACCIDENT_REPORTED',
                'institution_name' => $institutionName,
                'case_number' => $case->case_number,
                'accident_id' => $accident->id,
                'accident_case_id' => $case->id,
                'url' => "/cases/{$case->id}/details",
            ],
        ]);

        if (filled($user->mobile)) {
            SendTextitSmsNotification::dispatch($user->id, $message);
        }
    }
}

<?php

namespace App\Services\Notifications;

use App\Models\Approval;
use App\Models\User;
use App\Models\Accident;
use App\Models\Notification as UserNotification;
use App\Notifications\DocumentRejectedNotification;
use App\Notifications\NextApprovalNotification;
use App\Notifications\RevisionRequestedNotification;
use App\Notifications\WorkflowCompletedNotification;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class NotificationService
{
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

  public function notifyNextApprover(Model $model, Approval $approval): void
  {
    $approval->approver->notify(
            new NextApprovalNotification($approval)
        );
  }

  public function notifyWorkflowCompleted(Model $document, User $user): void
  {
    $user->notify(
            new WorkflowCompletedNotification($document)
        );
  }

  public function notifyRejected(User $user,Model $document,string $reason): void 
  {
        $user->notify(
            new DocumentRejectedNotification(
                $document,
                $reason
            )
        );
  }

  public function notifyRevisionRequested(User $user,Model $document,string $comments): void 
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
      $institution = $accident->institution;
      $reportedUser = $accident->reporter;

      // Notify Institution Subject Officers
      if ($reportedUser?->hasRole('driver')) {

          $subjectOfficers = User::query()
              ->where('institution_id', $institution->id)
              ->role('subject_officer')
              ->get();

          foreach ($subjectOfficers as $user) {
              $this->storeNewAccidentNotification($user, $accident);
          }

      }

      // Notify Parent Subject Officers
      $parentInstitution = $institution->parentInstitution;

      if (! $parentInstitution) {
          return;
      }

      $subjectOfficers = User::query()
          ->where('institution_id', $parentInstitution->id)
          ->role('subject_officer')
          ->get();

      foreach ($subjectOfficers as $user) {
          $this->storeNewAccidentNotification($user, $accident);
      }
  }

  private function storeNewAccidentNotification(User $user, Accident $accident): void
  {
      $case = $accident->accidentCase;
      $institutionName = $accident->institution?->name ?? 'Unknown institution';

      if (! $case) {
          return;
      }

      $message = "A new accident ({$case->case_number}) has been reported by {$institutionName}.";

      UserNotification::create([
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
              'accident_id' => $accident->id,
              'accident_case_id' => $case->id,
              'url' => "/cases/{$case->id}/details",
          ],
      ]);
  }

}

<?php

namespace App\Services\Notifications;

use App\Models\Approval;
use App\Models\User;
use App\Models\Accident;
use App\Notifications\DocumentRejectedNotification;
use App\Notifications\NextApprovalNotification;
use App\Notifications\RevisionRequestedNotification;
use App\Notifications\WorkflowCompletedNotification;
use App\Notifications\NewAccidentReportedNotification;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Notifications\DatabaseNotification;

class NotificationService
{
  /** Return the authenticated user's database notifications, newest first. */
  public function paginateFor(User $user, int $perPage = 20): LengthAwarePaginator
  {
      return $user->notifications()
          ->latest()
          ->paginate(min(max($perPage, 1), 100));
  }

  public function unreadCountFor(User $user): int
  {
      return $user->unreadNotifications()->count();
  }

  public function markAsRead(User $user, string $notificationId): DatabaseNotification
  {
      /** @var DatabaseNotification $notification */
      $notification = $user->notifications()->findOrFail($notificationId);

      if (is_null($notification->read_at)) {
          $notification->markAsRead();
      }

      return $notification->fresh();
  }

  public function markAllAsRead(User $user): int
  {
      return $user->unreadNotifications()->update(['read_at' => now()]);
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
      $reportedUser = $accident->reported_by;

      // Notify Institution Subject Officers
      if($reportedUser->hasRole('driver')) {

          $subjectOfficers = User::query()
              ->where('institution_id', $institution->id)
              ->role('subject_officer')
              ->get();

          foreach ($subjectOfficers as $user) {
              $user->notify(new NewAccidentReportedNotification($accident));
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
          $user->notify(new NewAccidentReportedNotification($accident));
      }
  }

}

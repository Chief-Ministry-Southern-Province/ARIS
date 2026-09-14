<?php

namespace Tests\Feature;

use App\Jobs\SendTextitSmsNotification;
use App\Models\AccidentCase;
use App\Models\Approval;
use App\Models\FR1043;
use App\Models\Notification as UserNotification;
use App\Models\User;
use App\Services\Notifications\NotificationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class NextApproverSmsNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_pending_approver_with_a_mobile_number_receives_an_sms_notification(): void
    {
        Queue::fake();

        $approver = $this->user('0712345678');
        $approval = $this->pendingApprovalFor($approver);

        $this->notificationService()->notifyNextApprover($approval);

        Queue::assertPushed(SendTextitSmsNotification::class, function (SendTextitSmsNotification $job) use ($approver): bool {
            return $job->userId === $approver->id
                && str_contains($job->message, 'requires your approval');
        });
    }

    public function test_pending_approver_without_a_mobile_number_does_not_receive_an_sms(): void
    {
        Queue::fake();

        $approver = $this->user('');
        $approval = $this->pendingApprovalFor($approver);

        $this->notificationService()->notifyNextApprover($approval);

        Queue::assertNotPushed(SendTextitSmsNotification::class);
    }

    public function test_workflow_completion_sends_the_creator_a_concise_sms(): void
    {
        Queue::fake();

        $creator = $this->user('0712345678');
        $approval = $this->pendingApprovalFor($creator);
        $document = new FR1043(['reference_number' => 'FR1043/TEST/001']);

        $this->notificationService()->notifyWorkflowCompleted($creator, $document, $approval);

        Queue::assertPushed(SendTextitSmsNotification::class, function (SendTextitSmsNotification $job) use ($creator): bool {
            return $job->userId === $creator->id
                && $job->message === 'ARIS: FR1043 FR1043/TEST/001 has completed all approval steps.';
        });
    }

    public function test_rejection_sends_the_creator_an_sms_without_the_private_comments(): void
    {
        Queue::fake();

        $creator = $this->user('0712345678');
        $approval = $this->pendingApprovalFor($creator);
        $document = new FR1043(['reference_number' => 'FR1043/TEST/001']);

        $this->notificationService()->notifyRejected($creator, $document, $approval, 'Private rejection detail');

        Queue::assertPushed(SendTextitSmsNotification::class, function (SendTextitSmsNotification $job) use ($creator): bool {
            return $job->userId === $creator->id
                && $job->message === 'ARIS: Changes were requested for FR1043 FR1043/TEST/001. Sign in to review comments and resubmit.';
        });
    }

    private function user(string $mobile): User
    {
        $user = new User([
            'name' => 'Pending Approver',
            'nic' => 'NIC'.fake()->unique()->numerify('#########'),
            'mobile' => $mobile,
            'password' => 'password',
        ]);
        $user->id = fake()->unique()->numberBetween(1, 9999);

        return $user;
    }

    private function pendingApprovalFor(User $approver): Approval
    {
        $case = new AccidentCase(['case_number' => 'ARIS/TEST/0001']);
        $case->id = 1;

        $approval = new Approval([
            'accident_case_id' => $case->id,
            'document_type' => 'FR1043',
            'revision' => 1,
            'step' => 1,
            'approver_id' => $approver->id,
            'status' => 'PENDING',
        ]);
        $approval->id = 1;
        $approval->setRelation('approver', $approver);
        $approval->setRelation('accidentCase', $case);

        return $approval;
    }

    private function notificationService(): NotificationService
    {
        return new class extends NotificationService
        {
            protected function storeAndBroadcast(array $attributes): UserNotification
            {
                return new UserNotification($attributes);
            }
        };
    }
}

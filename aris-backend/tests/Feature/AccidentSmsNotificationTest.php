<?php

namespace Tests\Feature;

use App\Jobs\SendTextitSmsNotification;
use App\Models\Accident;
use App\Models\AccidentCase;
use App\Models\Institution;
use App\Models\User;
use App\Services\Notifications\NotificationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AccidentSmsNotificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_driver_report_notifies_local_and_parent_subject_officers(): void
    {
        Queue::fake();
        [$local, $rdhs, $ministry] = $this->institutionHierarchy();
        $reporter = $this->user($local, 'driver');
        $localOfficer = $this->user($local, 'subject_officer');
        $rdhsOfficer = $this->user($rdhs, 'subject_officer');
        $ministryOfficer = $this->user($ministry, 'subject_officer', 'Galle');
        $otherMinistryOfficer = $this->user($ministry, 'subject_officer', 'Matara');

        $service = $this->notificationService();
        $service->notifyNewAccidentReported($this->accident($local, $reporter));

        $this->assertSame([$localOfficer->id, $rdhsOfficer->id, $ministryOfficer->id], $service->recipientIds);
        $this->assertNotContains($otherMinistryOfficer->id, $service->recipientIds);
        Queue::assertPushed(SendTextitSmsNotification::class, 3);
    }

    public function test_a_subject_officer_report_notifies_only_parent_subject_officers(): void
    {
        Queue::fake();
        [$local, $rdhs, $ministry] = $this->institutionHierarchy();
        $reporter = $this->user($local, 'subject_officer');
        $otherLocalOfficer = $this->user($local, 'subject_officer');
        $rdhsOfficer = $this->user($rdhs, 'subject_officer');
        $ministryOfficer = $this->user($ministry, 'subject_officer', 'Galle');

        $service = $this->notificationService();
        $service->notifyNewAccidentReported($this->accident($local, $reporter));

        $this->assertNotContains($reporter->id, $service->recipientIds);
        $this->assertNotContains($otherLocalOfficer->id, $service->recipientIds);
        $this->assertSame([$rdhsOfficer->id, $ministryOfficer->id], $service->recipientIds);
        Queue::assertPushed(SendTextitSmsNotification::class, 2);
    }

    /** @return array{Institution, Institution, Institution} */
    private function institutionHierarchy(): array
    {
        $ministry = Institution::query()->create(['name' => 'Test Ministry', 'type' => 'MINISTRY']);
        $rdhs = Institution::query()->create([
            'name' => 'Test RDHS',
            'type' => 'RDHS',
            'parent_institution_id' => $ministry->id,
        ]);
        $local = Institution::query()->create([
            'name' => 'Test Hospital',
            'type' => 'BASE_HOSPITAL',
            'district' => 'Galle',
            'parent_institution_id' => $rdhs->id,
        ]);

        $local->setRelation('parentInstitution', $rdhs);
        $rdhs->setRelation('parentInstitution', $ministry);
        $ministry->setRelation('parentInstitution', null);

        return [$local, $rdhs, $ministry];
    }

    private function user(Institution $institution, string $role, ?string $district = null): User
    {
        $user = User::query()->create([
            'name' => fake()->name(),
            'nic' => 'NIC'.fake()->unique()->numerify('#########'),
            'mobile' => '07'.fake()->unique()->numerify('########'),
            'password' => 'password',
            'institution_id' => $institution->id,
        ]);
        $user->assignRole(Role::findOrCreate($role, 'web'));

        if ($district !== null) {
            $user->districts()->create(['district' => $district]);
        }

        return $user;
    }

    private function accident(Institution $institution, User $reporter): Accident
    {
        $case = new AccidentCase(['case_number' => 'ARIS/TEST/0001']);
        $case->id = 1;

        $accident = new Accident([
            'reference_number' => 'ARIS/TEST/0001',
            'district' => 'Galle',
        ]);
        $accident->id = 1;
        $accident->setRelation('institution', $institution);
        $accident->setRelation('reporter', $reporter);
        $accident->setRelation('accidentCase', $case);

        return $accident;
    }

    private function notificationService(): NotificationService
    {
        return new class extends NotificationService
        {
            /** @var array<int, int> */
            public array $recipientIds = [];

            protected function storeNewAccidentNotification(User $user, Accident $accident): void
            {
                $this->recipientIds[] = $user->id;
                SendTextitSmsNotification::dispatch($user->id, 'New accident report');
            }
        };
    }
}

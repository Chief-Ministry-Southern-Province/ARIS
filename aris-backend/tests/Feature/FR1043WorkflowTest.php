<?php

namespace Tests\Feature;

use App\Models\Accident;
use App\Models\AccidentCase;
use App\Models\Approval;
use App\Models\FR1043;
use App\Models\Institution;
use App\Models\User;
use App\Models\UserSignature;
use App\Models\Vehicle;
use App\Models\WorkflowSetting;
use App\Services\Notifications\NotificationService;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Str;
use Mockery\MockInterface;
use Tests\TestCase;

class FR1043WorkflowTest extends TestCase
{
    use RefreshDatabase;

    private AccidentCase $case;

    private User $creator;

    private User $administrativeOfficer;

    private User $deputyDirector;

    private User $provincialDirector;

    protected function setUp(): void
    {
        parent::setUp();

        Queue::fake();
        $this->mock(NotificationService::class, function (MockInterface $notifications): void {
            $notifications->shouldReceive('notifyNextApprover')->zeroOrMoreTimes();
            $notifications->shouldReceive('notifyRejected')->zeroOrMoreTimes();
            $notifications->shouldReceive('notifyWorkflowCompleted')->zeroOrMoreTimes();
        });
        $this->seed(RoleSeeder::class);

        WorkflowSetting::query()->updateOrCreate(
            ['key' => 'workflow.pdhs_threshold'],
            ['value' => '1000', 'type' => 'integer', 'description' => 'Test PDHS threshold'],
        );
        WorkflowSetting::query()->updateOrCreate(
            ['key' => 'workflow.ministry_threshold'],
            ['value' => '2000', 'type' => 'integer', 'description' => 'Test Ministry threshold'],
        );

        $ministry = Institution::factory()->ministry()->create();
        $pdhs = Institution::factory()->create([
            'type' => 'PDHS',
            'parent_institution_id' => $ministry->id,
        ]);

        $this->creator = User::factory()->for($pdhs)->withRole('subject_officer')->create();
        $this->administrativeOfficer = User::factory()->for($pdhs)->withRole('administrative_officer')->create();
        $this->deputyDirector = User::factory()->for($pdhs)->withRole('deputy_director')->create();
        $this->provincialDirector = User::factory()->for($pdhs)->withRole('provincial_director')->create();

        $vehicle = Vehicle::create([
            'vehicle_number' => 'SP-TEST-1001',
            'vehicle_type' => 'VAN',
            'brand' => 'Test Brand',
            'model' => 'Test Model',
            'manufactured_year' => 2024,
            'engine_number' => 'ENGINE-TEST-1001',
            'chassis_number' => 'CHASSIS-TEST-1001',
            'insurance_number' => 'INSURANCE-TEST-1001',
            'insurance_expiry_date' => '2027-12-31',
            'registered_owner' => 'Southern Provincial Health Service',
            'fuel_type' => 'DIESEL',
            'institution_id' => $pdhs->id,
        ]);

        $accident = Accident::create([
            'reference_number' => 'CMSP/HLTH/PDHS/2026/0001',
            'institution_id' => $pdhs->id,
            'reported_by' => $this->creator->id,
            'vehicle_id' => $vehicle->id,
            'accident_date' => '2026-09-07',
            'accident_time' => '09:00',
            'severity' => 'MINOR',
            'province' => 'Southern',
            'district' => 'Galle',
            'location' => 'Galle Road',
            'road_condition' => 'DRY',
            'weather_condition' => 'SUNNY',
        ]);

        $this->case = AccidentCase::create([
            'case_number' => $accident->reference_number,
            'accident_id' => $accident->id,
            'institution_id' => $pdhs->id,
            'created_by' => $this->creator->id,
        ]);
    }

    public function test_subject_officer_can_create_a_draft_and_submit_it_for_the_resolved_approval_workflow(): void
    {
        $fr1043 = $this->createDraft();

        $this->assertDatabaseHas('fr1043s', [
            'id' => $fr1043->id,
            'reference_number' => $this->case->case_number,
            'revision' => 1,
            'status' => 'DRAFT',
            'created_by' => $this->creator->id,
        ]);
        $this->assertDatabaseHas('case_histories', [
            'accident_case_id' => $this->case->id,
            'action' => 'FR1043_DRAFT_CREATED',
        ]);

        $this->fromStatefulSpa()->actingAs($this->creator)
            ->postJson("/api/fr1043/{$fr1043->id}/submit")
            ->assertOk()
            ->assertJsonPath('status', 'UNDER_APPROVAL')
            ->assertJsonPath('revision', 1);

        $this->assertDatabaseHas('fr1043s', ['id' => $fr1043->id, 'status' => 'UNDER_APPROVAL']);
        $this->assertDatabaseHas('accident_cases', ['id' => $this->case->id, 'current_stage' => 'FR1043']);
        $this->assertDatabaseHas('approvals', [
            'accident_case_id' => $this->case->id,
            'document_type' => 'FR1043',
            'revision' => 1,
            'step' => 1,
            'approver_id' => $this->administrativeOfficer->id,
            'status' => 'PENDING',
        ]);
        $this->assertDatabaseCount('approvals', 3);
        $this->assertDatabaseHas('case_histories', [
            'accident_case_id' => $this->case->id,
            'action' => 'FR1043_SUBMITTED',
        ]);
    }

    public function test_only_the_document_creator_can_edit_or_submit_the_draft(): void
    {
        $fr1043 = $this->createDraft();
        $replacementData = $this->validData(['department' => 'Unauthorised update']);

        $this->fromStatefulSpa()->actingAs($this->administrativeOfficer)
            ->putJson("/api/fr1043/{$fr1043->id}", ['status' => 'DRAFT', 'data' => $replacementData])
            ->assertForbidden();

        $this->fromStatefulSpa()->actingAs($this->administrativeOfficer)
            ->postJson("/api/fr1043/{$fr1043->id}/submit")
            ->assertForbidden();

        $this->assertDatabaseHas('fr1043s', [
            'id' => $fr1043->id,
            'status' => 'DRAFT',
        ]);
    }

    public function test_rejection_requires_a_comment_and_a_creator_revision_preserves_the_old_document(): void
    {
        $fr1043 = $this->submitDraft();
        $approval = $this->firstApproval();

        $this->fromStatefulSpa()->actingAs($this->administrativeOfficer)
            ->postJson("/api/approvals/{$approval->id}/reject", [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('comments');

        $this->fromStatefulSpa()->actingAs($this->administrativeOfficer)
            ->postJson("/api/approvals/{$approval->id}/reject", ['comments' => 'Please correct the investigation details.'])
            ->assertOk()
            ->assertJsonPath('data.status', 'REJECTED');

        $this->assertDatabaseHas('fr1043s', ['id' => $fr1043->id, 'status' => 'CHANGES_REQUESTED']);
        $this->assertDatabaseHas('case_histories', [
            'accident_case_id' => $this->case->id,
            'action' => 'FR1043_REJECTED',
        ]);

        $revisedData = $this->validData(['investigation' => 'Corrected investigation findings.']);
        $this->fromStatefulSpa()->actingAs($this->creator)
            ->putJson("/api/fr1043/{$fr1043->id}", ['status' => 'CHANGES_REQUESTED', 'data' => $revisedData])
            ->assertCreated()
            ->assertJsonPath('revision', 2)
            ->assertJsonPath('status', 'DRAFT')
            ->assertJsonPath('reference_number', $this->case->case_number)
            ->assertJsonPath('data.investigation', 'Corrected investigation findings.');

        $this->assertDatabaseHas('fr1043s', [
            'id' => $fr1043->id,
            'revision' => 1,
            'status' => 'CHANGES_REQUESTED',
        ]);
        $this->assertDatabaseHas('case_histories', [
            'accident_case_id' => $this->case->id,
            'action' => 'FR1043_REVISION_CREATED',
        ]);

        $revision = FR1043::query()->where('accident_case_id', $this->case->id)->where('revision', 2)->firstOrFail();
        $this->fromStatefulSpa()->actingAs($this->creator)
            ->postJson("/api/fr1043/{$revision->id}/submit")
            ->assertOk()
            ->assertJsonPath('status', 'UNDER_APPROVAL');

        $this->assertDatabaseCount('approvals', 6);
        $this->assertDatabaseHas('approvals', [
            'accident_case_id' => $this->case->id,
            'document_type' => 'FR1043',
            'revision' => 2,
            'step' => 1,
            'approver_id' => $this->administrativeOfficer->id,
            'status' => 'PENDING',
        ]);
    }

    public function test_only_assigned_approver_can_act_and_final_approval_advances_the_case(): void
    {
        $this->submitDraft();
        $firstApproval = $this->firstApproval();

        $this->fromStatefulSpa()->actingAs($this->deputyDirector)
            ->postJson("/api/approvals/{$firstApproval->id}/approve")
            ->assertForbidden();

        $this->fromStatefulSpa()->actingAs($this->administrativeOfficer)
            ->postJson("/api/approvals/{$firstApproval->id}/approve", ['comments' => 'Reviewed.'])
            ->assertOk()
            ->assertJsonPath('data.status', 'RECOMMENDED');

        $secondApproval = Approval::query()->where('accident_case_id', $this->case->id)->where('step', 2)->firstOrFail();
        $this->fromStatefulSpa()->actingAs($this->deputyDirector)
            ->postJson("/api/approvals/{$secondApproval->id}/approve")
            ->assertOk()
            ->assertJsonPath('data.status', 'RECOMMENDED');

        UserSignature::create([
            'public_id' => (string) Str::uuid(),
            'user_id' => $this->provincialDirector->id,
            'path' => 'signatures/test-provincial-director.png',
            'is_active' => true,
        ]);

        $finalApproval = Approval::query()->where('accident_case_id', $this->case->id)->where('step', 3)->firstOrFail();
        $this->fromStatefulSpa()->actingAs($this->provincialDirector)
            ->postJson("/api/approvals/{$finalApproval->id}/approve")
            ->assertOk()
            ->assertJsonPath('data.status', 'APPROVED');

        $this->assertDatabaseHas('fr1043s', [
            'accident_case_id' => $this->case->id,
            'revision' => 1,
            'status' => 'APPROVED',
        ]);
        $this->assertDatabaseHas('accident_cases', ['id' => $this->case->id, 'current_stage' => 'FR1044']);
        $this->assertDatabaseHas('case_histories', [
            'accident_case_id' => $this->case->id,
            'action' => 'FR1043_WORKFLOW_COMPLETED',
        ]);
    }

    private function createDraft(): FR1043
    {
        $response = $this->fromStatefulSpa()->actingAs($this->creator)
            ->postJson("/api/cases/{$this->case->id}/fr1043", [
                'status' => 'DRAFT',
                'data' => $this->validData(),
            ])
            ->assertCreated()
            ->assertJsonPath('status', 'DRAFT')
            ->assertJsonPath('revision', 1)
            ->assertJsonPath('reference_number', $this->case->case_number);

        return FR1043::query()->findOrFail($response->json('id'));
    }

    private function submitDraft(): FR1043
    {
        $fr1043 = $this->createDraft();

        $this->fromStatefulSpa()->actingAs($this->creator)
            ->postJson("/api/fr1043/{$fr1043->id}/submit")
            ->assertOk();

        return $fr1043->fresh();
    }

    private function firstApproval(): Approval
    {
        return Approval::query()
            ->where('accident_case_id', $this->case->id)
            ->where('document_type', 'FR1043')
            ->where('revision', 1)
            ->where('step', 1)
            ->firstOrFail();
    }

    private function validData(array $overrides = []): array
    {
        return array_replace([
            'department' => 'Provincial Health Department',
            'date' => '2026-09-07',
            'place' => 'Galle Road',
            'natureOfLoss' => 'Vehicle damage',
            'causeOfLoss' => 'Road accident',
            'policeStation' => 'Galle Police Station',
            'policeReportDate' => '2026-09-07',
            'investigation' => 'Initial investigation findings.',
            'securityArrangements' => 'Vehicle was parked in the designated area.',
            'preventionArrangements' => 'Provide driver safety training.',
            'items' => [[
                'description' => 'Rear light assembly',
                'quantity' => 1,
                'value' => 500,
            ]],
            'officers' => [[
                'name' => 'Test Officer',
                'designation' => 'Investigation Officer',
            ]],
        ], $overrides);
    }
}

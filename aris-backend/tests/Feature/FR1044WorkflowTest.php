<?php

namespace Tests\Feature;

use App\Models\Accident;
use App\Models\AccidentCase;
use App\Models\Approval;
use App\Models\FR1043;
use App\Models\FR1044;
use App\Models\Institution;
use App\Models\User;
use App\Models\UserSignature;
use App\Models\Vehicle;
use App\Models\WorkflowSetting;
use App\Services\Notifications\NotificationService;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Mockery\MockInterface;
use Tests\TestCase;

class FR1044WorkflowTest extends TestCase
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
        Storage::fake('public');
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
            'vehicle_number' => 'SP-TEST-1044',
            'vehicle_type' => 'VAN',
            'brand' => 'Test Brand',
            'model' => 'Test Model',
            'manufactured_year' => 2024,
            'engine_number' => 'ENGINE-TEST-1044',
            'chassis_number' => 'CHASSIS-TEST-1044',
            'insurance_number' => 'INSURANCE-TEST-1044',
            'insurance_expiry_date' => '2027-12-31',
            'registered_owner' => 'Southern Provincial Health Service',
            'fuel_type' => 'DIESEL',
            'institution_id' => $pdhs->id,
        ]);

        $accident = Accident::create([
            'reference_number' => 'CMSP/HLTH/PDHS/2026/1044',
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
            'current_stage' => 'FR1044',
        ]);
    }

    public function test_an_approved_fr1043_is_required_before_a_subject_officer_can_create_fr1044(): void
    {
        $this->fromStatefulSpa()->actingAs($this->creator)
            ->postJson("/api/cases/{$this->case->id}/fr1044", ['data' => ['referenceNo' => 'Draft']])
            ->assertConflict()
            ->assertJsonPath('message', 'An approved FR1043 preliminary report is required before creating or updating FR1044.');

        $this->assertDatabaseCount('fr1044s', 0);
    }

    public function test_creator_can_upload_draft_attachments_and_submit_fr1044_to_the_resolved_workflow(): void
    {
        $this->createApprovedFR1043();
        $fr1044 = $this->createDraft();

        $this->assertDatabaseHas('case_histories', [
            'accident_case_id' => $this->case->id,
            'action' => 'FR1044_DRAFT_CREATED',
        ]);

        $evidenceIds = [];
        foreach (['policeReportFile', 'courtOrderFile', 'boardReportFile'] as $fieldKey) {
            $response = $this->fromStatefulSpa()->actingAs($this->creator)
                ->post("/api/fr1044/{$fr1044->id}/attachments", [
                    'file' => UploadedFile::fake()->create("{$fieldKey}.pdf", 20, 'application/pdf'),
                    'field_key' => $fieldKey,
                    'description' => "Test {$fieldKey}",
                ])
                ->assertOk()
                ->assertJsonPath('data.document_type', 'FR1044')
                ->assertJsonPath('data.document_revision', 1)
                ->assertJsonPath('data.field_key', $fieldKey);

            $evidenceIds[$fieldKey] = $response->json('data.id');
        }

        $data = $this->validData([
            'policeReportEvidenceId' => $evidenceIds['policeReportFile'],
            'courtOrderEvidenceId' => $evidenceIds['courtOrderFile'],
            'boardReportEvidenceId' => $evidenceIds['boardReportFile'],
        ]);

        $this->fromStatefulSpa()->actingAs($this->creator)
            ->putJson("/api/fr1044/{$fr1044->id}", ['data' => $data])
            ->assertOk()
            ->assertJsonPath('status', 'DRAFT')
            ->assertJsonPath('data.preliminaryReportRefNo', $this->case->case_number);

        $this->fromStatefulSpa()->actingAs($this->creator)
            ->postJson("/api/fr1044/{$fr1044->id}/submit")
            ->assertOk()
            ->assertJsonPath('status', 'UNDER_APPROVAL')
            ->assertJsonPath('revision', 1);

        $this->assertDatabaseHas('fr1044s', ['id' => $fr1044->id, 'status' => 'UNDER_APPROVAL']);
        $this->assertDatabaseHas('accident_cases', ['id' => $this->case->id, 'current_stage' => 'FR1044']);
        $this->assertDatabaseCount('approvals', 3);
        $this->assertDatabaseHas('approvals', [
            'accident_case_id' => $this->case->id,
            'document_type' => 'FR1044',
            'revision' => 1,
            'step' => 1,
            'approver_id' => $this->administrativeOfficer->id,
            'status' => 'PENDING',
        ]);
        $this->assertDatabaseHas('case_histories', [
            'accident_case_id' => $this->case->id,
            'action' => 'FR1044_SUBMITTED',
        ]);
    }

    public function test_rejection_requires_a_comment_and_resubmission_creates_an_immutable_new_revision(): void
    {
        $fr1044 = $this->submitDraftWithAttachments();
        $approval = $this->firstApproval();

        $this->fromStatefulSpa()->actingAs($this->administrativeOfficer)
            ->postJson("/api/approvals/{$approval->id}/reject", [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('comments');

        $this->fromStatefulSpa()->actingAs($this->administrativeOfficer)
            ->postJson("/api/approvals/{$approval->id}/reject", ['comments' => 'Please correct the loss details.'])
            ->assertOk()
            ->assertJsonPath('data.status', 'REJECTED');

        $this->assertDatabaseHas('fr1044s', ['id' => $fr1044->id, 'status' => 'CHANGES_REQUESTED']);

        $this->fromStatefulSpa()->actingAs($this->creator)
            ->putJson("/api/fr1044/{$fr1044->id}", [
                'data' => $this->validData([
                    'lossDetails' => 'Corrected loss details.',
                    ...$this->evidenceIdsFor($fr1044),
                ]),
            ])
            ->assertCreated()
            ->assertJsonPath('status', 'DRAFT')
            ->assertJsonPath('revision', 2)
            ->assertJsonPath('reference_number', $this->case->case_number)
            ->assertJsonPath('data.lossDetails', 'Corrected loss details.');

        $this->assertDatabaseHas('fr1044s', [
            'id' => $fr1044->id,
            'revision' => 1,
            'status' => 'CHANGES_REQUESTED',
        ]);
        $this->assertDatabaseHas('case_histories', [
            'accident_case_id' => $this->case->id,
            'action' => 'FR1044_REVISION_CREATED',
        ]);

        $revision = FR1044::query()
            ->where('accident_case_id', $this->case->id)
            ->where('revision', 2)
            ->firstOrFail();
        $this->fromStatefulSpa()->actingAs($this->creator)
            ->postJson("/api/fr1044/{$revision->id}/submit")
            ->assertOk()
            ->assertJsonPath('status', 'UNDER_APPROVAL');

        $this->assertDatabaseCount('approvals', 6);
        $this->assertDatabaseHas('approvals', [
            'accident_case_id' => $this->case->id,
            'document_type' => 'FR1044',
            'revision' => 2,
            'step' => 1,
            'approver_id' => $this->administrativeOfficer->id,
            'status' => 'PENDING',
        ]);
    }

    public function test_only_the_assigned_approver_can_act_and_final_approval_advances_the_case_to_fr109(): void
    {
        $this->submitDraftWithAttachments();
        $firstApproval = $this->firstApproval();

        $this->fromStatefulSpa()->actingAs($this->deputyDirector)
            ->postJson("/api/approvals/{$firstApproval->id}/approve")
            ->assertForbidden();

        $this->fromStatefulSpa()->actingAs($this->administrativeOfficer)
            ->postJson("/api/approvals/{$firstApproval->id}/approve", ['comments' => 'Reviewed.'])
            ->assertOk()
            ->assertJsonPath('data.status', 'RECOMMENDED');

        $secondApproval = Approval::query()
            ->where('accident_case_id', $this->case->id)
            ->where('document_type', 'FR1044')
            ->where('step', 2)
            ->firstOrFail();
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

        $finalApproval = Approval::query()
            ->where('accident_case_id', $this->case->id)
            ->where('document_type', 'FR1044')
            ->where('step', 3)
            ->firstOrFail();
        $this->fromStatefulSpa()->actingAs($this->provincialDirector)
            ->postJson("/api/approvals/{$finalApproval->id}/approve")
            ->assertOk()
            ->assertJsonPath('data.status', 'APPROVED');

        $this->assertDatabaseHas('fr1044s', [
            'accident_case_id' => $this->case->id,
            'revision' => 1,
            'status' => 'APPROVED',
        ]);
        $this->assertDatabaseHas('accident_cases', [
            'id' => $this->case->id,
            'current_stage' => 'FR109',
            'status' => 'IN_PROGRESS',
        ]);
        $this->assertDatabaseHas('case_histories', [
            'accident_case_id' => $this->case->id,
            'action' => 'FR1044_WORKFLOW_COMPLETED',
        ]);
    }

    private function createApprovedFR1043(): void
    {
        FR1043::create([
            'reference_number' => $this->case->case_number,
            'accident_case_id' => $this->case->id,
            'created_by' => $this->creator->id,
            'revision' => 1,
            'status' => 'APPROVED',
            'approved_at' => '2026-09-07 10:00:00',
            'data' => [],
        ]);
    }

    private function createDraft(): FR1044
    {
        $response = $this->fromStatefulSpa()->actingAs($this->creator)
            ->postJson("/api/cases/{$this->case->id}/fr1044", ['data' => ['referenceNo' => 'Draft']])
            ->assertCreated()
            ->assertJsonPath('status', 'DRAFT')
            ->assertJsonPath('revision', 1)
            ->assertJsonPath('reference_number', $this->case->case_number);

        return FR1044::query()->findOrFail($response->json('id'));
    }

    private function submitDraftWithAttachments(): FR1044
    {
        $this->createApprovedFR1043();
        $fr1044 = $this->createDraft();
        $evidenceIds = [];

        foreach (['policeReportFile', 'courtOrderFile', 'boardReportFile'] as $fieldKey) {
            $response = $this->fromStatefulSpa()->actingAs($this->creator)
                ->post("/api/fr1044/{$fr1044->id}/attachments", [
                    'file' => UploadedFile::fake()->create("{$fieldKey}.pdf", 20, 'application/pdf'),
                    'field_key' => $fieldKey,
                ])
                ->assertOk();
            $evidenceIds[$fieldKey] = $response->json('data.id');
        }

        $this->fromStatefulSpa()->actingAs($this->creator)
            ->putJson("/api/fr1044/{$fr1044->id}", ['data' => $this->validData([
                'policeReportEvidenceId' => $evidenceIds['policeReportFile'],
                'courtOrderEvidenceId' => $evidenceIds['courtOrderFile'],
                'boardReportEvidenceId' => $evidenceIds['boardReportFile'],
            ])])
            ->assertOk();
        $this->fromStatefulSpa()->actingAs($this->creator)
            ->postJson("/api/fr1044/{$fr1044->id}/submit")
            ->assertOk();

        return $fr1044->fresh();
    }

    private function firstApproval(): Approval
    {
        return Approval::query()
            ->where('accident_case_id', $this->case->id)
            ->where('document_type', 'FR1044')
            ->where('revision', 1)
            ->where('step', 1)
            ->firstOrFail();
    }

    private function evidenceIdsFor(FR1044 $fr1044): array
    {
        return [
            'policeReportEvidenceId' => $fr1044->data['policeReportEvidenceId'],
            'courtOrderEvidenceId' => $fr1044->data['courtOrderEvidenceId'],
            'boardReportEvidenceId' => $fr1044->data['boardReportEvidenceId'],
        ];
    }

    private function validData(array $overrides = []): array
    {
        return array_replace([
            'department' => 'Provincial Health Department',
            'secretaryOfMinistry' => 'Secretary, Ministry of Health',
            'lossDate' => '2026-09-07',
            'lossTime' => '09:00',
            'location' => 'Galle Road',
            'investigation' => 'Detailed investigation findings.',
            'lossDetails' => 'Vehicle body damage.',
            'circumstances' => 'Collision while travelling on duty.',
            'causeOfLoss' => 'Driver error.',
            'isDueToFraudNegligence' => 'no',
            'policeReportSummary' => 'Police report received.',
            'courtName' => 'Galle Magistrate Court',
            'courtCaseNo' => 'MC/2026/1044',
            'courtOrderSummary' => 'Court order is pending.',
            'insuranceRecoverableAmountWords' => 'Fifty thousand rupees only.',
            'policyNo' => 'POL-1044',
            'amountInsured' => 100000,
            'amountRecoverable' => 50000,
            'recommendations' => 'Recover the insured amount.',
            'boardReportSummary' => 'Board report completed.',
            'preventiveActions' => 'Provide driver safety training.',
            'lostItems' => [[
                'description' => 'Rear light assembly',
                'unit' => 'Each',
                'quantity' => 1,
                'estimatedCost' => 500,
                'replacementCost' => 600,
                'fr105Value' => 450,
                'originalCost' => 500,
            ]],
            'officers' => [[
                'name' => 'Test Officer',
                'designation' => 'Driver',
                'responsibility' => 'Driver responsibility',
                'disciplinaryAction' => 'Warning issued',
                'punishment' => 'Written warning',
            ]],
            'recoveries' => [[
                'officer' => 'Insurance Company',
                'amount' => 50000,
                'method' => 'Insurance claim',
            ]],
            'boardMembers' => [[
                'memberName' => 'Board Member',
                'designation' => 'Medical Officer',
            ]],
        ], $overrides);
    }
}

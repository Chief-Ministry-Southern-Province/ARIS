<?php

namespace App\Notifications;

use App\Models\Approval;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NextApprovalNotification extends Notification
{
    use Queueable;

    public const TYPE = 'APPROVAL_REQUIRED';
    public const RECOMMENDATION_TYPE = 'RECOMMENDATION_REQUIRED';

    public function __construct(
        private readonly Approval $approval,
        private readonly ?string $referenceNumber,
    ) {
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Payload shared by the custom notifications table and the frontend.
     *
     * The approval service persists this payload in the application's custom
     * notifications table instead of Laravel's polymorphic notifications table.
     */
    public function toArray(object $notifiable): array
    {
        $document = trim("{$this->approval->document_type} {$this->referenceNumber}");
        $caseNumber = $this->approval->accidentCase?->case_number ?? 'this case';
        $requiresRecommendation = $this->requiresRecommendation();
        $action = $requiresRecommendation ? 'recommendation' : 'approval';

        return [
            'title' => $requiresRecommendation ? 'Recommendation Required' : 'Approval Required',
            'message' => "{$document} requires your {$action} for {$caseNumber}.",
            'type' => $requiresRecommendation ? self::RECOMMENDATION_TYPE : self::TYPE,
            'approval_id' => $this->approval->id,
            'accident_case_id' => $this->approval->accident_case_id,
            'document_type' => $this->approval->document_type,
            'reference_number' => $this->referenceNumber,
            'revision' => $this->approval->revision,
            'step' => $this->approval->step,
            'url' => "/approvals/{$this->approval->id}",
        ];
    }

    public function toDatabase(object $notifiable): array
    {
        return $this->toArray($notifiable);
    }

    private function requiresRecommendation(): bool
    {
        return Approval::query()
            ->where('accident_case_id', $this->approval->accident_case_id)
            ->where('document_type', $this->approval->document_type)
            ->where('revision', $this->approval->revision)
            ->where('step', '>', $this->approval->step)
            ->exists();
    }
}

<?php

namespace App\Notifications;

use App\Models\Approval;
use Illuminate\Bus\Queueable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notification;

class DocumentRejectedNotification extends Notification
{
    use Queueable;

    public const TYPE = 'DOCUMENT_REJECTED';

    public function __construct(
        private readonly Model $document,
        private readonly Approval $approval,
        private readonly string $reason,
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
     * Payload persisted by NotificationService in the application's custom
     * notifications table and consumed by the React notification UI.
     */
    public function toArray(object $notifiable): array
    {
        $documentType = $this->approval->document_type;
        $referenceNumber = $this->document->reference_number;
        $caseId = $this->approval->accident_case_id;

        return [
            'title' => 'Document Changes Requested',
            'message' => "{$documentType} {$referenceNumber} was rejected. Reason: {$this->reason}",
            'type' => self::TYPE,
            'approval_id' => $this->approval->id,
            'accident_case_id' => $caseId,
            'document_type' => $documentType,
            'reference_number' => $referenceNumber,
            'revision' => $this->approval->revision,
            'comments' => $this->reason,
            'url' => "/cases/{$caseId}/details",
        ];
    }

    public function toDatabase(object $notifiable): array
    {
        return $this->toArray($notifiable);
    }
}

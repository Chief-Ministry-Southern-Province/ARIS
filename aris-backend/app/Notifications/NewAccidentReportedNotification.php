<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

use App\Models\Accident;

class NewAccidentReportedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(protected Accident $accident)
    {}

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
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [

            'title' => 'New Accident Report',

            'message' => sprintf(
                'A new accident (%s) has been reported.',
                $this->accident->accidentCase->case_number
            ),

            'type' => 'ACCIDENT_REPORTED',

            'accident_id' => $this->accident->id,

            'accident_case_id' => $this->accident->accidentCase->id,

            'url' => "/cases/{$this->accident->accidentCase->id}/details",

        ];
    }
}

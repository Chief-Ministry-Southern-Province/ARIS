<?php
  namespace App\Services;

  use Twilio\Rest\Client;

  class TwilioService
  {
      protected $twilio;

      public function __construct()
      {
          $this->twilio = new Client(
              config('services.twilio.sid'),
              config('services.twilio.token')
          );
      }

      public function sendOtp($mobile, $otp): void
      {
          $message = "Your OTP is: $otp";

          $this->twilio->messages->create(
              $mobile,
              [
                  'from' => config('services.twilio.from'),
                  'body' => "Your ARIS verification code is: {$otp}",
              ]
          );
      }
  }
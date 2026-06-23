<?php
  namespace App\Services;

  use Twilio\Rest\Client;

  class TwilioService
  {
      protected $twilio;

      public function __construct()
      {
          $this->twilio = new Client(
              env('TWILIO_SID'),
              env('TWILIO_AUTH_TOKEN')
          );
      }

      public function sendOtp($mobile, $otp): void
      {
          $message = "Your OTP is: $otp";

          $this->twilio->messages->create(
              $mobile,
              [
                  'from' => env('TWILIO_PHONE_NUMBER'),
                  'body' => "Your ARIS verification code is: {$otp}",
              ]
          );
      }
  }
<?php

  class SignatureService
  {
    public function __construct(
      private SignatureStorageService $storageService
    ) {}

    public function upload(User $user,UploadedFile $file):UserSignature{
      DB::transaction(function () use ($user) {
          $user

                ->signatures()
                ->where('is_active', true)
                ->update([
                    'is_active' => false
                ]);
      });

      $path = $this->storageService->store($user, $file);

      return $user->signatures()->create([
          'disk' => 'private',
          'path' => $path,
          'is_active' => true,
      ]);
    }

    public function delete(UserSignature $signature):void
    {
       DB::transaction(function () use ($signature) {

            $this->storageService->delete(
                $signature->path
            );

            $signature->delete();
        });
    }
    
  }
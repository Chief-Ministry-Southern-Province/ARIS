<?php

  class SignatureService
  {
      public function __construct(
          private SignatureStorageService $storageService
      ) {}

      public function upload(User $user, UploadedFile $file): UserSignature
      {
          return DB::transaction(function () use ($user, $file) {

              $user->signatures()
                  ->where('is_active', true)
                  ->update([
                      'is_active' => false,
                  ]);

              $path = $this->storageService->store($user, $file);

              return $user->signatures()->create([
                  'public_id' => (string) Str::uuid(),
                  'disk' => 'private',
                  'path' => $path,
                  'user_id' => $user->id,
                  'is_active' => true,
              ]);
          });
      }

      public function delete(UserSignature $signature): void
      {
          DB::transaction(function () use ($signature) {

              $this->storageService->delete($signature->path);

              $signature->delete();
          });
      }
  }
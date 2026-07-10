<?php

namespace App\Services;

use App\Models\Accident;
use App\Models\AccidentEvidence;
use App\Models\User;
use App\Services\FileStorageService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\EvidenceResource;

class EvidenceService
{
    public function __construct(
        protected FileStorageService $storage
    ) {}

    /**
     * Upload multiple files.
     */
    public function upload(
        Accident $accident,
        array $files,
        ?string $description,
        User $user
    ) {

        $savedEvidence = [];

        $storedPaths = [];

        try {

            DB::beginTransaction();

            foreach ($files as $file) {

                $saved = $this->storeEvidence(

                    $accident,

                    $file,

                    $description,

                    $user
                );

                $savedEvidence[] = $saved;

                $storedPaths[] = $saved->file_path;
            }

            DB::commit();

            return $savedEvidence;

        } catch (\Throwable $e) {

            DB::rollBack();

            /**
             * Remove uploaded files
             */

            foreach ($storedPaths as $path) {

                $this->storage->delete($path);

            }

            throw $e;
        }
    }

    /**
     * Store one file.
     */
    protected function storeEvidence(
        Accident $accident,
        UploadedFile $file,
        ?string $description,
        User $user
    ): AccidentEvidence {

        $folder = sprintf(

            'accidents/%s/%s/accident_%d',

            now()->format('Y'),

            now()->format('m'),

            $accident->id
        );

        $stored = $this->storage->store(
            $file,
            $folder
        );

        return AccidentEvidence::create([

            'accident_id' => $accident->id,

            'original_name' => $stored['original_name'],

            'file_name' => $stored['file_name'],

            'file_path' => $stored['file_path'],

            'mime_type' => $stored['mime_type'],

            'file_size' => $stored['file_size'],

            'evidence_type' => $this->detectType(
                $stored['mime_type']
            ),

            'description' => $description,

            'uploaded_by' => $user->id,

        ]);
    }

    /**
     * List evidence.
     */
    public function list(
        Accident $accident
    ) {
        $evidence =  $accident
                    ->evidence()
                    ->with('uploader')
                    ->latest()
                    ->get();

        return EvidenceResource::collection($evidence);
    }

    /**
     * Delete evidence.
     */
    public function delete(
        AccidentEvidence $evidence
    ) {

        $this->storage
            ->delete($evidence->file_path);

        $evidence->delete();
    }

    /**
     * Download evidence.
     */
    public function download(AccidentEvidence $evidence, Accident $accident) {

        return $this->storage->download(

                $evidence->file_path,

                $evidence->original_name
            );
    }

    /**
     * Detect evidence type.
     */
    protected function detectType(string $mime ): string {

        if (str_starts_with($mime, 'image/')) {

            return 'PHOTO';

        }

        if (str_starts_with($mime, 'video/')) {

            return 'VIDEO';

        }

        if (
            str_contains($mime, 'pdf') ||
            str_contains($mime, 'word') ||
            str_contains($mime, 'document')
        ) {

            return 'DOCUMENT';

        }

        return 'OTHER';
    }
}
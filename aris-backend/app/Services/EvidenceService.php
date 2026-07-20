<?php

namespace App\Services;

use App\Models\Accident;
use App\Models\AccidentEvidence;
use App\Models\User;
use App\Models\FR1044;
use App\Services\FileStorageService;
use App\Services\AccidentTimelineService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\EvidenceResource;

class EvidenceService
{
    public function __construct(
        protected FileStorageService $storage,
        protected AccidentTimelineService $timelineService
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
                $saved = $this->storeEvidence($accident, $file, $description, $user);

                $savedEvidence[] = $saved;
                $storedPaths[] = $saved->file_path;
            }

            if ($accident->accidentCase) {
                $this->timelineService->create(
                    accidentCase: $accident->accidentCase,
                    user: $user,
                    action: 'EVIDENCE_UPLOADED',
                    description: count($savedEvidence) > 1
                        ? count($savedEvidence) . ' evidence files uploaded'
                        : "Evidence uploaded: {$savedEvidence[0]->original_name}",
                );
            }

            DB::commit();

            return $savedEvidence;

        } catch (\Throwable $e) {
            DB::rollBack();

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

        $stored = $this->storage->store($file, $folder);

        return AccidentEvidence::create([
            'accident_id' => $accident->id,
            'original_name' => $stored['original_name'],
            'file_name' => $stored['file_name'],
            'file_path' => $stored['file_path'],
            'mime_type' => $stored['mime_type'],
            'file_size' => $stored['file_size'],
            'evidence_type' => $this->detectType($stored['mime_type']),
            'description' => $description,
            'uploaded_by' => $user->id,
        ]);
    }

    /** Store an attachment for a draft FR1044 revision. */
    public function uploadForFR1044(FR1044 $fr1044, UploadedFile $file, string $fieldKey, ?string $description, User $user): AccidentEvidence
    {
        abort_unless($fr1044->created_by === $user->id, 403);
        abort_unless($fr1044->status === 'DRAFT', 400, 'Attachments can only be added to a draft FR1044 revision.');

        return DB::transaction(function () use ($fr1044, $file, $fieldKey, $description, $user) {
            $evidence = $this->storeEvidence($fr1044->accidentCase->accident, $file, $description, $user);
            $evidence->update([
                'document_type' => 'FR1044',
                'document_revision' => $fr1044->revision,
                'field_key' => $fieldKey,
            ]);

            $this->timelineService->createDocumentEvent(
                $fr1044->accidentCase,
                $user,
                'FR1044',
                'ATTACHMENT_UPLOADED',
                $fr1044->revision,
                $fr1044->reference_number,
            );

            return $evidence->fresh();
        });
    }

    /**
     * List evidence.
     */
    public function list(Accident $accident)
    {
        $evidence = $accident->evidence()
            ->with('uploader')
            ->latest()
            ->get();

        return EvidenceResource::collection($evidence);
    }

    /**
     * Delete evidence.
     */
    public function delete(AccidentEvidence $evidence)
    {
        $this->storage->delete($evidence->file_path);

        if ($evidence->accident?->accidentCase) {
            $this->timelineService->create(
                accidentCase: $evidence->accident->accidentCase,
                user: auth()->user(),
                action: 'EVIDENCE_DELETED',
                description: "Evidence deleted: {$evidence->original_name}",
            );
        }

        $evidence->delete();
    }

    /**
     * Download evidence.
     */
    public function download(AccidentEvidence $evidence, Accident $accident)
    {
        return $this->storage->download($evidence->file_path, $evidence->original_name);
    }

    /**
     * Detect evidence type.
     */
    protected function detectType(string $mime): string
    {
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

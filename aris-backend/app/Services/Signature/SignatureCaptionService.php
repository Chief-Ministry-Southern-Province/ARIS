<?php

declare(strict_types=1);

namespace App\Services\Signature;

use App\Models\User;
use App\Models\UserSignatureProfile;

final class SignatureCaptionService
{
    /** @return array{display_name: string, designation: ?string, institution_name: ?string, institution_lines: array<int, string>} */
    public function forUser(User $user): array
    {
        $user->loadMissing(['roles', 'institution', 'signatureProfile']);
        $profile = $user->signatureProfile;

        if ($profile !== null) {
            return $this->normalize([
                'display_name' => $profile->display_name,
                'designation' => $profile->designation,
                'institution_name' => $profile->institution_name,
                'institution_lines' => $profile->institution_lines,
            ]);
        }

        return $this->normalize([
            'display_name' => $user->name,
            'designation' => $user->roles->pluck('name')->map(
                fn (string $role): string => str_replace('_', ' ', $role)
            )->implode(', '),
            'institution_name' => $user->institution?->name,
            'institution_lines' => [],
        ]);
    }

    /** @param array<string, mixed> $attributes */
    public function save(User $user, array $attributes): array
    {
        $caption = $this->normalize($attributes);

        $user->signatureProfile()->updateOrCreate([], $caption);

        return $caption;
    }

    /** @param array<string, mixed> $caption */
    private function normalize(array $caption): array
    {
        $institutionLines = collect($caption['institution_lines'] ?? [])
            ->map(fn (mixed $line): string => trim((string) $line))
            ->filter()
            ->take(2)
            ->values()
            ->all();

        return [
            'display_name' => trim((string) ($caption['display_name'] ?? '')),
            'designation' => filled($caption['designation'] ?? null) ? trim((string) $caption['designation']) : null,
            'institution_name' => filled($caption['institution_name'] ?? null) ? trim((string) $caption['institution_name']) : null,
            'institution_lines' => $institutionLines,
        ];
    }
}

<?php

declare(strict_types=1);

namespace App\Services\PDF;

use Mpdf\Language\LanguageToFont;

final class ArisLanguageToFont extends LanguageToFont
{
    public function getLanguageOptions($llcc, $adobeCJK)
    {
        $language = strtolower(explode('-', $llcc)[0]);

        return match ($language) {
            'si', 'sin' => [false, 'notosanssinhala'],
            'ta', 'tam' => [false, 'notosanstamil'],
            default => parent::getLanguageOptions($llcc, $adobeCJK),
        };
    }
}

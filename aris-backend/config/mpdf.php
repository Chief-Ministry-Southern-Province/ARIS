<?php

declare(strict_types=1);

return [
    'mode' => 'utf-8',
    'format' => 'A4',
    'orientation' => 'P',
    // Keep the document geometry in one place. CSS @page rules are not used
    // because mPDF can reflow nested full-width page containers around them.
    'margin_left' => 13,
    'margin_right' => 13,
    'margin_top' => 12,
    'margin_bottom' => 12,
    'margin_header' => 0,
    'margin_footer' => 0,
    'temp_dir' => storage_path('app/mpdf'),
    'font_dir' => resource_path('fonts'),
    'default_font' => 'notosanssinhala',
    'font_data' => [
        'notosanssinhala' => [
            'R' => 'NotoSansSinhala-Regular.ttf',
            'B' => 'NotoSansSinhala-Bold.ttf',
            // Enable OpenType layout tables for Sinhala shaping and ligatures.
            'useOTL' => 0x80,
        ],
        'notosanstamil' => [
            'R' => 'NotoSansTamil-Regular.ttf',
            'B' => 'NotoSansTamil-Bold.ttf',
            // Tamil is a complex script and needs OpenType substitutions/positioning.
            'useOTL' => 0x80,
        ],
    ],
];

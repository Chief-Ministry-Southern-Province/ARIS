<?php

declare(strict_types=1);

return [
    'mode' => 'utf-8',
    'format' => 'A4',
    'orientation' => 'P',
    'margin_left' => 10,
    'margin_right' => 10,
    'margin_top' => 10,
    'margin_bottom' => 10,
    'margin_header' => 5,
    'margin_footer' => 5,
    'temp_dir' => storage_path('app/mpdf'),
    'font_dir' => resource_path('fonts'),
    'default_font' => 'notosanssinhala',
    'font_data' => [
        'notosanssinhala' => [
            'R' => 'NotoSansSinhala-Regular.ttf',
            'B' => 'NotoSansSinhala-Bold.ttf',
            // Enable OpenType layout tables for Sinhala shaping and ligatures.
            'useOTL' => 0xFF,
        ],
    ],
];

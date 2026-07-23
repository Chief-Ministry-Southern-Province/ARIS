<?php

declare(strict_types=1);

return [
    'mode' => 'utf-8',
    'format' => 'A4',
    'orientation' => 'P',
    // FR104(3) uses a fixed 200mm form area on A4 paper.
    'margin_left' => 5,
    'margin_right' => 5,
    'margin_top' => 10,
    'margin_bottom' => 10,
    'margin_header' => 5,
    'margin_footer' => 5,
    // Preserve a visible border when a long table flows onto the next page.
    'split_table_border_width' => 0.01,
    'temp_dir' => storage_path('app/mpdf'),
    'font_dir' => resource_path('fonts'),
    'default_font' => 'iskoolapota',
    'font_data' => [
        'iskoolapota' => [
            'R' => 'IskoolaPota.ttf',
            // Iskoola Pota is supplied by Windows as a single font face.
            // Reuse it when mPDF requests bold instead of falling back.
            'B' => 'IskoolaPota.ttf',
            'useOTL' => 0x80,
        ],
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

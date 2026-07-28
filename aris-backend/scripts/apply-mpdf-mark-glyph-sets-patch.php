<?php

declare(strict_types=1);

/*
 * mPDF 8.2.x parses MarkGlyphSets but aborts before its existing parsing code
 * can use them. Current Noto Sans Sinhala releases contain these lookups.
 * Keep this small compatibility patch reproducible after Composer installs.
 */
$basePath = dirname(__DIR__);

$patches = [
    $basePath.'/vendor/mpdf/mpdf/src/TTFontFile.php' => [
        'throw new \\Mpdf\\Exception\\FontException("Font \\\"" . $this->fontkey . "\\\" contains MarkGlyphSets which is not supported");',
    ],
    $basePath.'/vendor/mpdf/mpdf/src/Otl.php' => [
        'throw new \\Mpdf\\MpdfException("This font [" . $this->fontkey . "] contains MarkGlyphSets - Not tested yet");',
    ],
];

foreach ($patches as $path => $needles) {
    if (! is_file($path)) {
        throw new RuntimeException("mPDF patch target was not found: {$path}");
    }

    $contents = file_get_contents($path);

    foreach ($needles as $needle) {
        $contents = str_replace($needle, '', $contents);
    }

    file_put_contents($path, $contents);
}

echo "Applied mPDF MarkGlyphSets compatibility patch.\n";

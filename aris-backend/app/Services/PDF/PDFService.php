<?php

declare(strict_types=1);

namespace App\Services\PDF;

use Illuminate\Http\Response;
use Illuminate\Support\Facades\File;
use Mpdf\Config\ConfigVariables;
use Mpdf\Config\FontVariables;
use Mpdf\Mpdf;
use Mpdf\Output\Destination;

final class PDFService
{
    /**
     * Render a Blade view as a UTF-8 PDF string.
     *
     * @param  array<string, mixed>  $data
     * @param  array<string, mixed>  $options  mPDF options, plus optional HTML header/footer strings
     */
    public function generate(string $view, array $data = [], array $options = []): string
    {
        $mpdf = $this->makeMpdf($options);

        if (! empty($options['header'])) {
            $mpdf->SetHTMLHeader($options['header']);
        }

        if (! empty($options['footer'])) {
            $mpdf->SetHTMLFooter($options['footer']);
        }

        $mpdf->WriteHTML(view($view, $data)->render());

        return $mpdf->Output('', Destination::STRING_RETURN);
    }

    /**
     * @param  array<string, mixed>  $data
     * @param  array<string, mixed>  $options
     */
    public function download(string $view, array $data, string $filename, array $options = []): Response
    {
        return response($this->generate($view, $data, $options), 200, $this->headers($filename, 'attachment'));
    }

    /**
     * @param  array<string, mixed>  $data
     * @param  array<string, mixed>  $options
     */
    public function stream(string $view, array $data, string $filename, array $options = []): Response
    {
        return response($this->generate($view, $data, $options), 200, $this->headers($filename, 'inline'));
    }

    /** @param array<string, mixed> $options */
    private function makeMpdf(array $options): Mpdf
    {
        $tempDir = config('mpdf.temp_dir');

        File::ensureDirectoryExists($tempDir, 0755, true);

        $defaultConfig = (new ConfigVariables())->getDefaults();
        $defaultFontConfig = (new FontVariables())->getDefaults();

        $config = array_merge([
            'mode' => config('mpdf.mode'),
            'format' => config('mpdf.format'),
            'orientation' => config('mpdf.orientation'),
            'margin_left' => config('mpdf.margin_left'),
            'margin_right' => config('mpdf.margin_right'),
            'margin_top' => config('mpdf.margin_top'),
            'margin_bottom' => config('mpdf.margin_bottom'),
            'margin_header' => config('mpdf.margin_header'),
            'margin_footer' => config('mpdf.margin_footer'),
            'splitTableBorderWidth' => config('mpdf.split_table_border_width'),
            'tempDir' => $tempDir,
            'fontDir' => array_merge($defaultConfig['fontDir'], [config('mpdf.font_dir')]),
            'fontdata' => array_merge($defaultFontConfig['fontdata'], config('mpdf.font_data')),
            'default_font' => config('mpdf.default_font'),
            'autoScriptToLang' => true,
            'autoLangToFont' => true,
            'languageToFont' => new ArisLanguageToFont(),
        ], $this->renderingOptions($options));

        return new Mpdf($config);
    }

    /** @param array<string, mixed> $options @return array<string, mixed> */
    private function renderingOptions(array $options): array
    {
        unset($options['header'], $options['footer']);

        return $options;
    }

    /** @return array<string, string> */
    private function headers(string $filename, string $disposition): array
    {
        return [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => sprintf('%s; filename="%s"', $disposition, addcslashes($filename, "\\\"")),
        ];
    }
}

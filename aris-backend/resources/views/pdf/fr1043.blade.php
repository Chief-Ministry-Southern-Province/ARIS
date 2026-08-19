<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <style>
        * {
            box-sizing: border-box;
        }

        html,
        body {
            width: 210mm;
            margin: 0;
            padding: 0;
        }

        body,
        table,
        td,
        th,
        div,
        span {
            color: #000;
            font-family: iskoolapota, notosanstamil, sans-serif;
            font-size: 9.5pt;
            line-height: 1.12;
        }

        .page {
            width: 200mm;
            margin: 0;
            padding: 0;
        }

        .page-1 {
            page-break-after: always;
        }

        .page-2 {
            page-break-after: auto;
        }

        table {
            width: 100%;
            margin: 0;
            border-collapse: collapse;
            border-spacing: 0;
            table-layout: fixed;
            page-break-inside: avoid;
        }

        td,
        th {
            border: 0.25mm solid #000;
            padding: 1.5mm 2mm;
            vertical-align: top;
            overflow: hidden;
            overflow-wrap: break-word;
            word-wrap: break-word;
        }

        .no-border,
        .no-border td,
        .no-border th {
            border: 0;
        }

        .no-border td,
        .no-border th {
            padding: 0;
        }

        .compact {
            padding: 1mm 2mm;
        }

        .header-cell {
            padding: 1mm 1.5mm;
        }

        .table-header {
            font-size: 8.7pt;
            font-weight: bold;
            line-height: 1.05;
            text-align: center;
            vertical-align: middle;
        }

        .label-local {
            font-size: 8.5pt;
            line-height: 1.05;
        }

        [lang="ta"] {
            font-family: notosanstamil, sans-serif;
            font-size: 8.5pt;
            font-weight: normal !important;
        }

        .small {
            font-size: 7.8pt;
            line-height: 1.05;
        }

        .response {
            overflow: hidden;
            overflow-wrap: break-word;
            word-wrap: break-word;
            margin-top: 2mm;
            display: block;
        }

        .cell-content {
            overflow: hidden;
            margin-top: 2mm;
        }

        .page-break-avoid {
            page-break-inside: avoid;
        }

        /* Field title (Sinhala / Tamil / English) rendered at one uniform size,
           with a visible gap before the content that follows it. */
        .field-title {
            font-size: 8.5pt;
            line-height: 1.15;
            display: block;
            margin-bottom: 2mm;
        }

        .field-title span {
            font-size: 8.5pt;
        }

        .admin-cell {
            height: 14mm;
            padding: 0;
            text-align: right;
            vertical-align: top;
        }

        .admin-block {
            display: inline-block;
            width: 48mm;
            font-size: 7.8pt;
            line-height: 1.05;
            text-align: right;
        }

        .form-number {
            font-size: 9pt;
            font-weight: bold;
        }

        .title-cell {
            height: 22mm;
            padding: 0;
            text-align: center;
            vertical-align: middle;
        }

        .title-stack {
            width: 100%;
            height: 100%;
        }

        .title-stack td {
            border: 0;
            padding: 0;
            text-align: center;
            vertical-align: middle;
        }

        .title-si {
            font-family: iskoolapota, sans-serif;
            font-size: 24pt;
            font-weight: bold;
            line-height: 1.05;
        }

        .title-ta {
            font-size: 12pt;
            font-weight: normal;
            line-height: 1.2;
        }

        .title-en {
            font-size: 12pt;
            font-weight: bold;
            line-height: 1.2;
        }

        .reference-cell {
            font-size: 8.8pt;
            line-height: 1.05;
            text-align: left;
            vertical-align: middle;
        }

        .ministry-table td {
            border-left: 0;
            border-right: 0;
        }

        .ministry-line {
            height: 14mm;
        }

        .copy-line {
            height: 12mm;
        }

        .dotted-value {
            border-bottom: 0.25mm dotted #000;
        }

        .h-12 {
            height: 10mm;
        }

        .h-13 {
            height: 11mm;
        }

        .h-18 {
            height: 18mm;
        }

        .h-23 {
            height: 20mm;
        }

        .h-24 {
            height: 24mm;
        }

        .h-25 {
            height: 20mm;
        }

        .h-26 {
            height: 20mm;
        }

        .h-34 {
            height: 34mm;
        }

        .h-42 {
            height: 34mm;
        }

        .h-43 {
            height: 35mm;
        }

        .h-46 {
            height: 35mm;
        }

        .h-88 {
            height: 72mm;
        }

        .h-6 {
            height: 5mm;
        }

        .section-4-label {
            height: 7mm;
            overflow: hidden;
            margin-bottom: 1.5mm;
        }

        .section-4-response {
            height: 25mm;
            overflow: hidden;
        }

        .item-area {
            height: 65mm;
            padding: 2mm;
        }

        .repeating-item-row-cell {
            height: 13mm;
            padding: 1.2mm 2mm;
            vertical-align: top;
            line-height: 1.25;
            overflow: hidden;
        }

        .repeating-compact-row-cell {
            height: 5mm;
            padding: 0.8mm 2mm;
            vertical-align: top;
            line-height: 1.2;
            overflow: hidden;
        }

        .item-total-row {
            height: 7mm;
            font-size: 9pt;
            font-weight: bold;
            padding: 1.5mm 2mm;
        }

        .item-line {
            height: 6.5mm;
            overflow: hidden;
            line-height: 1.25;
        }

        .officer-line {
            height: 5.5mm;
            overflow: hidden;
            line-height: 1.15;
        }

        .writing-heading {
            height: 10mm;
            overflow: hidden;
            margin-bottom: 1.5mm;
        }

        .writing-heading-tall {
            height: 11mm;
            overflow: hidden;
            margin-bottom: 1.5mm;
        }

        .topic-separator {
            border-bottom: 0.25mm solid #000;
            padding-bottom: 1mm;
        }

        .field-topic-cell {
            padding: 1mm 2mm;
            vertical-align: top;
        }

        .field-content-cell {
            padding: 2mm;
            vertical-align: top;
            overflow: hidden;
            overflow-wrap: break-word;
            word-wrap: break-word;
        }

        .writing-response-30 {
            height: 21mm;
            overflow: hidden;
        }

        .writing-response-29 {
            height: 20mm;
            overflow: hidden;
        }

        .signature-area {
            height: 65mm;
        }

        .signature-image {
            width: 38mm;
            height: 12mm;
            object-fit: contain;
        }

        .signature-line {
            height: 12mm;
            border-bottom: 0.25mm dotted #000;
        }

        .signature-layout td {
            border: 0;
            padding: 0;
            vertical-align: top;
        }

        .signature-block {
            min-height: 19mm;
            padding-bottom: 3mm;
        }

        .signature-separator-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1mm 0 3mm;
        }

        .signature-separator-table td {
            border-top: 0.35mm solid #000 !important;
            height: 0;
            padding: 0;
        }

        .signature-row {
            width: 100%;
        }

        .signature-row td {
            border: 0;
            padding: 0;
            vertical-align: top;
        }

        .signature-date {
            font-size: 8.5pt;
            line-height: 1.15;
            text-align: left;
        }

        .signature-content {
            text-align: right;
        }

        .approval-signature-image {
            width: 32mm !important;
            height: 10mm !important;
            object-fit: contain;
        }

        .signature-grid {
            margin-top: 5mm;
        }

        .signature-grid>tbody>tr>td {
            padding: 0 2mm 2mm 0;
        }

        .signature-grid>tbody>tr>td:last-child {
            padding-right: 0;
        }

        .signature-grid-card {
            height: 24mm;
        }

        .signature-grid-card td {
            border: 0;
            padding: 0;
            vertical-align: top;
        }

        .signature-grid-comment {
            width: 48mm;
            height: 24mm;
            padding: 2mm 2mm 0 0 !important;
            font-size: 7.2pt;
            line-height: 1.08;
            text-align: left;
            vertical-align: middle !important;
        }

        .signature-grid-signature {
            width: 48mm;
            text-align: right;
        }

        .signature-grid-line {
            width: 48mm;
            min-height: 8mm;
            margin-left: auto;
            border-bottom: 0.25mm dotted #000;
        }

        .signature-grid-image {
            width: 25mm !important;
            height: 7mm !important;
            object-fit: contain;
        }

        .signature-grid-name,
        .signature-grid-label,
        .signature-grid-institution,
        .signature-grid-date {
            display: block;
            line-height: 1.05;
        }

        .signature-grid-name,
        .signature-grid-label,
        .signature-grid-institution {
            font-size: 8pt;
        }

        .signature-grid-date {
            margin-top: 0.5mm;
            font-size: 8pt;
            white-space: nowrap;
        }

        .signature-full-width {
            margin: 3mm 0 1mm;
        }

        .signature-full-card {
            height: 15mm;
        }

        .signature-full-card .signature-grid-comment {
            width: 105mm;
            height: 15mm;
        }

        .signature-full-card .signature-grid-signature {
            width: 91mm;
        }

        .signature-full-card .signature-grid-line {
            width: 70mm;
            min-height: 6mm;
        }

        .signature-full-card .signature-grid-image {
            width: 23mm !important;
            height: 6mm !important;
        }

        .signature-full-separator td {
            height: 1.5mm;
            padding: 0 !important;
            border-top: 0.35mm solid #000 !important;
        }

        .signature-ministry-grid {
            margin-top: 1mm;
            border-bottom: 0.35mm solid #000;
        }

        .signature-ministry-single {
            margin: 1mm 0 0;
        }

        .signature-card-institution {
            font-size: 9pt;
            font-weight: bold;
            line-height: 1.15;
        }

        .signature-card-name {
            font-size: 8.5pt;
            line-height: 1.15;
        }

        .signature-card-role {
            font-size: 8.5pt;
            line-height: 1.15;
        }

        .signature-card-date {
            font-size: 7.5pt;
            line-height: 1.15;
            white-space: nowrap;
        }

        .signature-label {
            font-size: 9pt;
            line-height: 1.12;
        }

        .signature-label-left {
            display: block !important;
            width: 100% !important;
            text-align: left !important;
        }

        .approval-signature-row {
            width: 100%;
        }

        .approval-signature-row td {
            border: 0;
            padding: 5mm 0 0;
            vertical-align: top;
        }

        /* --- Date / brace block (fixed alignment) ---
           Only the brace is vertically centered against the 3-line
           label stack. The labels and the date value are BOTTOM
           aligned, so "Date" and the dotted line share one baseline
           instead of the date text floating in the middle of a tall
           row, disconnected from its own line. */
        .approval-date-labels {
            width: 18mm;
            font-size: 8.5pt;
            line-height: 1.15;
            padding: 0 !important;
            vertical-align: bottom !important;
        }

        .approval-date-brace {
            width: 5mm;
            font-size: 25pt;
            line-height: 1;
            padding: 0 !important;
            vertical-align: middle !important;
            text-align: center;
        }

        .approval-date-value {
            width: 32mm;
            font-size: 8.5pt;
            padding: 0 0 0.3mm 2mm !important;
            vertical-align: bottom !important;
        }

        .approval-signature-content {
            text-align: right;
        }

        .approval-signature-comment {
            font-size: 8pt;
            line-height: 1.15;
            text-align: left;
            vertical-align: middle;
        }

        .approval-signature-line {
            width: 75mm;
            min-height: 12mm;
            margin-left: auto;
            border-bottom: 0.25mm dotted #000;
        }

        .approval-signature-image {
            width: 32mm !important;
            height: 10mm !important;
            object-fit: contain;
        }

        .footer-note {
            height: 3mm;
            font-size: 7.8pt;
            text-align: left;
            vertical-align: bottom;
        }
    </style>
</head>

<body>
    @php
        $documentData = data_get($document, 'data', []);
        $referenceNumber = data_get($document, 'reference_number', '');
        $text = static fn(mixed $value, int $limit): string => \Illuminate\Support\Str::limit(
            trim((string) $value),
            $limit,
            '...',
        );
        $signatureDate = static function (mixed $value): string {
            if ($value === null || $value === '') {
                return '';
            }

            try {
                return \Illuminate\Support\Carbon::parse($value)->toDateString();
            } catch (\Throwable) {
                return '';
            }
        };

        $items = collect(data_get($documentData, 'items', []))
            ->filter(static fn($item): bool => is_array($item) || is_object($item))
            ->values()
            ->take(5);
        $itemSlots = $items->pad(5, []);
        $number = static fn(mixed $value): float => (float) preg_replace('/[^0-9.\-]/', '', (string) $value ?: '0');
        $totalItemValue = $items->sum(static function ($item) use ($number): float {
            $quantity = $number(data_get($item, 'quantity', 1));

            return $number(data_get($item, 'value', 0)) * ($quantity > 0 ? $quantity : 1);
        });

        $officers = collect(data_get($documentData, 'officers', []))
            ->filter(static fn($officer): bool => is_array($officer) || is_object($officer))
            ->values()
            ->take(4);
        $officerSlots = $officers
            ->map(static function ($officer): array {
                $designation =
                    is_object($officer) && method_exists($officer, 'getRoleNames')
                        ? $officer->getRoleNames()->implode(', ')
                        : data_get($officer, 'designation', data_get($officer, 'roles', ''));

                return ['officer' => $officer, 'designation' => $designation];
            })
            ->pad(4, ['officer' => [], 'designation' => '']);
    @endphp

    <div class="page page-1">

        <table class="no-border page-break-avoid">
            <tr>
                <td class="admin-cell">
                    <div class="admin-block">
                        <span lang="si">පොදු</span> / <span lang="ta">பொது</span> / General
                        <span class="form-number">283</span><br>
                        (F2* S., T. &amp; E.) 12/76<br>
                        (A4* S., T. &amp; E. 06/2023 - Amended)
                    </div>
                </td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="title-cell" style="width: 150mm;">
                    <table class="no-border title-stack">
                        <tr>
                            <td class="title-si"
                                style="font-family: iskoolapota, sans-serif !important; font-size: 32pt !important; line-height: 0.9 !important;">
                                මූ. රෙ. 104 (3) යටතේ අලාභයන් පිළිබඳ ප්‍රාථමික වාර්තාව</td>
                        </tr>
                        <tr>
                            <td class="title-ta" lang="ta"
                                style="font-family: notosanstamil, sans-serif; font-size: 12pt; line-height: 1.1;">
                                நி.பி. 104 (3) இன் கீழ் இழப்புகள் பற்றிய தொடக்க அறிக்கை</td>
                        </tr>
                        <tr>
                            <td class="title-en" style="font-size: 12pt; line-height: 1.1;">PRELIMINARY REPORT OF LOSSES
                                UNDER F. R. 104 (3)</td>
                        </tr>
                    </table>
                </td>
                <td class="reference-cell" style="width: 50mm;">
                    <div class="field-title">
                        <span class="label-local" lang="si">යොමු අංක</span> /
                        <span class="label-local" lang="ta">தொடர் இல.</span> /
                        <span class="label-local">Ref. No.</span>
                    </div>
                    <span class="dotted-value">{{ $text($referenceNumber, 30) }}</span>
                </td>
            </tr>
        </table>

        <table class="ministry-table page-break-avoid">
            <tr>
                <td class="ministry-line compact">
                    <table class="no-border" style="width: 100%;">
                        <tr>
                            <td rowspan="2" style="width: 160mm; vertical-align: middle;">
                                <span class="label-local">Secretary to the Ministry of</span>&nbsp;<span
                                    class="label-local">............................</span>&nbsp;<span
                                    class="label-local" lang="si">ප්‍රධාන</span>&nbsp;<span
                                    class="label-local">............................</span>
                            </td>
                            <td rowspan="2"
                                style="width: 5mm; font-size: 18pt; line-height: 0.8; text-align: center; vertical-align: middle;">
                                {</td>
                            <td style="width: 35mm; vertical-align: bottom;"><span class="label-local"
                                    lang="si">අමාත්‍යාංශයේ ලේකම්</span></td>
                        </tr>
                        <tr>
                            <td style="width: 35mm; vertical-align: top;"><span class="label-local"
                                    lang="ta">அமைச்சின் செயலாளருக்கு</span></td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td class="copy-line compact">
                    <span class="label-local" lang="si">පිටපත: විගණකාධිපති</span><br>
                    <span class="label-local" lang="ta">பிரதி: கணக்காய்வு அதிபதி</span><br>
                    <span class="label-local">Copy to : Auditor- General</span>
                </td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="h-12 compact" style="width: 57mm;">
                    <div class="field-title">
                        <span class="label-local" lang="si">1. දෙපාර්තමේන්තුව / සංස්ථාව</span><br>
                        <span class="label-local" lang="ta">திணைக்களம்/கூட்டுத்தாபனம்</span><br>
                        <span class="label-local">Department / Corporation</span>
                    </div>
                </td>
                <td class="h-12 response" style="width: 143mm;">
                    {{ $text(data_get($documentData, 'department', ''), 180) }}</td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="field-topic-cell" rowspan="2" style="width: 76mm; height: 31mm; vertical-align: middle;">
                    <span class="label-local" lang="si">2. අලාභය</span><br>
                    <span class="label-local" lang="ta">இழப்பு</span><br>
                    <span class="label-local">Loss</span>
                </td>
                <td class="field-topic-cell" style="width: 45mm; height: 11mm; text-align: center;"><span
                        class="label-local" lang="si">දිනය</span> / <span class="label-local"
                        lang="ta">திகதி</span> / <span class="label-local">Date</span></td>
                <td class="field-topic-cell" style="width: 79mm; height: 11mm; text-align: center;"><span
                        class="label-local" lang="si">ස්ථානය</span> / <span class="label-local"
                        lang="ta">இடம்</span> / <span class="label-local">Place</span></td>
            </tr>
            <tr>
                <td class="field-content-cell" style="width: 45mm; height: 20mm; text-align: center;">
                    {{ $text(data_get($documentData, 'date', ''), 30) }}</td>
                <td class="field-content-cell" style="width: 79mm; height: 20mm;">
                    {{ $text(data_get($documentData, 'place', ''), 100) }}</td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="h-26 compact" style="width: 44mm;">
                    <div class="field-title">
                        <span class="label-local" lang="si">3. අලාභයේ ස්වභාවය</span><br>
                        <span class="label-local" lang="ta">இழப்பின் தன்மை</span><br>
                        <span class="label-local">Nature of Loss</span>
                    </div>
                </td>
                <td class="h-26 response" style="width: 156mm;">
                    {{ $text(data_get($documentData, 'natureOfLoss', ''), 180) }}
                </td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <th class="h-13 table-header header-cell" style="width: 77mm;">
                    <span lang="si">අහිමි වූ භාණ්ඩවල විස්තරය</span><br>
                    <span lang="ta">இழந்த பொருட்களின் விவரணம்</span><br>
                    Description of items lost
                </th>
                <th class="h-13 table-header header-cell" style="width: 45mm;">
                    <span lang="si">ප්‍රමාණය</span><br>
                    <span lang="ta">தொகை</span><br>
                    Quantity
                </th>
                <th class="h-13 table-header header-cell" style="width: 42mm;">
                    <span lang="si">මිනුම් ඒකක</span><br>
                    <span lang="ta">அளவுக்கூறு</span><br>
                    Units of Measure
                </th>
                <th class="h-13 table-header header-cell" style="width: 36mm;">
                    <span lang="si">වටිනාකම</span><br>
                    <span lang="ta">பெறுமதி</span><br>
                    Value
                </th>
            </tr>
            @foreach ($itemSlots as $item)
                <tr>
                    <td class="repeating-item-row-cell" style="width: 77mm;">{{ $text(data_get($item, 'description', ''), 90) }}</td>
                    <td class="repeating-item-row-cell" style="width: 45mm; text-align: center;">{{ $text(data_get($item, 'quantity', ''), 20) }}</td>
                    <td class="repeating-item-row-cell" style="width: 42mm; text-align: center;">{{ $text(data_get($item, 'unitOfMeasure', data_get($item, 'unit', '')), 25) }}</td>
                    <td class="repeating-item-row-cell" style="width: 36mm; text-align: right;">{{ $text(data_get($item, 'value', ''), 25) }}</td>
                </tr>
            @endforeach
            <tr>
                <td colspan="3" class="item-total-row" style="text-align: right;">
                    <span lang="si">මුළු වටිනාකම</span> / <span lang="ta">மொத்தப் பெறுமதி</span> / Total
                    Value
                </td>
                <td class="item-total-row" style="text-align: right;">
                    {{ number_format($totalItemValue, 2) }}
                </td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="field-topic-cell" style="height: 8mm;"><span class="label-local" lang="si">4. අලාභයට
                        හේතුව</span> / <span class="label-local" lang="ta">இழப்புக்குக் காரணம்</span> / <span
                        class="label-local">Cause of Loss</span></td>
            </tr>
            <tr>
                <td class="field-content-cell" style="height: 27mm;">
                    {{ $text(data_get($documentData, 'causeOfLoss', ''), 300) }}</td>
            </tr>
        </table>

    </div>

    <div class="page page-2">

        <table class="page-break-avoid">
            <tr>
                <td class="compact" colspan="2">
                    <span lang="si">5. වගකිවයුතු නිලධාරින්/</span> <span lang="ta">பொறுப்பான
                        உத்தியோகத்தர்/</span> Officers responsible -
                </td>
            </tr>
            <tr>
                <td class="compact" style="width: 100mm; text-align: center; vertical-align: middle;">
                    <span lang="si">නම</span>/<span lang="ta">பெயர்</span>/Name
                </td>
                <td class="compact" style="width: 100mm; text-align: center; vertical-align: middle;">
                    <span lang="si">තනතුර</span>/<span lang="ta">பதவிப்பெயர்</span>/Designation
                </td>
            </tr>
            @foreach ($officerSlots as $officerSlot)
                <tr>
                    <td class="repeating-compact-row-cell response" style="width: 100mm;">{{ $text(data_get($officerSlot, 'officer.name', ''), 70) }}</td>
                    <td class="repeating-compact-row-cell response" style="width: 100mm;">{{ $text(data_get($officerSlot, 'designation', ''), 70) }}</td>
                </tr>
            @endforeach
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="compact" style="width: 100mm; text-align: center; vertical-align: middle;">
                    <span lang="si">6. පොලිස් ස්ථානයේ නම</span>/<span lang="ta">பொலிஸ் நிலையத்தின்
                        பெயர்</span>/<br>
                    Name of Police Station
                </td>
                <td class="compact" style="width: 100mm; text-align: center; vertical-align: middle;">
                    <span lang="si">පොලිසියට දැනුම් දුන් දිනය</span>/<span lang="ta">பொலிசுக்கு அறிவித்த
                        தேதி</span><br>
                    Date of reporting to Police
                </td>
            </tr>
            <tr>
                <td class="h-12 response" style="width: 100mm;">
                    {{ $text(data_get($documentData, 'policeStation', ''), 110) }}
                </td>
                <td class="h-12 response" style="width: 100mm;">
                    {{ $text(data_get($documentData, 'policeReportDate', ''), 35) }}
                </td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="field-topic-cell" style="height: 11mm;"><span class="label-local" lang="si">7.
                        පවත්වාගෙන යනු ලබන පරීක්ෂණයේ ස්වභාවය :</span><br><span class="label-local"
                        lang="ta">நடைபெறும் விசாரணையின் தன்மை :</span><br><span class="label-local">Nature of
                        Investigation being carried out :</span></td>
            </tr>
            <tr>
                <td class="field-content-cell" style="height: 23mm;">
                    {{ $text(data_get($documentData, 'investigation', ''), 280) }}</td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="field-topic-cell" style="height: 12mm;"><span class="label-local" lang="si">8.
                        පොත්පත් වාර්තා ආදියේ ආරක්ෂාව සඳහා යොදන ලද විධිවිධාන :</span><br><span class="label-local"
                        lang="ta">புத்தகங்கள், பதிவேடுகள் முதலியவற்றின் பாதுகாப்புக்கு எடுத்துள்ள ஒழுங்குகள்
                        :</span><br><span class="label-local">Arrangements made for the security of the books, records,
                        etc :</span></td>
            </tr>
            <tr>
                <td class="field-content-cell" style="height: 23mm;">
                    {{ $text(data_get($documentData, 'securityArrangements', ''), 320) }}</td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="field-topic-cell" style="height: 12mm;"><span class="label-local" lang="si">9.
                        මෙවැනි අලාභයන් වැළැක්වීම සඳහා යොදා ඇති විධිවිධාන :</span><br><span class="label-local"
                        lang="ta">மேலும் இழப்புக்கள் ஏற்படாமல் தடுப்பதற்கு எடுத்துள்ள ஒழுங்குகள் :</span><br><span
                        class="label-local">Arrangements made for the prevention of further losses :</span></td>
            </tr>
            <tr>
                <td class="field-content-cell" style="height: 23mm;">
                    {{ $text(data_get($documentData, 'preventionArrangements', ''), 320) }}</td>
            </tr>
        </table>

        @php
            $signatureRows = [
                [
                    'signature' => $msRdSignature,
                    'label' => 'MS/RD',
                    'always_show' => false,
                    'show_institution' => true,
                    'label_alignment' => 'left',
                ],
                [
                    'signature' => $pdhsSignature,
                    'label' => 'පළාත් සෞඛ්‍යය සේවා අධ්‍යක්ෂක,',
                    'secondary_label' => 'දකුණු පළාත.',
                    'always_show' => true,
                    'show_institution' => true,
                    'label_alignment' => 'left',
                ],
                [
                    'signature' => $secretarySignature,
                    'label' => 'ලේකම්,',
                    'secondary_label' => 'ප්‍රධාන අමාත්‍යාංශය,',
                    'tertiary_label' => 'දකුණු පළාත.',
                    'always_show' => true,
                    'show_institution' => true,
                    'label_alignment' => 'left',
                ],
                [
                    'signature' => $chiefSecretarySignature,
                    'label' => 'Chief Secretary',
                    'secondary_label' => 'දකුණු පළාත.',
                    'always_show' => true,
                    'show_institution' => true,
                    'label_alignment' => 'left',
                ],
            ];
        @endphp

        @php
            $localSignatureRows = collect([$signatureRows[0], $signatureRows[1]])
                ->filter(
                    fn(array $signatureRow): bool => $signatureRow['always_show'] ||
                        data_get($signatureRow['signature'], 'signature_data_uri'),
                )
                ->values();
            $ministrySignatureRows = collect([$signatureRows[2], $signatureRows[3]])
                ->filter(
                    fn(array $signatureRow): bool => $signatureRow['always_show'] ||
                        data_get($signatureRow['signature'], 'signature_data_uri'),
                )
                ->values();
        @endphp

        <table class="no-border signature-full-width page-break-avoid">
            @foreach ($localSignatureRows as $signatureRow)
                <tr>
                    <td style="width: 200mm;">
                        <table class="no-border signature-grid-card signature-full-card">
                            <tr>
                                <td class="signature-grid-comment">
                                    {{ $text(data_get($signatureRow['signature'], 'comments', ''), 110) }}
                                </td>
                                <td class="signature-grid-signature">
                                    <div class="signature-grid-line">
                                        @if (data_get($signatureRow['signature'], 'signature_data_uri'))
                                            <img class="signature-grid-image" src="{{ data_get($signatureRow['signature'], 'signature_data_uri') }}" alt="{{ $text($signatureRow['label'], 45) }} signature">
                                        @endif
                                    </div>
                                    <div class="signature-grid-name">{{ $text(data_get($signatureRow['signature'], 'name', ''), 45) }}</div>
                                    <div class="signature-grid-label">{{ $text(data_get($signatureRow['signature'], 'role') ?: $signatureRow['label'], 45) }}</div>
                                    @if ($signatureRow['show_institution'] ?? true)
                                        <div class="signature-grid-institution">{{ data_get($signatureRow['signature'], 'institution', '') }}</div>
                                    @endif
                                    @if (data_get($signatureRow['signature'], 'signature_data_uri'))
                                        <div class="signature-grid-date"><span lang="si">&#x0DAF;&#x0DD2;&#x0DB1;&#x0DBA;</span> / <span lang="ta">&#x0BA4;&#x0BBF;&#x0B95;&#x0BA4;&#x0BBF;</span> / Date / {{ $signatureDate(data_get($signatureRow['signature'], 'approved_at')) }}</div>
                                    @endif
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr class="signature-full-separator">
                    <td style="width: 200mm;">&nbsp;</td>
                </tr>
            @endforeach
        </table>

        @foreach ($ministrySignatureRows as $signatureRow)
            <table class="no-border signature-full-width signature-ministry-single page-break-avoid">
                <tr>
                    <td style="width: 200mm;">
                        <table class="no-border signature-grid-card signature-full-card">
                            <tr>
                                <td class="signature-grid-comment">
                                    {{ $text(data_get($signatureRow['signature'], 'comments', ''), 110) }}
                                </td>
                                <td class="signature-grid-signature">
                                    <div class="signature-grid-line">
                                        @if (data_get($signatureRow['signature'], 'signature_data_uri'))
                                            <img class="signature-grid-image" src="{{ data_get($signatureRow['signature'], 'signature_data_uri') }}" alt="{{ $text($signatureRow['label'], 45) }} signature">
                                        @endif
                                    </div>
                                    <div class="signature-grid-name">{{ $text(data_get($signatureRow['signature'], 'name', ''), 45) }}</div>
                                    <div class="signature-grid-label">{{ $text(data_get($signatureRow['signature'], 'role') ?: $signatureRow['label'], 45) }}</div>
                                    @if ($signatureRow['show_institution'] ?? true)
                                        <div class="signature-grid-institution">{{ data_get($signatureRow['signature'], 'institution', '') }}</div>
                                    @endif
                                    @if (data_get($signatureRow['signature'], 'signature_data_uri'))
                                        <div class="signature-grid-date"><span lang="si">&#x0DAF;&#x0DD2;&#x0DB1;&#x0DBA;</span> / <span lang="ta">&#x0BA4;&#x0BBF;&#x0B95;&#x0BA4;&#x0BBF;</span> / Date / {{ $signatureDate(data_get($signatureRow['signature'], 'approved_at')) }}</div>
                                    @endif
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                @if (! $loop->last)
                    <tr class="signature-full-separator">
                        <td style="width: 200mm;">&nbsp;</td>
                    </tr>
                @endif
            </table>
        @endforeach

    </div>
</body>

</html>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <style>
        * {
            box-sizing: border-box;
        }

        html, body {
            width: 210mm;
            margin: 0;
            padding: 0;
        }

        body, table, td, th, div, span {
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

        td, th {
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
            height: 20mm;
            text-align: center;
            vertical-align: middle;
        }

        .title-si {
            font-size: 13pt;
            font-weight: bold;
            line-height: 1.2;
        }

        .title-ta {
            font-size: 13pt;
            font-weight: normal;
            line-height: 1.2;
        }

        .title-en {
            font-size: 13pt;
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
            height: 10mm;
        }

        .dotted-value {
            border-bottom: 0.25mm dotted #000;
        }

        .h-12 { height: 10mm; }
        .h-13 { height: 11mm; }
        .h-18 { height: 18mm; }
        .h-23 { height: 20mm; }
        .h-24 { height: 24mm; }
        .h-25 { height: 20mm; }
        .h-26 { height: 20mm; }
        .h-34 { height: 34mm; }
        .h-42 { height: 34mm; }
        .h-43 { height: 35mm; }
        .h-46 { height: 35mm; }
        .h-88 { height: 72mm; }
        .h-6  { height: 5mm; }

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
            width: 46mm;
            height: 12mm;
            object-fit: contain;
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

        .signature-card-role,
        .signature-card-date {
            font-size: 8.5pt;
            line-height: 1.15;
        }

        .signature-label {
            font-size: 9pt;
            line-height: 1.12;
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
        $text = static fn (mixed $value, int $limit): string => \Illuminate\Support\Str::limit(trim((string) $value), $limit, '...');

        $items = collect(data_get($documentData, 'items', []))
            ->filter(static fn ($item): bool => is_array($item) || is_object($item))
            ->values()
            ->take(5);
        $itemSlots = $items->pad(5, []);
        $number = static fn (mixed $value): float => (float) preg_replace('/[^0-9.\-]/', '', (string) $value ?: '0');
        $totalItemValue = $items->sum(static function ($item) use ($number): float {
            $quantity = $number(data_get($item, 'quantity', 1));

            return $number(data_get($item, 'value', 0)) * ($quantity > 0 ? $quantity : 1);
        });

        $officers = collect(data_get($documentData, 'officers', []))
            ->filter(static fn ($officer): bool => is_array($officer) || is_object($officer))
            ->values()
            ->take(4);
        $officerSlots = $officers
            ->map(static function ($officer): array {
                $designation = is_object($officer) && method_exists($officer, 'getRoleNames')
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
                        <span class="form-number"> - 283</span><br>
                        (F2* S., T. &amp; E.) 12/76<br>
                        (A4* S., T. &amp; E. 06/2023 - Amended)
                    </div>
                </td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="title-cell" style="width: 150mm;">
                    <span class="title-si" lang="si">මූ. රෙ. 104 (3) යටතේ අලාභයන් පිළිබඳ ප්‍රාථමික වාර්තාව</span><br>
                    <span class="title-ta" lang="ta">நி.பி. 104 (3) இன் கீழ் இழப்புகள் பற்றிய தொடக்க அறிக்கை</span><br>
                    <span class="title-en">PRELIMINARY REPORT OF LOSSES UNDER F.R. 104 (3)</span>
                </td>
                <td class="reference-cell" style="width: 50mm;">
                    <div class="field-title">
                        <span class="label-local" lang="si">යොමු අංකය</span> /
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
                    <span class="label-local" lang="si">අමාත්‍යාංශයේ ලේකම්</span> /
                    <span class="label-local" lang="ta">அமைச்சின் செயலாளர்</span> /
                    <span class="label-local">Secretary to the Ministry of</span>&nbsp;&nbsp;<span class="dotted-value">{{ $text(data_get($documentData, 'secretaryOfMinistry', ''), 50) }}</span>
                </td>
            </tr>
            <tr>
                <td class="copy-line compact">
                    <span class="label-local" lang="si">පිටපත: විගණකාධිපති</span> /
                    <span class="label-local" lang="ta">பிரதி: கணக்காய்வாளர் தலைமை அதிபதி</span> /
                    <span class="label-local">Copy to: Auditor-General</span>
                </td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="h-12 compact" style="width: 57mm;">
                    <div class="field-title">
                        <span class="label-local" lang="si">1. දෙපාර්තමේන්තුව / සංස්ථාව</span><br>
                        <span class="label-local" lang="ta">1. திணைக்களம் / கூட்டுத்தாபனம்</span><br>
                        <span class="label-local">Department / Corporation</span>
                    </div>
                </td>
                <td class="h-12 response" style="width: 143mm;">{{ $text(data_get($documentData, 'department', ''), 180) }}</td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="field-topic-cell" rowspan="2" style="width: 76mm; height: 31mm; vertical-align: middle;">
                    <span class="label-local" lang="si">2. අලාභය</span><br>
                    <span class="label-local" lang="ta">2. இழப்பு</span><br>
                    <span class="label-local">2. Loss</span>
                </td>
                <td class="field-topic-cell" style="width: 45mm; height: 11mm; text-align: center;"><span class="label-local" lang="si">දිනය</span> / <span class="label-local" lang="ta">திகதி</span> / <span class="label-local">Date</span></td>
                <td class="field-topic-cell" style="width: 79mm; height: 11mm; text-align: center;"><span class="label-local" lang="si">ස්ථානය</span> / <span class="label-local" lang="ta">இடம்</span> / <span class="label-local">Place</span></td>
            </tr>
            <tr>
                <td class="field-content-cell" style="width: 45mm; height: 20mm; text-align: center;">{{ $text(data_get($documentData, 'date', ''), 30) }}</td>
                <td class="field-content-cell" style="width: 79mm; height: 20mm;">{{ $text(data_get($documentData, 'place', ''), 100) }}</td>
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
                    <span lang="ta">இழந்த பொருட்களின் விபரம்</span><br>
                    Description of items lost
                </th>
                <th class="h-13 table-header header-cell" style="width: 45mm;">
                    <span lang="si">ප්‍රමාණය</span><br>
                    <span lang="ta">அளவு</span><br>
                    Quantity
                </th>
                <th class="h-13 table-header header-cell" style="width: 42mm;">
                    <span lang="si">මිනුම් ඒකක</span><br>
                    <span lang="ta">அளவீட்டு அலகு</span><br>
                    Units of Measure
                </th>
                <th class="h-13 table-header header-cell" style="width: 36mm;">
                    <span lang="si">වටිනාකම</span><br>
                    <span lang="ta">பெறுமதி</span><br>
                    Value
                </th>
            </tr>
            <tr>
                <td class="item-area" style="width: 77mm;">
                    @foreach ($itemSlots as $item)
                        <div class="item-line">{{ $text(data_get($item, 'description', ''), 90) }}</div>
                    @endforeach
                </td>
                <td class="item-area" style="width: 45mm; text-align: center;">
                    @foreach ($itemSlots as $item)
                        <div class="item-line">{{ $text(data_get($item, 'quantity', ''), 20) }}</div>
                    @endforeach
                </td>
                <td class="item-area" style="width: 42mm; text-align: center;">
                    @foreach ($itemSlots as $item)
                        <div class="item-line">{{ $text(data_get($item, 'unitOfMeasure', data_get($item, 'unit', '')), 25) }}</div>
                    @endforeach
                </td>
                <td class="item-area" style="width: 36mm; text-align: right;">
                    @foreach ($itemSlots as $item)
                        <div class="item-line">{{ $text(data_get($item, 'value', ''), 25) }}</div>
                    @endforeach
                </td>
            </tr>
            <tr>
                <td colspan="3" class="item-total-row" style="text-align: right;">
                    <span lang="si">මුළු වටිනාකම</span> / <span lang="ta">மொத்தப் பெறுமதி</span> / Total Value
                </td>
                <td class="item-total-row" style="text-align: right;">
                    {{ number_format($totalItemValue, 2) }}
                </td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="field-topic-cell" style="height: 8mm;"><span class="label-local" lang="si">4. අලාභයට හේතුව</span> / <span class="label-local" lang="ta">இழப்பிற்கான காரணம்</span> / <span class="label-local">Cause of Loss</span></td>
            </tr>
            <tr>
                <td class="field-content-cell" style="height: 27mm;">{{ $text(data_get($documentData, 'causeOfLoss', ''), 300) }}</td>
            </tr>
        </table>

    </div>

    <div class="page page-2">

        <table class="page-break-avoid">
            <tr>
                <th class="h-12 table-header header-cell" style="width: 100mm;">
                    <span lang="si">5. වගකිවයුතු නිලධාරීන්ගේ නම</span><br>
                    <span lang="ta">   பொறுப்பான அலுவலர்களின் பெயர்</span><br>
                    Name
                </th>
                <th class="h-12 table-header header-cell" style="width: 100mm;">
                    <span lang="si">තනතුර</span><br>
                    <span lang="ta">பதவி</span><br>
                    Designation
                </th>
            </tr>
            <tr>
                <td class="h-23 response" style="width: 100mm;">
                    @foreach ($officerSlots as $officerSlot)
                        <div class="officer-line">{{ $text(data_get($officerSlot, 'officer.name', ''), 70) }}</div>
                    @endforeach
                </td>
                <td class="h-23 response" style="width: 100mm;">
                    @foreach ($officerSlots as $officerSlot)
                        <div class="officer-line">{{ $text(data_get($officerSlot, 'designation', ''), 70) }}</div>
                    @endforeach
                </td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <th class="h-13 table-header header-cell" style="width: 100mm;">
                    <span lang="si">6. පොලිස් ස්ථානයේ නම</span><br>
                    <span lang="ta">පொலிஸ் நிலையத்தின் பெயர்</span><br>
                    Name of Police Station
                </th>
                <th class="h-13 table-header header-cell" style="width: 100mm;">
                    <span lang="si">පොලිසියට වාර්තා කළ දිනය</span><br>
                    <span lang="ta">பொலிஸாருக்கு அறிவித்த திகதி</span><br>
                    Date reported to Police
                </th>
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
                <td class="field-topic-cell" style="height: 11mm;"><span class="label-local" lang="si">7. සිදු කරනු ලබන විමර්ශනයේ ස්වභාවය</span><br><span class="label-local" lang="ta">மேற்கொள்ளப்படும் விசாரணையின் தன்மை</span><br><span class="label-local">Nature of Investigation being carried out</span></td>
            </tr>
            <tr>
                <td class="field-content-cell" style="height: 23mm;">{{ $text(data_get($documentData, 'investigation', ''), 280) }}</td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="field-topic-cell" style="height: 12mm;"><span class="label-local" lang="si">8. පොත්පත්, වාර්තා ආදියෙහි ආරක්ෂාව සඳහා කරන ලද විධිවිධාන</span><br><span class="label-local" lang="ta">புத்தகங்கள், பதிவேடுகள் முதலியவற்றின் பாதுகாப்பிற்காக செய்யப்பட்ட ஏற்பாடுகள்</span><br><span class="label-local">Arrangements made for the security of books, records, etc.</span></td>
            </tr>
            <tr>
                <td class="field-content-cell" style="height: 23mm;">{{ $text(data_get($documentData, 'securityArrangements', ''), 320) }}</td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="field-topic-cell" style="height: 12mm;"><span class="label-local" lang="si">9. තවදුරටත් අලාභ සිදුවීම වැළැක්වීම සඳහා කරන ලද විධිවිධාන</span><br><span class="label-local" lang="ta">மேலும் இழப்புகள் ஏற்படுவதைத் தடுப்பதற்காக செய்யப்பட்ட ஏற்பாடுகள்</span><br><span class="label-local">Arrangements made for prevention of further losses</span></td>
            </tr>
            <tr>
                <td class="field-content-cell" style="height: 23mm;">{{ $text(data_get($documentData, 'preventionArrangements', ''), 320) }}</td>
            </tr>
        </table>

        @php
            $signatureRows = [
                ['signature' => $headSignature, 'label' => 'Head of Department / Chairman of Corporation', 'always_show' => true],
                ['signature' => $pdhsSignature, 'label' => 'Provincial Director of Health Services', 'always_show' => false],
                ['signature' => $secretarySignature, 'label' => 'Secretary to the Ministry of ' . $text(data_get($documentData, 'secretaryOfMinistry', ''), 45), 'always_show' => true],
                ['signature' => $chiefSecretarySignature, 'label' => 'Chief Secretary', 'always_show' => false],
            ];
        @endphp

        <table class="no-border signature-layout page-break-avoid" style="margin-top: 12mm;">
            <tr>
                <td style="width: 200mm;">
                    @foreach ($signatureRows as $signatureRow)
                        @if ($signatureRow['always_show'] || data_get($signatureRow['signature'], 'signature_data_uri'))
                            <div class="signature-block">
                                <table class="no-border signature-row">
                                    <tr>
                                        <td class="signature-date" style="width: 45mm;">
                                            <span lang="si">දිනය</span><br>
                                            <span lang="ta">திகதி</span><br>
                                            Date<br>
                                            {{ $text(data_get($signatureRow['signature'], 'approved_at', ''), 30) }}
                                        </td>
                                        <td class="signature-content" style="width: 155mm;">
                                            @if (data_get($signatureRow['signature'], 'signature_data_uri'))
                                                <img class="approval-signature-image" src="{{ data_get($signatureRow['signature'], 'signature_data_uri') }}" alt="{{ $text($signatureRow['label'], 50) }} signature"><br>
                                            @else
                                                <div class="signature-line" style="width: 65mm; margin-left: auto;"></div>
                                            @endif
                                            <span class="signature-card-name">{{ $text(data_get($signatureRow['signature'], 'name', ''), 55) }}</span><br>
                                            <span class="signature-card-institution">{{ $text(data_get($signatureRow['signature'], 'institution', ''), 55) }}</span><br>
                                            <span class="signature-label">{{ $signatureRow['label'] }}</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <table class="signature-separator-table" style="width: 200mm;">
                                <tr><td style="width: 200mm;">&nbsp;</td></tr>
                            </table>
                        @endif
                    @endforeach
                </td>
            </tr>
        </table>

    </div>
</body>
</html>

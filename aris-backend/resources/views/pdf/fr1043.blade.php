<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <style>
        * { box-sizing: border-box; }

        html, body {
            width: 210mm;
            margin: 0;
            padding: 0;
        }

        body, table, td, th, div, span {
            color: #000;
            font-family: iskoolapota, notosanssinhala, notosanstamil, dejavusans, sans-serif;
            font-size: 9.5pt;
            line-height: 1.12;
        }

        .page {
            width: 200mm;
            margin: 0;
            padding: 0;
        }

        .page-1 { page-break-after: always; }
        .page-2 { page-break-after: auto; }

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

        .no-border, .no-border td, .no-border th { border: 0; }
        .no-border td, .no-border th { padding: 0; }
        .compact { padding: 1mm 2mm; }
        .header-cell { padding: 1mm 1.5mm; }
        .table-header { font-size: 8.7pt; font-weight: bold; line-height: 1.05; text-align: center; vertical-align: middle; }
        .label-local { font-size: 8.5pt; line-height: 1.05; }
        .small { font-size: 7.8pt; line-height: 1.05; }
        .response { overflow: hidden; overflow-wrap: break-word; word-wrap: break-word; }
        .cell-content { overflow: hidden; }
        .page-break-avoid { page-break-inside: avoid; }

        .admin-cell { height: 14mm; padding: 0; text-align: right; vertical-align: top; }
        .admin-block { display: inline-block; width: 48mm; font-size: 7.8pt; line-height: 1.05; text-align: right; }
        .form-number { font-size: 9pt; font-weight: bold; }
        .title-cell { height: 20mm; text-align: center; vertical-align: middle; }
        .title-si { font-size: 13pt; font-weight: bold; line-height: 1.05; }
        .title-ta { font-size: 13pt; font-weight: bold; line-height: 1.05; }
        .title-en { font-size: 14pt; font-weight: bold; line-height: 1.05; }
        .reference-cell { font-size: 8.8pt; line-height: 1.05; text-align: left; vertical-align: middle; }
        .ministry-table td { border-left: 0; border-right: 0; }
        .ministry-line { height: 14mm; }
        .copy-line { height: 10mm; }
        .dotted-value { border-bottom: 0.25mm dotted #000; }

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
        .h-6 { height: 5mm; }

        .section-4-label { height: 7mm; overflow: hidden; }
        .section-4-response { height: 25mm; overflow: hidden; }
        .item-area { height: 72mm; padding: 2mm; }
        .item-line { height: 6.5mm; overflow: hidden; line-height: 1.25; }
        .officer-line { height: 5.5mm; overflow: hidden; line-height: 1.15; }
        .writing-heading { height: 10mm; overflow: hidden; }
        .writing-heading-tall { height: 11mm; overflow: hidden; }
        .writing-response-30 { height: 21mm; overflow: hidden; }
        .writing-response-29 { height: 20mm; overflow: hidden; }

        .signature-area { height: 65mm; }
        .signature-image { width: 38mm; height: 12mm; object-fit: contain; }
        .signature-line { height: 12mm; border-bottom: 0.25mm dotted #000; }
        .signature-label { font-size: 9pt; line-height: 1.12; }
        .footer-note { height: 3mm; font-size: 7.8pt; text-align: left; vertical-align: bottom; }
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
        <table class="no-border page-break-avoid"><tr><td class="admin-cell"><div class="admin-block"><span lang="si">පොදු</span> / <span lang="ta">பொது</span> / General<br><span class="form-number">283</span><br>(F2* S., T. &amp; E.) 12/76<br>(A4* S., T. &amp; E. 06/2023 - Amended)</div></td></tr></table>

        <table class="page-break-avoid">
            <tr>
                <td class="title-cell" style="width: 150mm;"><span class="title-si" lang="si">මූ. රෙ. 104 (3) යටතේ අලාභයන් පිළිබඳ ප්‍රාථමික වාර්තාව</span><br><span class="title-ta" lang="ta">நி.பி. 104 (3) இன் கீழ் இழப்புகள் பற்றிய தொடக்க அறிக்கை</span><br><span class="title-en">PRELIMINARY REPORT OF LOSSES UNDER F.R. 104 (3)</span></td>
                <td class="reference-cell" style="width: 50mm;"><span class="label-local" lang="si">යොමු අංකය</span> / <span class="label-local" lang="ta">தொடர் இல.</span><br>Ref. No.<br><span class="dotted-value">{{ $text($referenceNumber, 30) }}</span></td>
            </tr>
        </table>

        <table class="ministry-table page-break-avoid">
            <tr><td class="ministry-line compact"><span class="label-local" lang="si">අමාත්‍යාංශයේ ලේකම්</span> / <span class="label-local" lang="ta">அமைச்சின் செயலாளர்</span> / Secretary to the Ministry of <span class="dotted-value">{{ $text(data_get($documentData, 'ministry', ''), 50) }}</span></td></tr>
            <tr><td class="copy-line compact"><span class="label-local" lang="si">පිටපත: විගණකාධිපති</span> / <span class="label-local" lang="ta">பிரதி: கணக்காய்வாளர் தலைமை அதிபதி</span><br>Copy to: Auditor-General</td></tr>
        </table>

        <table class="page-break-avoid"><tr><td class="h-12 compact" style="width: 57mm;"><span class="label-local" lang="si">1. දෙපාර්තමේන්තුව / සංස්ථාව</span><br><span class="label-local" lang="ta">1. திணைக்களம் / கூட்டுத்தாபனம்</span><br>Department / Corporation</td><td class="h-12 response" style="width: 143mm;">{{ $text(data_get($documentData, 'department', ''), 180) }}</td></tr></table>

        <table class="page-break-avoid"><tr>
            <td class="h-25" style="width: 76mm;"><span class="label-local" lang="si">2. අලාභය</span><br><span class="label-local" lang="ta">2. இழப்பு</span><br>Loss<br>{{ $text(data_get($documentData, 'lossDetails', data_get($documentData, 'loss', '')), 180) }}</td>
            <td class="h-25 compact" style="width: 42mm;"><div class="small">දිනය / திகதி<br>Date</div><div class="cell-content" style="height: 17mm;">{{ $text(data_get($documentData, 'lossDate', data_get($documentData, 'date', '')), 30) }}</div></td>
            <td class="h-25 compact" style="width: 82mm;"><div class="small">ස්ථානය / இடம்<br>Place</div><div class="cell-content" style="height: 17mm;">{{ $text(data_get($documentData, 'lossPlace', data_get($documentData, 'place', '')), 60) }}</div></td>
        </tr></table>

        <table class="page-break-avoid"><tr><td class="h-26 compact" style="width: 44mm;"><span class="label-local" lang="si">3. අලාභයේ ස්වභාවය</span><br><span class="label-local" lang="ta">3. இழப்பின் தன்மை</span><br>Nature of Loss</td><td class="h-26 response" style="width: 156mm;">{{ $text(data_get($documentData, 'natureOfLoss', ''), 180) }}</td></tr></table>

        <table class="page-break-avoid">
            <tr>
                <th class="h-13 table-header header-cell" style="width: 77mm;"><span lang="si">අහිමි වූ භාණ්ඩවල විස්තරය</span><br><span lang="ta">இழந்த பொருட்களின் விபரம்</span><br>Description of items lost</th>
                <th class="h-13 table-header header-cell" style="width: 45mm;"><span lang="si">ප්‍රමාණය</span><br><span lang="ta">அளவு</span><br>Quantity</th>
                <th class="h-13 table-header header-cell" style="width: 42mm;"><span lang="si">මිනුම් ඒකක</span><br><span lang="ta">அளவீட்டு அலகு</span><br>Units of Measure</th>
                <th class="h-13 table-header header-cell" style="width: 36mm;"><span lang="si">වටිනාකම</span><br><span lang="ta">பெறுமதி</span><br>Value</th>
            </tr>
            <tr>
                <td class="item-area" style="width: 77mm;">@foreach($itemSlots as $item)<div class="item-line">{{ $text(data_get($item, 'description', ''), 90) }}</div>@endforeach</td>
                <td class="item-area" style="width: 45mm; text-align: center;">@foreach($itemSlots as $item)<div class="item-line">{{ $text(data_get($item, 'quantity', ''), 20) }}</div>@endforeach</td>
                <td class="item-area" style="width: 42mm; text-align: center;">@foreach($itemSlots as $item)<div class="item-line">{{ $text(data_get($item, 'unitOfMeasure', data_get($item, 'unit', '')), 25) }}</div>@endforeach</td>
                <td class="item-area" style="width: 36mm; text-align: right;">@foreach($itemSlots as $item)<div class="item-line">{{ $text(data_get($item, 'value', ''), 25) }}</div>@endforeach</td>
            </tr>
        </table>

        <table class="page-break-avoid"><tr><td class="h-46"><div class="section-4-label"><span class="label-local" lang="si">4. අලාභයට හේතුව</span> / <span class="label-local" lang="ta">4. இழப்பிற்கான காரணம்</span> / Cause of Loss</div><div class="section-4-response response">{{ $text(data_get($documentData, 'causeOfLoss', ''), 300) }}</div></td></tr></table>
        <table class="no-border"><tr><td class="footer-note">(2023/06) ශ්‍රී ලංකා රජයේ මුද්‍රණ දෙපාර්තමේන්තුව</td></tr></table>
    </div>

    <div class="page page-2">
        <table class="page-break-avoid">
            <tr><th class="h-12 table-header header-cell" style="width: 100mm;"><span lang="si">5. වගකිවයුතු නිලධාරීන්ගේ නම</span><br><span lang="ta">5. பொறுப்பான அலுவலர்களின் பெயர்</span><br>Name</th><th class="h-12 table-header header-cell" style="width: 100mm;"><span lang="si">තනතුර</span><br><span lang="ta">பதவி</span><br>Designation</th></tr>
            <tr>
                <td class="h-23 response" style="width: 100mm;">@foreach($officerSlots as $officerSlot)<div class="officer-line">{{ $text(data_get($officerSlot, 'officer.name', ''), 70) }}</div>@endforeach</td>
                <td class="h-23 response" style="width: 100mm;">@foreach($officerSlots as $officerSlot)<div class="officer-line">{{ $text(data_get($officerSlot, 'designation', ''), 70) }}</div>@endforeach</td>
            </tr>
        </table>
        <table class="page-break-avoid"><tr><td class="h-23" style="width: 100mm;"><span class="label-local" lang="si">6. පොලිස් ස්ථානයේ නම</span><br><span class="label-local" lang="ta">6. பொலிஸ் நிலையத்தின் பெயர்</span><br>Name of Police Station<br>{{ $text(data_get($documentData, 'policeStation', ''), 110) }}</td><td class="h-23" style="width: 100mm;"><span class="label-local" lang="si">පොලිසියට වාර්තා කළ දිනය</span><br><span class="label-local" lang="ta">பொலிஸாருக்கு அறிவித்த திகதி</span><br>Date reported to Police<br>{{ $text(data_get($documentData, 'policeReportDate', ''), 35) }}</td></tr></table>
        <table class="page-break-avoid"><tr><td class="h-42"><div class="writing-heading"><span class="label-local" lang="si">7. සිදු කරනු ලබන විමර්ශනයේ ස්වභාවය</span><br><span class="label-local" lang="ta">7. மேற்கொள்ளப்படும் விசாரணையின் தன்மை</span><br>Nature of Investigation being carried out</div><div class="writing-response-30 response">{{ $text(data_get($documentData, 'investigation', ''), 280) }}</div></td></tr></table>
        <table class="page-break-avoid"><tr><td class="h-43"><div class="writing-heading-tall"><span class="label-local" lang="si">8. පොත්පත්, වාර්තා ආදියෙහි ආරක්ෂාව සඳහා කරන ලද විධිවිධාන</span><br><span class="label-local" lang="ta">8. புத்தகங்கள், பதிவேடுகள் முதலியவற்றின் பாதுகாப்பிற்காக செய்யப்பட்ட ஏற்பாடுகள்</span><br>Arrangements made for the security of books, records, etc.</div><div class="writing-response-29 response">{{ $text(data_get($documentData, 'securityArrangements', ''), 320) }}</div></td></tr></table>
        <table class="page-break-avoid"><tr><td class="h-43"><div class="writing-heading-tall"><span class="label-local" lang="si">9. තවදුරටත් අලාභ සිදුවීම වැළැක්වීම සඳහා කරන ලද විධිවිධාන</span><br><span class="label-local" lang="ta">9. மேலும் இழப்புகள் ஏற்படுவதைத் தடுப்பதற்காக செய்யப்பட்ட ஏற்பாடுகள்</span><br>Arrangements made for prevention of further losses</div><div class="writing-response-29 response">{{ $text(data_get($documentData, 'preventionArrangements', ''), 320) }}</div></td></tr></table>
        <table class="no-border page-break-avoid"><tr><td class="signature-area" style="width: 55mm; padding: 4mm 2mm 0;"><span class="signature-label"><span lang="si">දිනය</span> / <span lang="ta">திகதி</span> / Date:</span><br>{{ $text(data_get($headSignature, 'approved_at', ''), 30) }}</td><td class="signature-area" style="width: 145mm; padding: 4mm 2mm 0;"><table class="no-border"><tr><td class="no-border" style="height: 20mm;">@if(data_get($headSignature, 'signature_data_uri'))<img class="signature-image" src="{{ data_get($headSignature, 'signature_data_uri') }}" alt="Head signature">@else<div class="signature-line"></div>@endif<br><span class="signature-label">Head of Department / Chairman of Corporation</span></td></tr><tr><td class="no-border" style="height: 18mm;"><span lang="si">යොමු කරන ලදී</span> / <span lang="ta">அனுப்பப்பட்டது</span> / Forwarded<br>Ref. No.: {{ $text($referenceNumber, 30) }} &nbsp;&nbsp; Date: {{ $text(data_get($headSignature, 'approved_at', ''), 30) }}</td></tr><tr><td class="no-border"><div class="signature-line"></div><span class="signature-label">Secretary to the Ministry of {{ $text(data_get($documentData, 'ministry', ''), 45) }}</span></td></tr></table></td></tr></table>
    </div>
</body>
</html>

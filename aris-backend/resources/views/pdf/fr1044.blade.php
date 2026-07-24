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

        .page-1, .page-2, .page-3 {
            page-break-after: always;
        }

        .page-4 {
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

        .addressed-line {
            height: 12mm;
            text-align: right;
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
            height: 72mm;
            padding: 2mm;
        }

        .item-area-sm {
            height: 34mm;
            padding: 2mm;
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

        .signature-card-grid td {
            border: 0;
            padding: 2mm;
            text-align: center;
            vertical-align: top;
        }

        .approval-signature-image {
            width: 52mm;
            height: 20mm;
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
        $referenceNumber = data_get($document, 'reference_number', data_get($documentData, 'referenceNo', ''));
        $text = static fn (mixed $value, int $limit): string => \Illuminate\Support\Str::limit(trim((string) $value), $limit, '...');

        $lostItems = collect(data_get($documentData, 'lostItems', []))
            ->filter(static fn ($item): bool => is_array($item) || is_object($item))
            ->values()
            ->take(5);
        $itemSlots = $lostItems->pad(5, []);

        $officers = collect(data_get($documentData, 'officers', []))
            ->filter(static fn ($officer): bool => is_array($officer) || is_object($officer))
            ->values()
            ->take(4);
        $officerSlots = $officers->pad(4, []);

        $recoveries = collect(data_get($documentData, 'recoveries', []))
            ->filter(static fn ($recovery): bool => is_array($recovery) || is_object($recovery))
            ->values()
            ->take(3);
        $recoverySlots = $recoveries->pad(3, []);

        $boardMembers = collect(data_get($documentData, 'boardMembers', []))
            ->filter(static fn ($member): bool => is_array($member) || is_object($member))
            ->values()
            ->take(4);
        $boardMemberSlots = $boardMembers->pad(4, []);

        $copyToAuditorGeneral = data_get($documentData, 'copyToAuditorGeneral') === 'yes';
        $isDueToFraudNegligence = data_get($documentData, 'isDueToFraudNegligence');
    @endphp

    <div class="page page-1">

        <table class="no-border page-break-avoid">
            <tr>
                <td class="admin-cell">
                    <div class="admin-block">
                        <span lang="si">පොදු</span> / <span lang="ta">பொது</span> / General
                        <span class="form-number"> - 284</span><br>
                        (F* S., T. &amp; E.) 2/77<br>
                        [A4* S., T. &amp; E. 06/2023 - Amended]
                    </div>
                </td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="title-cell" style="width: 150mm;">
                    <span class="title-si" lang="si">මූ. රෙ. 104 (4) යටතේ අලාභයන් පිළිබඳ අවසාන වාර්තාව</span><br>
                    <span class="title-ta" lang="ta">நி.பி. 104 (4) இன் கீழ் இழப்புகள் பற்றிய இறுதி அறிக்கை</span><br>
                    <span class="title-en">FINAL REPORT OF LOSSES UNDER F.R. 104 (4)</span>
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
                    <span class="label-local">Secretary to the Ministry of</span>&nbsp;&nbsp;<span class="dotted-value">{{ $text(data_get($documentData, 'ministry', ''), 50) }}</span>
                </td>
            </tr>
            @if ($copyToAuditorGeneral)
            <tr>
                <td class="copy-line compact">
                    <span class="label-local" lang="si">පිටපත: විගණකාධිපති</span> /
                    <span class="label-local" lang="ta">பிரதி: கணக்காய்வாளர் தலைமை அதிபதி</span> /
                    <span class="label-local">Copy to: Auditor-General</span>
                </td>
            </tr>
            @endif
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
                <td class="field-topic-cell" style="width: 130mm; height: 8mm;">
                    <span class="label-local" lang="si">2. ප්‍රාථමික වාර්තාව - යොමු අංකය</span> /
                    <span class="label-local" lang="ta">தொடக்க அறிக்கை - தொடர் இல.</span> /
                    <span class="label-local">Preliminary Report - Ref. No.</span>
                </td>
                <td class="field-topic-cell" style="width: 70mm; height: 8mm;">
                    <span class="label-local" lang="si">දිනය</span> /
                    <span class="label-local" lang="ta">திகதி</span> /
                    <span class="label-local">Date</span>
                </td>
            </tr>
            <tr>
                <td class="field-content-cell" style="width: 130mm; height: 12mm;">{{ $text(data_get($documentData, 'preliminaryReportRefNo', ''), 60) }}</td>
                <td class="field-content-cell" style="width: 70mm; height: 12mm;">{{ $text(data_get($documentData, 'preliminaryReportDate', ''), 30) }}</td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="field-topic-cell" style="width: 60mm; height: 10mm;" colspan="3">
                    <span class="label-local" lang="si">3. අලාභය පිළිබඳ විස්තර</span> /
                    <span class="label-local" lang="ta">இழப்பின் விபரம்</span> /
                    <span class="label-local">Particulars of Loss</span>
                </td>
            </tr>
            <tr>
                <td class="field-topic-cell" style="width: 45mm;"><span class="label-local" lang="si">දිනය</span> / <span class="label-local" lang="ta">திகதி</span> / <span class="label-local">Date</span></td>
                <td class="field-topic-cell" style="width: 40mm;"><span class="label-local" lang="si">වේලාව</span> / <span class="label-local" lang="ta">நேரம்</span> / <span class="label-local">Time</span></td>
                <td class="field-topic-cell" style="width: 115mm;"><span class="label-local" lang="si">සිදුවූ ස්ථානය</span> / <span class="label-local" lang="ta">இடம்</span> / <span class="label-local">Location</span></td>
            </tr>
            <tr>
                <td class="field-content-cell" style="width: 45mm; height: 12mm;">{{ $text(data_get($documentData, 'lossDate', ''), 30) }}</td>
                <td class="field-content-cell" style="width: 40mm; height: 12mm;">{{ $text(data_get($documentData, 'lossTime', ''), 20) }}</td>
                <td class="field-content-cell" style="width: 115mm; height: 12mm;">{{ $text(data_get($documentData, 'location', ''), 90) }}</td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="field-topic-cell" style="height: 11mm;">
                    <span class="label-local" lang="si">4. අලාභය සිදුවීමට හේතුවූ තත්ත්වයන්</span><br>
                    <span class="label-local" lang="ta">இழப்பு ஏற்பட்ட சூழ்நிலைகள்</span><br>
                    <span class="label-local">Circumstances in which the loss occurred</span>
                </td>
            </tr>
            <tr>
                <td class="field-content-cell" style="height: 10mm;">{{ $text(data_get($documentData, 'lossDetails', ''), 150) }}</td>
            </tr>
            <tr>
                <td class="field-content-cell" style="height: 14mm;">{{ $text(data_get($documentData, 'circumstances', ''), 250) }}</td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="field-topic-cell" style="height: 14mm;">
                    <span class="label-local" lang="si">5. එය වංචාවක්, නොසැලකිල්ලක්, ප්‍රමාදයක්, අතපසුවීමක් හෝ වෙනත් වරදක් නිසා සිදු වූවක්ද?</span><br>
                    <span class="label-local" lang="ta">மோசடி, கவனயீனம், தாமதம், தவறவிடல் அல்லது பிற தவறு காரணமாக ஏற்பட்டதா?</span><br>
                    <span class="label-local">Is it due to fraud, negligence, delay, omissions or other fault?</span>
                </td>
            </tr>
            <tr>
                <td class="field-content-cell" style="height: 6mm;">
                    <span class="label-local">Yes / No:</span> {{ $text($isDueToFraudNegligence === 'yes' ? 'Yes' : ($isDueToFraudNegligence === 'no' ? 'No' : ''), 10) }}
                </td>
            </tr>
            <tr>
                <td class="field-content-cell" style="height: 10mm;">{{ $text(data_get($documentData, 'causeOfLoss', ''), 200) }}</td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="field-topic-cell" style="height: 11mm;">
                    <span class="label-local" lang="si">6. පොලිස් වාර්තාවේ සාරාංශය (වාර්තාවේ පිටපතක් අමුණන්න)</span><br>
                    <span class="label-local" lang="ta">பொலிஸ் அறிக்கையின் சுருக்கம் (அறிக்கையின் பிரதியொன்றை இணைக்கவும்)</span><br>
                    <span class="label-local">Summary of Police Report (annex a copy of the Report.)</span>
                </td>
            </tr>
            <tr>
                <td class="field-content-cell" style="height: 20mm;">
                    @if (data_get($documentData, 'policeReportEvidenceId') || data_get($documentData, 'policeReportFile'))
                        <span class="label-local">Attached — {{ $text(data_get($documentData, 'policeReportFile', ''), 60) }}</span>
                    @else
                        <span class="label-local small">Not attached</span>
                    @endif
                </td>
            </tr>
        </table>

        <table class="no-border page-break-avoid">
            <tr>
                <td class="addressed-line compact">
                    <span class="label-local" lang="si">අමාත්‍යාංශයේ ලේකම් වෙත</span> /
                    <span class="label-local" lang="ta">அமைச்சின் செயலாளருக்கு</span> /
                    <span class="label-local">To: Secretary to the Ministry</span>
                </td>
            </tr>
        </table>

    </div>

    <div class="page page-2">

        <table class="page-break-avoid">
            <tr>
                <th class="h-13 table-header header-cell" style="width: 200mm;" colspan="7">
                    <span lang="si">7. ඇස්තමේන්තුව හෝ අවසන් වටිනාකම</span><br>
                    <span lang="ta">7. இழந்த பொருட்களின் விபரம்</span><br>
                    Details of Items Lost
                </th>
            </tr>
            <tr>
                <th class="h-13 table-header header-cell" style="width: 40mm;">
                    <span lang="si">7(1) විස්තර</span><br>
                    <span lang="ta">7(1) தகவல்</span><br>
                    Description
                </th>
                <th class="h-13 table-header header-cell" style="width: 16mm;">
                    <span lang="si">7(2) ඒකකය</span><br>
                    <span lang="ta">7(2) அலகு</span><br>
                    Unit
                </th>
                <th class="h-13 table-header header-cell" style="width: 16mm;">
                    <span lang="si">7(3) ප්‍රමාණය</span><br>
                    <span lang="ta">7(3) அளவு</span><br>
                    Qty
                </th>
                <th class="h-13 table-header header-cell" style="width: 32mm;">
                    <span lang="si">7(4) ඇස්. වියදම</span><br>
                    <span lang="ta">7(4) மதிப்பீட்டுச் செலவு</span><br>
                    Approx. cost at time of loss
                </th>
                <th class="h-13 table-header header-cell" style="width: 32mm;">
                    <span lang="si">7(5) ප්‍රතිස්ථාපන අගය</span><br>
                    <span lang="ta">7(5) மாற்று மதிப்பு</span><br>
                    Replacement value / cost of repairs
                </th>
                <th class="h-13 table-header header-cell" style="width: 32mm;">
                    <span lang="si">7(6) මූ.රෙ.105(1)</span><br>
                    <span lang="ta">7(6) நி.பி.105(1)</span><br>
                    Value per F.R. 105(1)
                </th>
                <th class="h-13 table-header header-cell" style="width: 32mm;">
                    <span lang="si">7(7) මුල් වියදම</span><br>
                    <span lang="ta">7(7) மூலச் செலவு</span><br>
                    Original Cost
                </th>
            </tr>
            <tr>
                <td class="item-area" style="width: 40mm;">
                    @foreach ($itemSlots as $item)
                        <div class="item-line">{{ $text(data_get($item, 'description', ''), 60) }}</div>
                    @endforeach
                </td>
                <td class="item-area" style="width: 16mm; text-align: center;">
                    @foreach ($itemSlots as $item)
                        <div class="item-line">{{ $text(data_get($item, 'unit', ''), 15) }}</div>
                    @endforeach
                </td>
                <td class="item-area" style="width: 16mm; text-align: center;">
                    @foreach ($itemSlots as $item)
                        <div class="item-line">{{ $text(data_get($item, 'quantity', ''), 15) }}</div>
                    @endforeach
                </td>
                <td class="item-area" style="width: 32mm; text-align: right;">
                    @foreach ($itemSlots as $item)
                        <div class="item-line">{{ $text(data_get($item, 'estimatedCost', ''), 20) }}</div>
                    @endforeach
                </td>
                <td class="item-area" style="width: 32mm; text-align: right;">
                    @foreach ($itemSlots as $item)
                        <div class="item-line">{{ $text(data_get($item, 'replacementCost', ''), 20) }}</div>
                    @endforeach
                </td>
                <td class="item-area" style="width: 32mm; text-align: right;">
                    @foreach ($itemSlots as $item)
                        <div class="item-line">{{ $text(data_get($item, 'fr105Value', ''), 20) }}</div>
                    @endforeach
                </td>
                <td class="item-area" style="width: 32mm; text-align: right;">
                    @foreach ($itemSlots as $item)
                        <div class="item-line">{{ $text(data_get($item, 'originalCost', ''), 20) }}</div>
                    @endforeach
                </td>
            </tr>
        </table>

        <table class="page-break-avoid" style="margin-top: 3mm;">
            <tr>
                <th class="h-12 table-header header-cell" style="width: 40mm;">
                    <span lang="si">8(1) නම</span><br>
                    <span lang="ta">8(1) பெயர்</span><br>
                    Name
                </th>
                <th class="h-12 table-header header-cell" style="width: 40mm;">
                    <span lang="si">8(2) තනතුර</span><br>
                    <span lang="ta">8(2) பதவி</span><br>
                    Designation
                </th>
                <th class="h-12 table-header header-cell" style="width: 45mm;">
                    <span lang="si">8(3) වගකීමේ ස්වභාවය</span><br>
                    <span lang="ta">8(3) பொறுப்பின் தன்மை</span><br>
                    Nature of Responsibility
                </th>
                <th class="h-12 table-header header-cell" style="width: 40mm;">
                    <span lang="si">8(4) විනයානුකූල ක්‍රියාමාර්ග</span><br>
                    <span lang="ta">8(4) ஒழுங்காற்று நடவடிக்கை</span><br>
                    Disciplinary Action Taken?
                </th>
                <th class="h-12 table-header header-cell" style="width: 35mm;">
                    <span lang="si">8(5) දඬුවම් විස්තර</span><br>
                    <span lang="ta">8(5) தண்டனையின் விபரம்</span><br>
                    Details of Punishment
                </th>
            </tr>
            <tr>
                <td class="h-23 response" style="width: 40mm;">
                    @foreach ($officerSlots as $officer)
                        <div class="officer-line">{{ $text(data_get($officer, 'name', ''), 40) }}</div>
                    @endforeach
                </td>
                <td class="h-23 response" style="width: 40mm;">
                    @foreach ($officerSlots as $officer)
                        <div class="officer-line">{{ $text(data_get($officer, 'designation', ''), 40) }}</div>
                    @endforeach
                </td>
                <td class="h-23 response" style="width: 45mm;">
                    @foreach ($officerSlots as $officer)
                        <div class="officer-line">{{ $text(data_get($officer, 'responsibility', ''), 45) }}</div>
                    @endforeach
                </td>
                <td class="h-23 response" style="width: 40mm; text-align: center;">
                    @foreach ($officerSlots as $officer)
                        <div class="officer-line">{{ $text(data_get($officer, 'disciplinaryAction', ''), 30) }}</div>
                    @endforeach
                </td>
                <td class="h-23 response" style="width: 35mm;">
                    @foreach ($officerSlots as $officer)
                        <div class="officer-line">{{ $text(data_get($officer, 'punishment', ''), 30) }}</div>
                    @endforeach
                </td>
            </tr>
        </table>

    </div>

    <div class="page page-3">

        <table class="page-break-avoid">
            <tr>
                <td class="field-topic-cell" style="width: 90mm; height: 8mm;">
                    <span class="label-local" lang="si">9. නඩු මණ්ඩලයේ නම</span> /
                    <span class="label-local" lang="ta">நீதிமன்றத்தின் பெயர்</span> /
                    <span class="label-local">Name of Court</span>
                </td>
                <td class="field-topic-cell" style="width: 60mm; height: 8mm;">
                    <span class="label-local" lang="si">නඩු අංකය</span> /
                    <span class="label-local" lang="ta">வழக்கு இல.</span> /
                    <span class="label-local">Case No.</span>
                </td>
            </tr>
            <tr>
                <td class="field-content-cell" style="width: 90mm; height: 12mm;">{{ $text(data_get($documentData, 'courtName', ''), 70) }}</td>
                <td class="field-content-cell" style="width: 60mm; height: 12mm;">{{ $text(data_get($documentData, 'courtCaseNo', ''), 40) }}</td>
            </tr>
            <tr>
                <td class="field-topic-cell" style="height: 8mm;" colspan="2">
                    <span class="label-local" lang="si">9. විනිශ්චය (පිටපතක් අමුණන්න)</span> /
                    <span class="label-local" lang="ta">நீதிமன்றக் கட்டளை (பிரதி இணைக்க)</span> /
                    <span class="label-local">Order of Court (Annex a copy)</span>
                </td>
            </tr>
            <tr>
                <td class="field-content-cell" style="height: 12mm;" colspan="2">{{ $text(data_get($documentData, 'courtOrderSummary', ''), 180) }}</td>
            </tr>
            @if (data_get($documentData, 'courtOrderEvidenceId') || data_get($documentData, 'courtOrderFile'))
            <tr>
                <td class="field-content-cell" style="height: 6mm;" colspan="2"><span class="small">Attached — {{ $text(data_get($documentData, 'courtOrderFile', ''), 60) }}</span></td>
            </tr>
            @endif
        </table>

        <table class="page-break-avoid" style="margin-top: 3mm;">
            <tr>
                <th class="h-12 table-header header-cell" style="width: 70mm;" colspan="1">
                    <span lang="si">10. නිලධාරියාගේ නම</span><br>
                    <span lang="ta">உத்தியோகத்தர் பெயர்</span><br>
                    Name of Officer
                </th>
                <th class="h-12 table-header header-cell" style="width: 50mm;">
                    <span lang="si">අයකර ගැනීමට ඇති මුදල</span><br>
                    <span lang="ta">மீட்கப்படும் தொகை</span><br>
                    Amount to be Recovered
                </th>
                <th class="h-12 table-header header-cell" style="width: 80mm;">
                    <span lang="si">අයකර ගැනීමේ ක්‍රමය</span><br>
                    <span lang="ta">மீட்பு செய்முறை</span><br>
                    How Recovery is to be Made
                </th>
            </tr>
            <tr>
                <td class="item-area-sm" style="width: 70mm;">
                    @foreach ($recoverySlots as $recovery)
                        <div class="item-line">{{ $text(data_get($recovery, 'officer', ''), 40) }}</div>
                    @endforeach
                </td>
                <td class="item-area-sm" style="width: 50mm; text-align: right;">
                    @foreach ($recoverySlots as $recovery)
                        <div class="item-line">{{ $text(data_get($recovery, 'amount', ''), 25) }}</div>
                    @endforeach
                </td>
                <td class="item-area-sm" style="width: 80mm;">
                    @foreach ($recoverySlots as $recovery)
                        <div class="item-line">{{ $text(data_get($recovery, 'method', ''), 55) }}</div>
                    @endforeach
                </td>
            </tr>
        </table>

        <table class="page-break-avoid" style="margin-top: 3mm;">
            <tr>
                <td class="field-topic-cell" style="height: 8mm;" colspan="4">
                    <span class="label-local" lang="si">11. රක්ෂණයකින් හෝ ඇප සහතිකයකින් අයකරගත හැකි මුදල</span> /
                    <span class="label-local" lang="ta">காப்புறுதி அல்லது உத்தரவாதத்திலிருந்து மீட்கக்கூடிய தொகை</span> /
                    <span class="label-local">Amount Recoverable from Insurance / Guarantee</span>
                </td>
            </tr>
            <tr>
                <td class="field-content-cell" style="width: 200mm; height: 10mm;" colspan="4">
                    <span class="label-local">Amount in words (Rupees):</span>
                    {{ $text(data_get($documentData, 'insuranceRecoverableAmountWords', ''), 100) }}
                </td>
            </tr>
            <tr>
                <td class="field-topic-cell" style="width: 45mm;">Policy No.</td>
                <td class="field-topic-cell" style="width: 55mm;">Amount Insured for</td>
                <td class="field-topic-cell" style="width: 100mm;" colspan="2">Amount Recoverable</td>
            </tr>
            <tr>
                <td class="field-content-cell" style="width: 45mm; height: 10mm;">{{ $text(data_get($documentData, 'policyNo', ''), 25) }}</td>
                <td class="field-content-cell" style="width: 55mm; height: 10mm;">{{ $text(data_get($documentData, 'amountInsured', ''), 25) }}</td>
                <td class="field-content-cell" style="width: 100mm; height: 10mm;" colspan="2">{{ $text(data_get($documentData, 'amountRecoverable', ''), 25) }}</td>
            </tr>
        </table>

        <table class="page-break-avoid" style="margin-top: 3mm;">
            <tr>
                <th class="h-12 table-header header-cell" style="width: 100mm;">
                    <span lang="si">12. විමර්ශන මණ්ඩල සාමාජිකයන්ගේ නම</span><br>
                    <span lang="ta">விசாரணைச் சபையின் உறுப்பினர் பெயர்</span><br>
                    Names of Board of Inquiry Members
                </th>
                <th class="h-12 table-header header-cell" style="width: 100mm;">
                    <span lang="si">තනතුර</span><br>
                    <span lang="ta">gjtp</span><br>
                    Designation
                </th>
            </tr>
            <tr>
                <td class="h-23 response" style="width: 100mm;">
                    @foreach ($boardMemberSlots as $member)
                        <div class="officer-line">{{ $text(data_get($member, 'memberName', ''), 70) }}</div>
                    @endforeach
                </td>
                <td class="h-23 response" style="width: 100mm;">
                    @foreach ($boardMemberSlots as $member)
                        <div class="officer-line">{{ $text(data_get($member, 'designation', ''), 70) }}</div>
                    @endforeach
                </td>
            </tr>
        </table>

    </div>

    <div class="page page-4">

        <table class="page-break-avoid">
            <tr>
                <td class="field-topic-cell" style="height: 11mm;">
                    <span class="label-local" lang="si">13. විමර්ශන මණ්ඩලයේ නිර්දේශ (වාර්තාවේ පිටපතක් අමුණන්න)</span><br>
                    <span class="label-local" lang="ta">விசாரணைச் சபையின் விதப்புரைகள் (அறிக்கையின் பிரதியை இணைக்க)</span><br>
                    <span class="label-local">Recommendations of the Board of Inquiry (Annex copy of report)</span>
                </td>
            </tr>
            <tr>
                <td class="field-content-cell" style="height: 20mm;">{{ $text(data_get($documentData, 'recommendations', ''), 260) }}</td>
            </tr>
            @if (data_get($documentData, 'boardReportEvidenceId') || data_get($documentData, 'boardReportFile'))
            <tr>
                <td class="field-content-cell" style="height: 4mm;"><span class="small">Attached — {{ $text(data_get($documentData, 'boardReportFile', ''), 60) }}</span></td>
            </tr>
            @endif
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="field-topic-cell" style="height: 12mm;">
                    <span class="label-local" lang="si">14. අනාගතයේ දී මෙවැනි අලාභයන් වැළැක්වීම සඳහා ගෙන ඇති හෝ ගැනීමට යෝජිත පියවර</span><br>
                    <span class="label-local" lang="ta">எதிர்காலத்தில் இது போன்ற இழப்புகளைத் தடுப்பதற்கு எடுக்கப்பட்டுள்ள அல்லது உத்தேசிக்கப்பட்டுள்ள நடவடிக்கைகள்</span><br>
                    <span class="label-local">Steps taken or proposed to be taken to prevent similar losses in the future</span>
                </td>
            </tr>
            <tr>
                <td class="field-content-cell" style="height: 23mm;">{{ $text(data_get($documentData, 'preventiveActions', ''), 320) }}</td>
            </tr>
        </table>

        <table class="ministry-table page-break-avoid" style="margin-top: 3mm;">
            <tr>
                <td class="copy-line compact">
                    <span class="label-local" lang="si">15. ශ්‍රී ලංකා නිලධාරි ලේඛන යොමු අංකය</span> /
                    <span class="label-local" lang="ta">அ.நி. தொடர் இல.</span> /
                    <span class="label-local">S. T. Ref. No.</span>&nbsp;&nbsp;<span class="dotted-value">{{ $text(data_get($documentData, 'forwardingRefNo', ''), 30) }}</span>
                    &nbsp;&nbsp;<span class="label-local">Date</span>&nbsp;&nbsp;<span class="dotted-value">{{ $text(data_get($documentData, 'forwardingDate', ''), 20) }}</span>
                </td>
            </tr>
            <tr>
                <td class="ministry-line compact">
                    <span class="label-local">Forwarded.</span><br><br>
                    <span class="label-local" lang="si">අමාත්‍යාංශයේ ලේකම්</span> /
                    <span class="label-local" lang="ta">அமைச்சின் செயலாளர்</span> /
                    <span class="label-local">Secretary to the Ministry of</span>&nbsp;&nbsp;<span class="dotted-value">{{ $text(data_get($documentData, 'ministry', ''), 50) }}</span>
                </td>
            </tr>
        </table>

        <table class="no-border signature-card-grid page-break-avoid"
            style="margin-top: 16mm;"
        >
            <tr>
                <td style="width: 66.66mm;">
                    @if (data_get($documentData, 'preparedSignature'))
                        <img class="approval-signature-image" src="{{ data_get($documentData, 'preparedSignature') }}" alt="Prepared by signature"><br>
                    @else
                        <div class="signature-line"></div>
                    @endif
                    <span class="signature-card-name">{{ $text(data_get($documentData, 'preparedBy', ''), 55) }}</span><br>
                    <span class="signature-card-role">{{ $text(data_get($documentData, 'preparedDesignation', ''), 55) }}</span><br>
                    <span class="signature-card-institution">Prepared By</span><br>
                    <span class="signature-card-date">{{ $text(data_get($documentData, 'preparedDate', ''), 30) }}</span>
                </td>
                <td style="width: 66.66mm;">
                    @if (data_get($documentData, 'headSignature'))
                        <img class="approval-signature-image" src="{{ data_get($documentData, 'headSignature') }}" alt="Head of Department signature"><br>
                    @else
                        <div class="signature-line"></div>
                    @endif
                    <span class="signature-card-name">{{ $text(data_get($documentData, 'headName', ''), 55) }}</span><br>
                    <span class="signature-card-role">{{ $text(data_get($documentData, 'headDesignation', ''), 55) }}</span><br>
                    <span class="signature-card-institution">Head of Department / Chairman</span><br>
                    <span class="signature-card-date">{{ $text(data_get($documentData, 'headApprovalDate', ''), 30) }}</span>
                </td>
                <td style="width: 66.66mm;">
                    @if (data_get($documentData, 'secretarySignature'))
                        <img class="approval-signature-image" src="{{ data_get($documentData, 'secretarySignature') }}" alt="Secretary to the Ministry signature"><br>
                    @else
                        <div class="signature-line"></div>
                    @endif
                    <span class="signature-card-name">{{ $text(data_get($documentData, 'secretaryName', ''), 55) }}</span><br>
                    <span class="signature-card-role">{{ $text(data_get($documentData, 'secretaryDesignation', ''), 55) }}</span><br>
                    <span class="signature-card-institution">Secretary to the Ministry</span><br>
                    <span class="signature-card-date">{{ $text(data_get($documentData, 'secretaryApprovalDate', ''), 30) }}</span>
                </td>
            </tr>
        </table>

    </div>
</body>
</html>
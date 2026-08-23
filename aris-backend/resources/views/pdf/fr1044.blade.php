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
        th {
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

        .page-1,
        .page-2,
        .page-3 {
            page-break-after: always;
        }

        .page-4 {
            page-break-after: auto;
        }

        [lang="si"] {
            font-family: iskoolapota, sans-serif;
            font-weight: normal !important;
        }

        [lang="ta"] {
            font-family: notosanstamil, sans-serif;
            font-weight: normal !important;
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
            padding: 1.4mm 2mm;
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
            font-size: 8.5pt;
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
            font-size: 7.5pt;
            line-height: 1.02;
            font-weight: normal !important;
        }

        [lang="si"] {
            font-family: iskoolapota, sans-serif;
            font-weight: normal !important;
        }

        /* Sinhala section/table labels match the normal table-content scale;
           Tamil remains compact to balance the font's larger visual metrics. */
        .section-sinhala-title,
        .subsection-sinhala-title,
        .table-header-sinhala,
        .table-header [lang="si"] {
            font-size: 9.5pt !important;
            font-weight: normal !important;
            line-height: 1.02;
        }

        .field-topic-cell .label-local[lang="si"],
        .field-title .label-local[lang="si"],
        .insurance-title .label-local[lang="si"],
        .insurance-heading [lang="si"],
        .insurance-words-label [lang="si"] {
            font-size: 9.5pt !important;
            font-weight: normal !important;
            line-height: 1.02;
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

        /* Shared FR109/FR1044 form-header structure. */
        .form-header-title {
            height: 50mm;
            padding: 0 !important;
            overflow: visible !important;
            text-align: center;
            vertical-align: middle;
        }

        .form-title-si {
            font-family: iskoolapota, sans-serif !important;
            font-size: 14pt;
            font-weight: bold !important;
            line-height: 1;
        }

        .form-header-title .fr1044-header-si {
            font-family: iskoolapota, sans-serif !important;
            font-size: 14pt !important;
            font-weight: bold !important;
            line-height: 1.05 !important;
            margin-bottom: 1mm;
        }

        .form-title-ta {
            font-family: notosanstamil, sans-serif;
            font-size: 10pt;
            font-weight: normal;
            line-height: 1.06;
        }

        .form-title-en {
            font-family: dejavuserifcondensed, serif;
            font-size: 9pt;
            line-height: 1.02;
        }

        /* Fixed FR109-compatible approval grid. Keep this local so the
           official FR1044 field geometry remains unchanged. */
        .page-three-approval-signatures {
            width: 200mm;
            margin-top: 1mm;
            table-layout: fixed;
        }

        .page-three-approval-signatures > tbody > tr {
            height: 21mm;
        }

        .page-three-approval-signatures > tbody > tr.page-three-signature-separator,
        .page-three-approval-signatures > tbody > tr.page-three-signature-separator td {
            height: 1mm;
            padding: 0 !important;
            border-top: 0.35mm solid #000 !important;
        }

        .page-three-approval-signatures td {
            border: 0;
            padding: 0;
        }

        .page-three-approval-signatures .page-three-signature-comment {
            height: 21mm;
            padding-right: 4mm;
            font-size: 8pt;
            line-height: 1.15;
            text-align: right;
            vertical-align: middle;
        }

        .page-three-approval-signatures .page-three-signature-card {
            height: 21mm;
            padding-left: 4mm;
            text-align: right;
            vertical-align: bottom;
        }

        .page-three-approval-signatures .signature-space {
            height: 8mm !important;
            line-height: 0;
            text-align: right;
        }

        .page-three-approval-signatures .approval-signature-image {
            width: 28mm !important;
            height: 8mm !important;
            object-fit: contain;
        }

        .page-three-approval-signatures .signature-dots,
        .page-three-approval-signatures .signature-approver-name,
        .page-three-approval-signatures .signature-role,
        .page-three-approval-signatures .signature-institution,
        .page-three-approval-signatures .signature-date {
            font-size: 6.8pt;
            line-height: 1;
            text-align: right;
        }

        .form-reference {
            padding: 3mm 3.5mm !important;
            vertical-align: middle;
            font-size: 8.8pt;
            line-height: 1.05;
            text-align: left;
        }

        .form-reference-label {
            font-size: 8.5pt;
            line-height: 1.1;
            text-align: left;
        }

        .form-reference-value {
            display: block;
            margin-top: 3mm;
            padding-bottom: 0.7mm;
            border-bottom: 0.25mm dotted #000;
            font-family: dejavuserifcondensed, serif;
            font-size: 10pt;
            line-height: 1.1;
            text-align: left;
        }

        .ministry-table td {
            border-left: 0;
            border-right: 0;
        }

        .ministry-line {
            height: 14mm;
            border-bottom: 0 !important;
        }

        .copy-line {
            height: 10mm;
            border-top: 0 !important;
        }

        .addressed-line {
            height: 12mm;
            text-align: right;
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
            height: 72mm;
            padding: 2mm;
        }

        .repeating-item-row-cell {
            height: 14mm;
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

        .item-area-sm {
            height: 34mm;
            padding: 2mm;
        }

        .recovery-row-cell {
            height: 10.8mm;
            padding: 1.2mm 2mm;
            vertical-align: top;
            line-height: 1.25;
            overflow: hidden;
        }

        .item-total-row {
            height: 7mm;
            padding: 1mm 2mm;
            font-size: 8.5pt;
            vertical-align: middle;
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
            font-size: 8.5pt;
        }

        .field-content-cell {
            padding: 2mm;
            vertical-align: top;
            overflow: hidden;
            overflow-wrap: break-word;
            word-wrap: break-word;
        }

        /* Section 11 must render as a fully ruled table in mPDF. */
        .insurance-table {
            border: 0.25mm solid #000;
        }

        .insurance-table td {
            border: 0.25mm solid #000 !important;
            padding: 0;
        }

        .insurance-title {
            height: 14mm;
            padding: 1.5mm 2mm !important;
            border-top: 0.25mm solid #000 !important;
            border-bottom: 0.25mm solid #000 !important;
            vertical-align: top;
        }

        .insurance-words {
            height: 16mm;
            padding: 1.5mm 6mm !important;
            border-bottom: 0.25mm solid #000 !important;
            vertical-align: middle;
        }

        .insurance-words-grid {
            width: 100%;
            border: 0 !important;
        }

        .insurance-words-grid td {
            border: 0 !important;
            padding: 0 !important;
            vertical-align: middle;
        }

        .insurance-words-label {
            line-height: 1.05;
        }

        .insurance-brace {
            display: block;
            font-family: serif;
            font-size: 29pt;
            font-weight: normal;
            line-height: 0.8;
            text-align: center;
        }

        .insurance-dotted-value {
            display: block;
            width: 100%;
            min-height: 7mm;
            border-bottom: 0.25mm dotted #000;
        }

        .insurance-heading {
            height: 20mm;
            padding: 2mm !important;
            border-bottom: 0.25mm solid #000 !important;
            text-align: center;
            vertical-align: middle;
        }

        .insurance-value {
            height: 36mm;
            padding: 2mm !important;
            border-bottom: 0.25mm solid #000 !important;
            vertical-align: top;
        }

        .insurance-divider {
            border-right: 0.25mm solid #000 !important;
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
            width: 32mm !important;
            height: 10mm !important;
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

        .signature-card-role {
            font-size: 8.5pt;
            line-height: 1.15;
        }

        .signature-card-date {
            font-size: 7.5pt;
            line-height: 1.15;
            white-space: nowrap;
        }

        .signature-grid-card {
            width: 100%;
        }

        .signature-grid-card td {
            border: 0;
            padding: 0;
            vertical-align: middle;
        }

        .signature-grid-comment {
            width: 105mm;
            height: 21mm;
            padding: 2mm 2mm 0 0 !important;
            font-size: 7.2pt;
            line-height: 1.08;
            text-align: left;
            vertical-align: middle !important;
        }

        .signature-grid-signature {
            width: 91mm;
            text-align: right;
        }

        .signature-grid-line {
            width: 70mm;
            min-height: 8mm;
            margin-left: auto;
            border-bottom: 0.25mm dotted #000;
        }

        .signature-grid-image {
            width: 28mm !important;
            height: 8mm !important;
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
            height: 21mm;
        }

        .signature-full-separator td {
            height: 1.5mm;
            padding: 0 !important;
            border-top: 0.35mm solid #000 !important;
        }

        .signature-ministry-single {
            margin: 1mm 0 0;
        }

        .signature-label {
            font-size: 9pt;
            line-height: 1.12;
        }

        .workflow-signature-layout td,
        .workflow-signature-row td {
            border: 0;
            padding: 0;
            vertical-align: top;
        }

        .workflow-signature-block {
            min-height: 19mm;
            padding-bottom: 3mm;
        }

        .workflow-signature-separator {
            width: 100%;
            border-collapse: collapse;
            margin: 1mm 0 3mm;
        }

        .workflow-signature-separator td {
            border-top: 0.35mm solid #000 !important;
            height: 0;
            padding: 0;
        }

        .workflow-date-labels {
            width: 18mm;
            font-size: 8.5pt;
            line-height: 1.15;
            padding: 0 !important;
            vertical-align: bottom !important;
        }

        .workflow-date-brace {
            width: 5mm;
            font-size: 25pt;
            line-height: 1;
            padding: 0 !important;
            text-align: center;
            vertical-align: middle !important;
        }

        .workflow-date-value {
            width: 32mm;
            font-size: 8.5pt;
            padding: 0 0 0.3mm 2mm !important;
            vertical-align: bottom !important;
        }

        .workflow-signature-content {
            text-align: right;
        }

        .workflow-signature-comment {
            font-size: 8pt;
            line-height: 1.15;
            text-align: left;
            vertical-align: middle;
        }

        .workflow-signature-line {
            width: 75mm;
            min-height: 12mm;
            margin-left: auto;
            border-bottom: 0.25mm dotted #000;
        }

        .workflow-signature-image {
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
        $data = $data ?? $documentData;
        $approvals = $approvals ?? ($signatures ?? []);
        $referenceNumber = data_get($document, 'reference_number', data_get($documentData, 'referenceNo', ''));
        // The official form must render the stored value, not a shortened
        // preview with an ellipsis. Fixed table geometry remains unchanged.
        $text = static fn(mixed $value, int $limit): string => trim((string) $value);

        $lostItems = collect(data_get($documentData, 'lostItems', []))
            ->filter(static fn($item): bool => is_array($item) || is_object($item))
            ->values()
            ->take(5);
        $itemSlots = $lostItems->pad(5, []);
        $number = static fn(mixed $value): float => (float) preg_replace('/[^0-9.\-]/', '', (string) $value ?: '0');
        $totalOriginalCost = collect(data_get($documentData, 'lostItems', []))->sum(
            static fn($item): float => $number(data_get($item, 'originalCost', 0)),
        );

        $officers = collect(data_get($documentData, 'officers', []))
            ->filter(static fn($officer): bool => is_array($officer) || is_object($officer))
            ->values()
            ->take(4);
        $officerSlots = $officers->pad(4, []);

        $recoveries = collect(data_get($documentData, 'recoveries', []))
            ->filter(static fn($recovery): bool => is_array($recovery) || is_object($recovery))
            ->values()
            ->take(3);
        $recoverySlots = $recoveries->pad(3, []);

        $boardMembers = collect(data_get($documentData, 'boardMembers', []))
            ->filter(static fn($member): bool => is_array($member) || is_object($member))
            ->values()
            ->take(4);
        $boardMemberSlots = $boardMembers->pad(4, []);

        $isDueToFraudNegligence = data_get($documentData, 'isDueToFraudNegligence');
        $signatureDate = static function (mixed $value): string {
            if ($value === null || $value === '') {
                return '';
            }

            try {
                return \Illuminate\Support\Carbon::parse($value)->format('Y-m-d H:i:s');
            } catch (\Throwable) {
                return '';
            }
        };
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

        <table>
            <tr>
                <td class="form-header-title" style="width: 140mm;">
                    <span class="form-title-si fr1044-header-si" lang="si" style="display: block; font-family: iskoolapota, sans-serif; font-size: 14pt; font-weight: bold; line-height: 1.05;">
                        මූ. රෙ. 104 (4) යටතේ අලාභයන් පිළිබඳ<br>අවසාන වාර්තාව
                    </span>
                    <div class="form-title-ta" lang="ta">
                        நி.பி. 104 (4) இன் கீழ் இழப்புகள் பற்றிய<br>இறுதி அறிக்கை
                    </div>
                    <div class="form-title-en">
                        FINAL REPORT OF LOSSES UNDER F.R. 104 (4)
                    </div>
                </td>
                <td class="form-reference" style="width: 60mm;">
                    <div class="form-reference-label">
                        <span lang="si">යොමු අංක</span> /
                        <span lang="ta">தொடர் இல.</span> /
                        Ref. No.
                    </div>
                    <div class="form-reference-value">{{ $text($referenceNumber, 30) }}</div>
                </td>
            </tr>
        </table>

        <table class="ministry-table page-break-avoid">
            <tr>
                <td class="ministry-line compact">
                    <table class="no-border" style="width: 100%;">
                        <tr>
                            <td rowspan="2" style="width: 160mm; vertical-align: middle;">
                                <span class="label-local">Secretary to Ministry of</span>&nbsp;<span
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
                    <span class="label-local">Copy to : Auditor - General</span>
                </td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="h-12 compact" style="width: 57mm;">
                    <div class="field-title">
                        <span class="label-local section-sinhala-title" lang="si">1. දෙපාර්තමේන්තුව /
                            සංස්ථාව</span><br>
                        <span class="label-local" lang="ta">1. திணைக்களம் / கூட்டுத்தாபனம்</span><br>
                        <span class="label-local">Department / Corporation</span>
                    </div>
                </td>
                <td class="h-12 response" style="width: 143mm;">
                    {{ $text(data_get($documentData, 'department', ''), 180) }}</td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="field-topic-cell" style="width: 130mm; height: 8mm;">
                    <span class="label-local section-sinhala-title" lang="si">2. ප්‍රාරම්භක වාර්තාව : යොමු
                        අංක</span> /
                    <span class="label-local" lang="ta">தொடக்க அறிக்கை - தொடர் இல.</span> /
                    <span class="label-local">Preliminary Report : Ref. No.</span>
                </td>
                <td class="field-topic-cell" style="width: 70mm; height: 8mm;">
                    <span class="label-local" lang="si">දිනය</span> /
                    <span class="label-local" lang="ta">திகதி</span> /
                    <span class="label-local">Date</span>
                </td>
            </tr>
            <tr>
                <td class="field-content-cell" style="width: 130mm; height: 12mm;">
                    {{ $text(data_get($documentData, 'preliminaryReportRefNo', ''), 60) }}</td>
                <td class="field-content-cell" style="width: 70mm; height: 12mm;">
                    {{ $text(data_get($documentData, 'preliminaryReportDate', ''), 30) }}</td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="field-topic-cell" style="width: 60mm; height: 10mm;" colspan="3">
                    <span class="label-local section-sinhala-title" lang="si">3. අලාභය පිළිබඳ විස්තර</span> /
                    <span class="label-local" lang="ta">இழப்பின் விபரம்</span> /
                    <span class="label-local">Particulars of Loss</span>
                </td>
            </tr>
            <tr>
                <td class="field-topic-cell" style="width: 45mm;"><span class="label-local"
                        lang="si">දිනය</span>
                    / <span class="label-local" lang="ta">திகதி</span> / <span class="label-local">Date</span>
                </td>
                <td class="field-topic-cell" style="width: 40mm;"><span class="label-local"
                        lang="si">වේලාව</span> / <span class="label-local" lang="ta">நேரம்</span> / <span
                        class="label-local">Time</span></td>
                <td class="field-topic-cell" style="width: 115mm;"><span class="label-local" lang="si">සිදුවූ
                        ස්ථානය</span> / <span class="label-local" lang="ta">இடம்</span> / <span
                        class="label-local">Location</span></td>
            </tr>
            <tr>
                <td class="field-content-cell" style="width: 45mm; height: 12mm;">
                    {{ $text(data_get($documentData, 'lossDate', ''), 30) }}</td>
                <td class="field-content-cell" style="width: 40mm; height: 12mm;">
                    {{ $text(data_get($documentData, 'lossTime', ''), 20) }}</td>
                <td class="field-content-cell" style="width: 115mm; height: 12mm;">
                    {{ $text(data_get($documentData, 'location', ''), 90) }}</td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="field-topic-cell" style="height: 11mm;">
                    <span class="label-local section-sinhala-title" lang="si">4. අලාභය සිදුවීමට හේතුවූ
                        කරුණු</span><br>
                    <span class="label-local" lang="ta">இழப்பு ஏற்பட்ட சூழ்நிலைகள்</span><br>
                    <span class="label-local">Circumstances in which the loss occurred -</span>
                </td>
            </tr>
            <tr>
                <td class="field-content-cell" style="height: 14mm;">
                    {{ $text(data_get($documentData, 'circumstances', ''), 250) }}</td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="field-topic-cell" style="height: 14mm;">
                    <span class="label-local section-sinhala-title" lang="si">5. වංචාවක්, නොසැලකිල්ලක්,
                        අතපසුවීමක්, ප්‍රමාදයක් හෝ වෙනත් වරදක් හේතු කොට ද යන්න</span><br>
                    <span class="label-local" lang="ta">மோசடி, கவனயீனம், தாமதம், தவறுதல் அல்லது பிற பிழை காரணமாக
                        ஏற்பட்டதா ?</span><br>
                    <span class="label-local">Is it due to fraud, negligence, delay, ommissions or other fault ?</span>
                </td>
            </tr>
            <tr>
                <td class="field-content-cell" style="height: 10mm;">
                    {{ $text(data_get($documentData, 'causeOfLoss', ''), 200) }}</td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="field-topic-cell" style="height: 11mm;">
                    <span class="label-local section-sinhala-title" lang="si">6. පොලිස් වාර්තාවේ සාරාංශය
                        (වාර්තාවේ පිටපතක් අමුණන්න)</span><br>
                    <span class="label-local" lang="ta">பொலிஸ் அறிக்கையின் சுருக்கம் (அறிக்கையின் பிரதியொன்றை
                        இணைக்கவும்)</span><br>
                    <span class="label-local">Summary of Police Report (annex a copy of the Report.)</span>
                </td>
            </tr>
            <tr>
                <td class="field-content-cell" style="height: 20mm;">
                    {{ $text(data_get($documentData, 'policeReportSummary', ''), 260) }}
                </td>
            </tr>
        </table>

    </div>

    <div class="page page-2">

        <table rotate="-90" style="width: 277mm; border: 0;">
            <tr>
                <td style="width: 277mm; border: 0; padding: 0;">
                    <table class="page-break-avoid">
                        <tr>
                            <th class="h-13 table-header header-cell" style="width: 200mm;" colspan="7">
                                <span lang="si">7. නැතිවූ භාණ්ඩවල විස්තර</span><br>
                                <span lang="ta">7. இழந்த பொருட்களின் விபரம்</span><br>
                                Details of Items Lost
                            </th>
                        </tr>
                        <tr>
                            <th class="h-13 table-header header-cell" style="width: 40mm;">
                                <span lang="si">7(1) විස්තර</span><br>
                                <span lang="ta">7(1) விபரம்</span><br>
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
                                <span lang="si">7(4) අලාභය සිදුවූ අවස්ථාවේ දළ හෝ තක්සේරු පිරිවැය</span><br>
                                <span lang="ta">7(4) மதிப்பீட்டுச் செலவு</span><br>
                                Approximate or estimated cost at time of loss
                            </th>
                            <th class="h-13 table-header header-cell" style="width: 32mm;">
                                <span lang="si">7(5) ප්‍රතිස්ථාපන අගය හෝ අලුත්වැඩියා කිරීමේ වියදම</span><br>
                                <span lang="ta">7(5) மாற்று மதிப்பு</span><br>
                                Replacement value or cost of repairs
                            </th>
                            <th class="h-13 table-header header-cell" style="width: 32mm;">
                                <span lang="si">7(6) මූ. රෙ. 105 (1) යටතේ වටිනාකම</span><br>
                                <span lang="ta">7(6) நி.பி.105(1)</span><br>
                                Value in terms of F. R. 105 (1)
                            </th>
                            <th class="h-13 table-header header-cell" style="width: 32mm;">
                                <span lang="si">7(7) මුල් පිරිවැය</span><br>
                                <span lang="ta">7(7) மூலச் செலவு</span><br>
                                Original Cost
                            </th>
                        </tr>
                        @foreach ($itemSlots as $item)
                            <tr>
                                <td class="repeating-item-row-cell" style="width: 40mm;">
                                    {{ $text(data_get($item, 'description', ''), 60) }}</td>
                                <td class="repeating-item-row-cell" style="width: 16mm; text-align: center;">
                                    {{ $text(data_get($item, 'unit', ''), 15) }}</td>
                                <td class="repeating-item-row-cell" style="width: 16mm; text-align: center;">
                                    {{ $text(data_get($item, 'quantity', ''), 15) }}</td>
                                <td class="repeating-item-row-cell" style="width: 32mm; text-align: right;">
                                    {{ $text(data_get($item, 'estimatedCost', ''), 20) }}</td>
                                <td class="repeating-item-row-cell" style="width: 32mm; text-align: right;">
                                    {{ $text(data_get($item, 'replacementCost', ''), 20) }}</td>
                                <td class="repeating-item-row-cell" style="width: 32mm; text-align: right;">
                                    {{ $text(data_get($item, 'fr105Value', ''), 20) }}</td>
                                <td class="repeating-item-row-cell" style="width: 32mm; text-align: right;">
                                    {{ $text(data_get($item, 'originalCost', ''), 20) }}</td>
                            </tr>
                        @endforeach
                        <tr>
                            <td colspan="6" class="item-total-row" style="text-align: right;">
                                <span lang="si">මුළු වටිනාකම</span> / <span lang="ta">மொத்தப் பெறுமதி</span>
                                / Total Value
                            </td>
                            <td class="item-total-row" style="text-align: right;">
                                {{ number_format($totalOriginalCost, 2) }}</td>
                        </tr>
                    </table>

                    <table class="page-break-avoid" style="margin-top: 3mm;">
                        <tr>
                            <th class="h-13 table-header header-cell" style="width: 200mm;" colspan="5">
                                <span lang="si">8. වගකිවයුතු නිලධාරීන් -</span><br>
                                <span lang="ta">8. பொறுப்பான உத்தியோகத்தர்கள் -</span><br>
                                Officers Responsible -
                            </th>
                        </tr>
                        <tr>
                            <th class="h-12 table-header header-cell" style="width: 40mm;">
                                <span lang="si">8(1) නම</span><br>
                                <span lang="ta">8(1) பெயர்</span><br>
                                Name
                            </th>
                            <th class="h-12 table-header header-cell" style="width: 40mm;">
                                <span lang="si">8(2) පදවිය</span><br>
                                <span lang="ta">8(2) பதவிப் பெயர்</span><br>
                                Designation
                            </th>
                            <th class="h-12 table-header header-cell" style="width: 45mm;">
                                <span lang="si">8(3) වගකීමේ ස්වභාවය</span><br>
                                <span lang="ta">8(3) பொறுப்பின் தன்மை</span><br>
                                Nature of Responsibility
                            </th>
                            <th class="h-12 table-header header-cell" style="width: 40mm;">
                                <span lang="si">8(4) නිලධාරියාට විරුද්ධව විනයානුකූලව කටයුතු කර ඇත්ද?</span><br>
                                <span lang="ta">8(4) உத்தியோகத்தருக்கு எதிராக ஒழுக்காற்று நடவடிக்கை
                                    எடுக்கப்பட்டதா?</span><br>
                                Was disciplinary action taken against the officer ?
                            </th>
                            <th class="h-12 table-header header-cell" style="width: 35mm;">
                                <span lang="si">8(5) දඬුවම පිළිබඳ විස්තර</span><br>
                                <span lang="ta">8(5) தண்டனையின் விபரம்</span><br>
                                Details of Punishment
                            </th>
                        </tr>
                        @foreach ($officerSlots as $officer)
                            <tr>
                                <td class="repeating-compact-row-cell response" style="width: 40mm;">
                                    {{ $text(data_get($officer, 'name', ''), 40) }}</td>
                                <td class="repeating-compact-row-cell response" style="width: 40mm;">
                                    {{ $text(data_get($officer, 'designation', ''), 40) }}</td>
                                <td class="repeating-compact-row-cell response" style="width: 45mm;">
                                    {{ $text(data_get($officer, 'responsibility', ''), 45) }}</td>
                                <td class="repeating-compact-row-cell response"
                                    style="width: 40mm; text-align: left;">
                                    {{ $text(data_get($officer, 'disciplinaryAction', ''), 30) }}</td>
                                <td class="repeating-compact-row-cell response" style="width: 35mm;">
                                    {{ $text(data_get($officer, 'punishment', ''), 30) }}</td>
                            </tr>
                        @endforeach
                    </table>

                </td>
            </tr>
        </table>
    </div>

    <div class="page page-3">

        <table class="page-break-avoid">
            <tr>
                <td class="field-topic-cell" style="height: 11mm;" colspan="2">
                    <span class="label-local section-sinhala-title" lang="si">9. ගන්නා ලද නීතිමය ක්‍රියාමාර්ග
                        පිළිබඳ විස්තර</span><br>
                    <span class="label-local" lang="ta">9. எடுக்கப்பட்ட சட்ட நடவடிக்கைகளின் விபரம்</span><br>
                    <span class="label-local">Details of legal action taken -</span>
                </td>
            </tr>
            <tr>
                <td class="field-topic-cell" style="width: 90mm; height: 8mm;">
                    <span class="label-local" lang="si">අධිකරණයේ නම</span> /
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
                <td class="field-content-cell" style="width: 90mm; height: 12mm;">
                    {{ $text(data_get($documentData, 'courtName', ''), 70) }}</td>
                <td class="field-content-cell" style="width: 60mm; height: 12mm;">
                    {{ $text(data_get($documentData, 'courtCaseNo', ''), 40) }}</td>
            </tr>
            <tr>
                <td class="field-topic-cell" style="height: 8mm;" colspan="2">
                    <span class="label-local" lang="si">අධිකරණයේ නියෝගය (පිටපතක් අමුණන්න)</span> /
                    <span class="label-local" lang="ta">நீதிமன்றக் கட்டளை (பிரதி இணைக்க)</span> /
                    <span class="label-local">Order of Court (Annex a copy)</span>
                </td>
            </tr>
            <tr>
                <td class="field-content-cell" style="height: 12mm;" colspan="2">
                    {{ $text(data_get($documentData, 'courtOrderSummary', ''), 180) }}
                </td>
            </tr>
        </table>

        <table class="page-break-avoid" style="margin-top: 3mm;">
            <tr>
                <th class="h-13 table-header header-cell" style="width: 200mm;" colspan="3">
                    <span lang="si">10. වගකිවයුතු නිලධාරීන්ගෙන් අයකර ගැනීමට තීරණය කරන ලද මුදල් ප්‍රමාණය</span> /
                    <span lang="ta">இழப்புக்குப் பொறுப்பான உத்தியோகத்தர்களிடமிருந்து அறவிடுவதற்கெனத்
                        தீர்மானிக்கப்பட்ட தொகை</span> /<br>
                    Amount decided to be recovered from the officers responsible -
                </th>
            </tr>
            <tr>
                <th class="h-12 table-header header-cell" style="width: 70mm;" colspan="1">
                    <span lang="si">නිලධාරියාගේ නම</span><br>
                    <span lang="ta">உத்தியோகத்தர் பெயர்</span><br>
                    Name of Officer
                </th>
                <th class="h-12 table-header header-cell" style="width: 50mm;">
                    <span lang="si">අයකර ගැනීමට ඇති මුදල</span><br>
                    <span lang="ta">அறவிட வேண்டிய தொகை</span><br>
                    Amount to be recovered
                </th>
                <th class="h-12 table-header header-cell" style="width: 80mm;">
                    <span lang="si">අයකර ගන්නා පිළිවෙල</span><br>
                    <span lang="ta">எவ்வாறு அறவிட வேண்டும் என்பது</span><br>
                    How recovery is to be made
                </th>
            </tr>
            @foreach ($recoverySlots as $recovery)
                <tr>
                    <td class="recovery-row-cell" style="width: 70mm;">
                        {{ $text(data_get($recovery, 'officer', ''), 40) }}
                    </td>
                    <td class="recovery-row-cell" style="width: 50mm; text-align: right;">
                        {{ $text(data_get($recovery, 'amount', ''), 25) }}
                    </td>
                    <td class="recovery-row-cell" style="width: 80mm;">
                        {{ $text(data_get($recovery, 'method', ''), 55) }}
                    </td>
                </tr>
            @endforeach
        </table>

        <table class="page-break-avoid insurance-table" style="margin-top: 3mm;">
            <tr>
                <td class="insurance-title" colspan="3">
                    <span class="label-local section-sinhala-title" lang="si">11. රක්ෂණයකින් හෝ ඇප සහතිකයකින්
                        අයකර ගත හැකි ප්‍රමාණය</span> /
                    <span class="label-local" lang="ta">காப்புறுதி/ உத்தரவாதத்திலிருந்து அறவிடக்கூடிய தொகை</span>
                    /
                    <span class="label-local">Amount recoverable from insurance/</span><br>
                    <span class="label-local">guarantee -</span>
                </td>
            </tr>
            <tr>
                <td class="insurance-words" colspan="3">
                    <table class="insurance-words-grid">
                        <tr>
                            <td style="width: 39mm;">
                                <span class="insurance-words-label">
                                    <span lang="si">(මුදල අකුරින්) රුපියල්</span><br>
                                    <span lang="ta">(தொகை எழுத்தில்) ரூபா</span><br>
                                    (Amount in words) Rupees
                                </span>
                            </td>
                            <td style="width: 7mm;"><span class="insurance-brace">}</span></td>
                            <td><span
                                    class="insurance-dotted-value">{{ $text(data_get($documentData, 'insuranceRecoverableAmountWords', ''), 100) }}</span>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td class="insurance-heading insurance-divider" style="width: 40mm;">
                    <span lang="si">ඔප්පුපත් අංකය</span> / <span lang="ta">காப்புறுதி இல.</span> /<br>Policy
                    No.
                </td>
                <td class="insurance-heading insurance-divider" style="width: 115mm;">
                    <span lang="si">රක්ෂණය කරන ලද මුදල</span> / <span lang="ta">காப்புறுதி செய்யப்பட்ட
                        தொகை</span> / Amount Insured for
                </td>
                <td class="insurance-heading" style="width: 45mm;">
                    <span lang="si">අයකරගත හැකි මුදල</span> / <span lang="ta">அறவிடக் கூடிய தொகை</span> /
                    Amount recoverable
                </td>
            </tr>
            <tr>
                <td class="insurance-value insurance-divider" style="width: 40mm;">
                    {{ $text(data_get($documentData, 'policyNo', ''), 25) }}</td>
                <td class="insurance-value insurance-divider" style="width: 115mm;">
                    {{ $text(data_get($documentData, 'amountInsured', ''), 25) }}</td>
                <td class="insurance-value" style="width: 45mm;">
                    {{ $text(data_get($documentData, 'amountRecoverable', ''), 25) }}</td>
            </tr>
        </table>

        <table class="page-break-avoid" style="margin-top: 3mm;">
            <tr>
                <th class="h-13 table-header header-cell" style="width: 200mm;" colspan="2">
                    <span lang="si">12. මූ. රෙ. 104 (1) බී යටතේ පත් කරන ලද පරීක්ෂණ මණ්ඩලය සැදී ඇති
                        ආකාරය</span><br>
                    <span lang="ta">நி. பி. 104 (1) பீ இன் பிரகாரம் நியமித்த விசாரணைச் சபையின் அமைப்பு</span><br>
                    Composition of Board of Inquiry appointed in terms of F. R. 104 (1) b
                </th>
            </tr>
            <tr>
                <th class="h-12 table-header header-cell" style="width: 120mm;">
                    <span lang="si">මණ්ඩලයේ සාමාජිකයින්ගේ නම්</span> / <span lang="ta">சபை உறுப்பினரின்
                        பெயர்</span> / Names of members of the Board
                </th>
                <th class="h-12 table-header header-cell" style="width: 80mm;">
                    <span lang="si">පදවිය</span> / <span lang="ta">பதவிப் பெயர்</span> / Designations
                </th>
            </tr>
            @foreach ($boardMemberSlots as $member)
                <tr>
                    <td class="repeating-compact-row-cell response" style="width: 120mm;">
                        {{ $text(data_get($member, 'memberName', ''), 70) }}</td>
                    <td class="repeating-compact-row-cell response" style="width: 80mm;">
                        {{ $text(data_get($member, 'designation', ''), 70) }}</td>
                </tr>
            @endforeach
        </table>

    </div>

    <div class="page page-4">

        <table class="page-break-avoid">
            <tr>
                <td class="field-topic-cell" style="height: 11mm;">
                    <span class="label-local section-sinhala-title" lang="si">13. විමර්ශන මණ්ඩලයේ නිර්දේශ
                        (වාර්තාවේ පිටපතක් අමුණන්න)</span><br>
                    <span class="label-local" lang="ta">விசாரணைச் சபையின் விதப்புரைகள் (அறிக்கையின் பிரதியை
                        இணைக்க)</span><br>
                    <span class="label-local">Recommendations of the Board of Inquiry (Annex copy of report)</span>
                </td>
            </tr>
            <tr>
                <td class="field-content-cell" style="height: 12mm;">
                    {{ $text(data_get($documentData, 'boardReportSummary', ''), 180) }}
                </td>
            </tr>
        </table>

        <table class="page-break-avoid">
            <tr>
                <td class="field-topic-cell" style="height: 12mm;">
                    <span class="label-local" lang="si">14. අනාගතයේ දී මෙවැනි අලාභයන් සිදුවීම වැළැක්වීමට යොදා ඇති
                        හෝ යොදනු ලබන පියවරවල්</span> / <span class="label-local" lang="ta">எதிர்காலத்தில் இது
                        போன்ற இழப்புக்களைத் தடுப்பதற்கு எடுத்துள்ள அல்லது உத்தேசித்துள்ள நடவடிக்கைகள்</span> /<br>
                    <span class="label-local">Steps taken or proposed to be taken to prevent similar losses in the
                        future</span>
                </td>
            </tr>
            <tr>
                <td class="field-content-cell" style="height: 23mm;">
                    {{ $text(data_get($documentData, 'preventiveActions', ''), 320) }}</td>
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

        <table class="no-border signature-full-width page-three-approval-signatures page-break-avoid">
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
                                            <img class="signature-grid-image"
                                                src="{{ data_get($signatureRow['signature'], 'signature_data_uri') }}"
                                                alt="{{ $text($signatureRow['label'], 45) }} signature">
                                        @endif
                                    </div>
                                    <div class="signature-grid-name">
                                        {{ $text(data_get($signatureRow['signature'], 'name', ''), 45) }}</div>
                                    <div class="signature-grid-label">
                                        {{ $text(data_get($signatureRow['signature'], 'role') ?: $signatureRow['label'], 45) }}
                                    </div>
                                    @if ($signatureRow['show_institution'] ?? true)
                                        <div class="signature-grid-institution">
                                            {{ data_get($signatureRow['signature'], 'institution', '') }}</div>
                                    @endif
                                    @if (data_get($signatureRow['signature'], 'signature_data_uri'))
                                        <div class="signature-grid-date"><span
                                                lang="si">&#x0DAF;&#x0DD2;&#x0DB1;&#x0DBA;</span> / <span
                                                lang="ta">&#x0BA4;&#x0BBF;&#x0B95;&#x0BA4;&#x0BBF;</span> / Date /
                                            {{ $signatureDate(data_get($signatureRow['signature'], 'approved_at')) }}
                                        </div>
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
            <table class="no-border signature-full-width signature-ministry-single page-three-approval-signatures page-break-avoid">
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
                                            <img class="signature-grid-image"
                                                src="{{ data_get($signatureRow['signature'], 'signature_data_uri') }}"
                                                alt="{{ $text($signatureRow['label'], 45) }} signature">
                                        @endif
                                    </div>
                                    <div class="signature-grid-name">
                                        {{ $text(data_get($signatureRow['signature'], 'name', ''), 45) }}</div>
                                    <div class="signature-grid-label">
                                        {{ $text(data_get($signatureRow['signature'], 'role') ?: $signatureRow['label'], 45) }}
                                    </div>
                                    @if ($signatureRow['show_institution'] ?? true)
                                        <div class="signature-grid-institution">
                                            {{ data_get($signatureRow['signature'], 'institution', '') }}</div>
                                    @endif
                                    @if (data_get($signatureRow['signature'], 'signature_data_uri'))
                                        <div class="signature-grid-date"><span
                                                lang="si">&#x0DAF;&#x0DD2;&#x0DB1;&#x0DBA;</span> / <span
                                                lang="ta">&#x0BA4;&#x0BBF;&#x0B95;&#x0BA4;&#x0BBF;</span> / Date /
                                            {{ $signatureDate(data_get($signatureRow['signature'], 'approved_at')) }}
                                        </div>
                                    @endif
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                @if (!$loop->last)
                    <tr class="signature-full-separator">
                        <td style="width: 200mm;">&nbsp;</td>
                    </tr>
                @endif
            </table>
        @endforeach

    </div>
</body>

</html>

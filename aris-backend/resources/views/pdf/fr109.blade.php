<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
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
            div {
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
            .page-3 {
                height: 270mm;
                position: relative;
            }
            .page-three-section-seven-value {
                height: 58mm !important;
            }
            .page-three-section-eight-action-value {
                height: 44mm !important;
            }
            .page-three-section-eight-result-value {
                height: 32mm !important;
            }
            .page-three-approval-signatures {
                width: 200mm;
                margin-top: 1mm;
                table-layout: fixed;
            }
            .page-three-approval-signatures > tbody > tr {
                height: 21mm;
            }
            .page-three-approval-signatures > tbody > tr.page-three-signature-separator {
                height: 1mm;
            }
            .page-three-approval-signatures > tbody > tr.page-three-signature-separator-gap {
                height: 1.5mm;
            }
            .page-three-approval-signatures td {
                border: 0;
                padding: 0;
            }
            .page-three-approval-signatures .page-three-signature-card {
                height: 21mm;
                vertical-align: bottom;
                padding-left: 4mm;
                text-align: right;
            }
            .page-three-approval-signatures .page-three-signature-comment {
                height: 21mm;
                vertical-align: middle;
                padding-right: 4mm;
                font-size: 8pt;
                line-height: 1.15;
                text-align: right;
                overflow: hidden;
            }
            .page-three-approval-signatures .page-three-signature-separator td {
                height: 1mm;
                padding: 0 !important;
                vertical-align: middle;
                border-top: 0.35mm solid #000 !important;
            }
            .page-three-approval-signatures .page-three-signature-separator-gap td {
                height: 1.5mm;
                padding: 0 !important;
                border: 0 !important;
            }
            .page-three-approval-signatures .signature-space {
                height: 8mm !important;
                text-align: right;
                line-height: 0;
            }
            .page-three-approval-signatures .approval-signature-image {
                width: 28mm !important;
                height: 8mm !important;
                object-fit: contain;
            }
            .page-three-approval-signatures .signature-dots {
                font-size: 6.8pt;
                line-height: 1;
            }
            .page-three-approval-signatures .signature-approver-name,
            .page-three-approval-signatures .signature-role,
            .page-three-approval-signatures .signature-institution,
            .page-three-approval-signatures .signature-extra-line,
            .page-three-approval-signatures .signature-date {
                font-size: 6.8pt;
                line-height: 1;
                text-align: right;
            }
            .page-three-approval-signatures .signature-approver-name {
                margin-bottom: 0;
            }
            table {
                width: 100%;
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
            .label {
                font-size: 8.5pt;
                line-height: 1.05;
            }
            [lang="si"] {
                font-family: iskoolapota, sans-serif;
                font-weight: normal !important;
            }
            [lang="ta"] {
                font-family: notosanstamil, sans-serif;
                font-size: 7.5pt;
                line-height: 1.02;
                font-weight: normal !important;
            }
            .small {
                font-size: 7.6pt;
                line-height: 1.03;
            }
            .header {
                font-size: 8.5pt;
                font-weight: bold;
                text-align: center;
                vertical-align: middle;
            }
            .table-header-sinhala {
                font-size: 9.5pt;
                font-weight: normal !important;
                line-height: 1.02;
            }
            .form-header-title {
                height: 50mm;
                padding: 0 !important;
                overflow: visible !important;
                text-align: center;
                vertical-align: middle;
            }
            .form-title-si {
                font-size: 14pt;
                font-weight: bold;
                line-height: 1;
            }
            .form-title-ta {
                font-size: 10pt;
                line-height: 1.06;
            }
            .form-title-en {
                font-family: dejavuserifcondensed, serif;
                font-size: 9pt;
                line-height: 1.02;
            }
            .admin {
                height: 14mm;
                text-align: right;
                vertical-align: top;
            }
            .admin-block {
                display: inline-block;
                width: 45mm;
                text-align: right;
                font-size: 7.5pt;
                line-height: 1.02;
            }
            .form-reference {
                padding: 3mm 3.5mm !important;
                vertical-align: middle;
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
            .section-title {
                font-size: 8.5pt;
                padding: 1.5mm 0;
                border-left: 0;
                border-right: 0;
            }
            .section-sinhala-title {
                font-size: 9.5pt;
                font-weight: normal !important;
            }
            .section-title > [lang="si"] {
                font-size: 9.5pt;
                font-weight: normal !important;
                line-height: 1.02;
            }
            .subsection-sinhala-title {
                font-size: 9.5pt;
                font-weight: normal !important;
                line-height: 1.05;
            }

            .multilingual-section-heading {
                font-size: 8.5pt;
                line-height: 1.05;
            }
            .field-nine-title {
                padding: 1.5mm 5mm 1mm;
                border-bottom: 0;
                line-height: 1.08;
            }
            .field-nine-body,
            .field-nine-body td {
                border: 0;
            }
            .field-nine-body {
                border-bottom: 0.25mm solid #000;
            }
            .field-nine-secretary {
                border-left: 0 !important;
                border-right: 0 !important;
                border-bottom: 0 !important;
                padding: 1.5mm 7mm 1mm;
                vertical-align: middle;
            }
            .field-nine-secretary-caption {
                position: relative;
                border-left: 0.25mm solid #000 !important;
                padding: 1.2mm 2mm !important;
                text-align: center;
                vertical-align: middle;
                font-size: 8pt;
                line-height: 1.04;
            }
            .field-nine-caption-brace {
                display: table-cell;
                font-family: dejavuserifcondensed, serif;
                font-size: 14pt;
                line-height: 1;
                vertical-align: middle;
            }
            .brace-caption-wrap {
                display: table;
                margin: 0 auto;
            }
            .brace-caption-text {
                display: table-cell;
                padding-left: 1.5mm;
                text-align: center;
                vertical-align: middle;
            }
            .brace-caption-text span {
                display: block;
            }
            .field-nine-date {
                padding: 2mm 7mm 2.5mm;
                vertical-align: bottom;
            }
            .field-nine-brace {
                padding: 1mm 0 0 !important;
                font-family: dejavuserifcondensed, serif;
                font-size: 34pt;
                line-height: 0.65;
                vertical-align: middle;
            }
            .field-nine-date-brace {
                padding: 0 0 2.5mm !important;
                vertical-align: bottom;
            }
            .field-nine-date-value {
                padding-bottom: 2.5mm !important;
                vertical-align: bottom;
            }
            .field-nine-dots {
                display: inline-block;
                color: #000;
                font-family: dejavuserifcondensed, serif;
                font-size: 8pt;
                letter-spacing: 0.1mm;
                white-space: nowrap;
            }
            .field-nine-signature {
                padding: 1mm 5mm 2.5mm;
                text-align: right;
                vertical-align: bottom;
                font-size: 8.5pt;
                line-height: 1.04;
            }
            .field-nine-signature-line {
                height: 10mm;
                border-bottom: 0.25mm dotted #000;
            }
            .field-nine-signature .signature-space {
                height: 10mm !important;
                text-align: right;
            }
            .field-nine-signature .approval-signature-image {
                width: 32mm !important;
                height: 10mm !important;
            }
            .field-nine-pd-signature-space {
                height: 10mm !important;
            }
            .field-nine-pd-signature-image {
                width: 32mm !important;
                height: 10mm !important;
            }
            .field-nine-signature .field-nine-signature-line {
                height: 2mm;
            }
            .field-ten-title {
                padding: 1.5mm 5mm 1mm;
                border-bottom: 0;
                line-height: 1.08;
            }
            .page-4 > table:nth-of-type(3) > tr:first-child > td,
            .page-4 > table:nth-of-type(3) > tbody > tr:first-child > td {
                padding: 1.5mm 5mm 1mm;
                border-bottom: 0;
                line-height: 1.08;
            }
            .field-ten-body,
            .field-ten-body td {
                border: 0;
            }
            .field-ten-body {
                height: 30mm;
                border-bottom: 0;
            }
            .field-ten-reference {
                padding: 2mm 12mm 0 !important;
                vertical-align: top;
            }
            .field-ten-reference-label {
                display: inline-block;
                width: 13mm;
                text-align: center;
                line-height: 1.02;
                vertical-align: middle;
            }
            .field-ten-reference-brace {
                display: inline-block;
                margin: 0 2mm;
                font-family: dejavuserifcondensed, serif;
                font-size: 30pt;
                line-height: 0.65;
                vertical-align: middle;
            }
            .field-ten-reference-value {
                display: inline-block;
                width: 58mm;
                border-bottom: 0.25mm dotted #000;
                vertical-align: middle;
            }
            .field-ten-bottom {
                padding: 2mm 12mm 3mm !important;
                vertical-align: bottom;
            }
            .field-ten-date-label {
                display: inline-block;
                width: 10mm;
                line-height: 1.02;
                vertical-align: middle;
            }
            .field-ten-bottom .field-ten-date-label {
                padding-bottom: 2.5mm !important;
                vertical-align: bottom !important;
            }
            .field-ten-date-value {
                display: inline-block;
                width: 45mm;
                border-bottom: 0.25mm dotted #000;
                vertical-align: middle;
            }
            .field-ten-secretary {
                text-align: right;
                vertical-align: bottom !important;
                padding: 2mm 5mm 3mm !important;
            }
            .field-ten-secretary-line {
                display: inline-block;
                width: 86mm;
                border-bottom: 0.25mm dotted #000;
            }
            .field-ten-reference-row {
                height: 24mm;
            }
            .field-ten-signature-row {
                height: 20mm;
            }
            .field-ten-reference-row td {
                height: 10mm;
            }
            .field-ten-signature-row td {
                height: 20mm;
            }
            .field-eleven-body,
            .field-eleven-body td {
                border: 0 !important;
            }
            .field-eleven-body {
                height: 68mm;
                padding: 0 !important;
                border-top: 0.25mm solid #000 !important;
                border-bottom: 0 !important;
            }
            .field-eleven-top {
                padding: 2mm 8mm 0 !important;
                vertical-align: top;
            }
            .field-eleven-middle {
                padding: 1mm 18mm !important;
                vertical-align: middle;
            }
            .field-eleven-bottom {
                padding: 2mm 12mm !important;
                vertical-align: bottom;
            }
            .field-eleven-bottom .field-ten-date-label {
                padding-bottom: 2mm !important;
                vertical-align: bottom !important;
            }
            .field-eleven-chief-secretary {
                padding: 2mm 5mm !important;
                text-align: right;
                vertical-align: bottom !important;
            }
            .chief-secretary-signature-image {
                width: 32mm !important;
                height: 10mm !important;
                object-fit: contain;
            }
            .chief-secretary-signature-line {
                display: inline-block;
                width: 55mm;
                border-bottom: 0.25mm dotted #000;
            }
            .field-eleven-copy {
                padding: 3mm 0 0 1mm !important;
                font-size: 7pt;
                line-height: 1.02;
                vertical-align: top;
            }
            .value {
                padding: 2mm;
                vertical-align: top;
            }
            .h-8 {
                height: 8mm;
            }
            .h-11 {
                height: 11mm;
            }
            .section-one-label {
                height: 13mm;
                font-size: 8.5pt;
            }
            .section-one-label-si {
                line-height: 1.05;
            }
            .h-16 {
                height: 16mm;
            }
            .h-22 {
                height: 22mm;
            }
            .h-30 {
                height: 30mm;
            }
            .h-42 {
                height: 42mm;
            }
            .h-55 {
                height: 55mm;
            }
            .h-68 {
                height: 68mm;
            }
            .h-78 {
                height: 78mm;
            }
            .h-96 {
                height: 96mm;
            }
            .line {
                height: 7.5mm;
                border-bottom: 0.2mm dotted #777;
                overflow: hidden;
            }
            .credit-particulars-cell {
                height: auto !important;
                min-height: 18mm;
                padding: 1.5mm !important;
                overflow: visible !important;
            }
            .credit-particulars-content {
                height: auto;
                overflow: visible;
                font-family: iskoolapota, sans-serif;
                font-size: 8pt;
                line-height: 1.22;
                overflow-wrap: break-word;
                word-wrap: break-word;
                word-break: normal;
                white-space: normal;
            }
            .section-six-area {
                height: 58mm;
                padding: 0 !important;
                vertical-align: top;
            }
            .section-six-line {
                height: 14.5mm;
                padding: 1.5mm 1.5mm;
                border-bottom: 0.2mm dotted #777;
                overflow: hidden;
                overflow-wrap: break-word;
                word-wrap: break-word;
            }
            .section-six-credit-line {
                height: 14.5mm;
                padding: 1.5mm;
                border-bottom: 0.2mm dotted #777;
                font-family: iskoolapota, sans-serif;
                font-size: 7.5pt;
                line-height: 1.2;
                overflow: hidden;
                white-space: nowrap;
            }
            .section-six-currency-header {
                padding: 0 !important;
            }
            .section-six-currency-header td {
                border-top: 0 !important;
                border-bottom: 0 !important;
                padding: 0.7mm !important;
                text-align: center;
                vertical-align: middle;
                font-size: 8.5pt;
            }
            .section-six-currency-area {
                height: 58mm;
                padding: 0 !important;
            }
            .section-six-currency-area td {
                border-top: 0 !important;
                border-bottom: 0 !important;
                padding: 0 !important;
            }
            .section-six-currency-header .no-border td:first-child,
            .section-six-currency-area .no-border td:first-child {
                border-right: 0.25mm solid #000 !important;
            }
            .currency-split-table {
                border-collapse: collapse;
            }
            .currency-split-table td {
                border: 0 !important;
                padding: 0 !important;
                text-align: center;
                vertical-align: top;
            }
            .currency-split-table td:first-child {
                border-right: 0.25mm solid #000 !important;
            }
            .section-six-data-row > td {
                height: 14.5mm;
                padding: 1.2mm !important;
                border-top: 0 !important;
                border-bottom: 0.2mm dotted #777 !important;
                vertical-align: top;
            }
            .section-six-data-row .currency-split-table td {
                height: 14.5mm;
                border-top: 0 !important;
                border-bottom: 0 !important;
            }
            .section-six-currency-area .section-six-line {
                display: block;
                width: 100%;
                border-bottom: 0.25mm dotted #777 !important;
            }
            .footer {
                border: 0;
                padding-top: 2mm;
                font-size: 7.5pt;
            }
            .signature-space {
                height: 10mm;
                border-bottom: 0;
            }
            .approval-signature-line {
                width: 100%;
                border-bottom: 0.25mm dotted #000;
            }
            .signature-dots {
                display: block;
                color: #000;
                font-family: dejavuserifcondensed, serif;
                font-size: 8pt;
                letter-spacing: 0.1mm;
                line-height: 1;
                white-space: nowrap;
                margin: 0 0 1.5mm;
            }
            .signature-approver-name {
                display: block;
                font-family: dejavuserifcondensed, serif;
                font-size: 8.5pt;
                line-height: 1.15;
                margin: 0 0 0.8mm;
            }
            .signature-role,
            .signature-institution,
            .signature-extra-line {
                display: block;
                font-size: 8.5pt;
                line-height: 1.15;
            }
            .signature-date,
            .signature-card-date {
                font-size: 7.5pt;
                line-height: 1.15;
                white-space: nowrap;
            }
            .field-nine-pd-designation {
                display: block;
                font-size: 8.5pt;
                line-height: 1.15;
                white-space: nowrap;
            }
            .signature-text {
                text-align: center;
                font-size: 8.5pt;
            }
            .signature-comment {
                font-size: 8pt;
                line-height: 1.15;
                text-align: left;
                vertical-align: middle;
            }
            .approval-signature-image {
                width: 32mm !important;
                height: 10mm !important;
                object-fit: contain;
            }
            .ministry-secretary-signature-image {
                width: 32mm !important;
                height: 10mm !important;
                object-fit: contain;
            }
            .ministry-secretary-signature-line {
                display: inline-block;
                width: 68mm;
                border-bottom: 0.25mm dotted #000;
            }
            .page-2 .rotated-form {
                width: 277mm;
                border: 0;
            }
            .page-2 .rotated-form > tbody > tr > td,
            .page-2 .rotated-form > tr > td,
            .page-2 .rotated-form .rotated-container {
                width: 277mm;
                border: 0 !important;
                padding: 0 !important;
            }
            .writeoff td {
                height: 27mm;
            }
            .writeoff .header {
                height: 17mm !important;
                font-size: 8.5pt;
                line-height: 1.02;
            }
        </style>
    </head>
    <body>
        @php $data = (array) data_get($document, 'data', []); $value = static fn
        (string $key, mixed $default = ''): string => trim((string)
        data_get($data, $key, $default)); $officers = collect(data_get($data,
        'surchargedOfficers', []))->filter(fn ($item) =>
        is_array($item))->values()->take(4)->pad(4, []); $properties = collect(data_get($data,
        'properties', []))->filter(fn ($item) => is_array($item))->values(); if ($properties->isEmpty()) {
        $properties = collect([['description' => $value('descriptionOfProperty'), 'quantity' => $value('quantity')]]);
        } $propertySlots = $properties->pad(3, []); $writeOffEntries =
        collect(data_get($data, 'writeOffEntries', []))->filter(fn ($item) =>
        is_array($item))->values()->take(1)->pad(1, []); $reference = (string)
        (data_get($document, 'reference_number') ?: $value('refNo')); $signatureDate = static fn (mixed $date): string => filled($date) ? \Carbon\Carbon::parse($date)->toDateString() : ''; $creditLines = static function (mixed $credit): array { $words = preg_split('/\s+/u', trim((string) $credit), -1, PREG_SPLIT_NO_EMPTY) ?: []; $lines = []; $line = ''; foreach ($words as $word) { $candidate = $line === '' ? $word : $line.' '.$word; if ($line !== '' && mb_strlen($candidate) > 28) { $lines[] = $line; $line = $word; } else { $line = $candidate; } } if ($line !== '') { $lines[] = $line; } return $lines ?: ['']; }; $currencyParts = static function (mixed $amount): array { $amount = trim(str_replace(',', '', (string) $amount)); if ($amount === '') { return ['', '']; } [$rupees, $cents] = array_pad(explode('.', $amount, 2), 2, '00'); return [$rupees, str_pad(substr($cents, 0, 2), 2, '0')]; }; @endphp

        <div class="page page-1">
            <table class="no-border">
                <tr>
                    <td class="admin">
                        <div class="admin-block">
                            <span lang="si">පොදු</span> /
                            <span lang="ta">பொது</span> / General <b>285</b
                            ><br />(F* S., T. &amp; E.) 12/76<br />[A4* S., T.
                            &amp; E.06/2023-Amended]
                        </div>
                    </td>
                </tr>
            </table>

            <table autosize="1">
                <tr>
                    <td class="form-header-title" style="width: 140mm">
                        <div class="form-title-si" style="font-family: iskoolapota, sans-serif; font-size: 14pt; font-weight: bold; line-height: 1;">
                            මූ. රෙ. 109 යටතේ අලාභයන් පොතෙන් කපා හැරීම සඳහා<br />ඉල්ලුම් පත්‍රය
                        </div>
                        <div class="form-title-ta" lang="ta" style="font-family: notosanstamil, sans-serif; font-size: 10pt; line-height: 1.06;">
                            நி. பி. 109 இன் படி இழப்புக்களை பதியறித்ததற்கான<br />விண்ணப்பம்
                        </div>
                        <div class="form-title-en" style="font-family: dejavuserifcondensed, serif; font-size: 9pt; line-height: 1.02;">
                            APPLICATION FOR WRITE OFF OF LOSSES IN TERMS OF F.R. 109
                        </div>
                    </td>
                    <td class="form-reference" style="width: 60mm">
                        <div class="form-reference-label">
                            <span lang="si">යොමු අංකය</span> /
                            <span lang="ta">தொடர் இல.</span> / Ref. No.
                        </div>
                        <div class="form-reference-value">{{ $reference }}</div>
                    </td>
                </tr>
            </table>

            <table>
                <tr>
                    <td style="width: 35mm" class="section-one-label">
                        <span class="section-one-label-si section-sinhala-title" lang="si">1. දෙපාර්තමේන්තුව</span><br /><span
                            class="section-one-label-ta" lang="ta"
                            >திணைக்களம்</span
                        ><br /><span class="section-one-label-en">Department</span>
                    </td>
                    <td class="h-11">{{ $value('department') }}</td>
                </tr>
            </table>

            <table>
                <tr>
                    <td style="width: 35mm" rowspan="3" class="h-30 multilingual-section-heading">
                        <span class="section-sinhala-title" lang="si">2. වාර්තාව</span><br /><span lang="ta"
                            >அறிக்கை</span
                        ><br />Report
                    </td>
                    <td style="width: 110mm" class="h-11">
                        <span lang="si">යොමු අංකය</span> /
                        <span lang="ta">தொடர் இல.</span> / Reference No.
                    </td>
                    <td style="width: 55mm" class="h-11">
                        <span lang="si">දිනය</span><br /><span lang="ta"
                            >திகதி</span
                        ><br />Date
                    </td>
                </tr>
                <tr>
                    <td>
                        <span lang="si">ප්‍රාථමික</span> /
                        <span lang="ta">ஆரம்ப</span> / Preliminary<br />{{
                        $value('preliminaryReportReferenceNo') }}
                    </td>
                    <td>{{ $value('preliminaryDate') }}</td>
                </tr>
                <tr>
                    <td>
                        <span lang="si">අවසාන</span> /
                        <span lang="ta">இறுதி</span> / Final<br />{{
                        $value('finalReportReferenceNo') }}
                    </td>
                    <td>{{ $value('finalDate') }}</td>
                </tr>
            </table>

            <table>
                <tr>
                    <td class="section-title" colspan="2">
                        <span class="section-sinhala-title" lang="si">3. දේපළ පිළිබඳ විස්තර</span> /
                        <span lang="ta">பொருட்களின் விவரம்</span> / Particulars
                        of Property -
                    </td>
                </tr>
                <tr>
                    <td class="header" style="width: 120mm">
                        <span class="table-header-sinhala" lang="si">දේපළ පිළිබඳ විස්තර</span> /
                        <span lang="ta">பொருட்களின் விவரணம்</span> / Description
                        of Property
                    </td>
                    <td class="header" style="width: 80mm">
                        <span class="table-header-sinhala" lang="si">ප්‍රමාණය</span> /
                        <span lang="ta">அளவு</span> / Quantity
                    </td>
                </tr>
                @foreach ($propertySlots as $property)
                    <tr>
                        <td class="value" style="height: 11mm; vertical-align: top;">
                            {{ trim((string) data_get($property, 'description', '')) }}
                        </td>
                        <td class="value" style="height: 11mm; vertical-align: top;">
                            {{ trim((string) data_get($property, 'quantity', '')) }}
                        </td>
                    </tr>
                @endforeach
                <tr>
                    <td class="h-11 multilingual-section-heading">
                        <span class="section-sinhala-title" lang="si">4. මුල් පිරිවැය</span><br /><span
                            lang="ta"
                            >மூலப் பெறுமதி</span
                        ><br />Original Cost
                    </td>
                    <td>{{ $value('originalCost') }}</td>
                </tr>
                <tr>
                    <td class="h-11 multilingual-section-heading">
                        <span class="subsection-sinhala-title" lang="si"
                            >අලාභය සිදු වූ අවස්ථාවේ දළ හෝ තක්සේරු පිරිවැය</span
                        ><br /><span lang="ta"
                            >இழப்பு நேர்ந்தபோது அதன் அண்ணளவான அல்லது
                            மதிப்பிட்ட பெறுமதி</span
                        ><br />Approximate or Estimated cost at time of loss
                    </td>
                    <td>{{ $value('estimatedCostAtTimeOfLoss') }}</td>
                </tr>
                <tr>
                    <td class="h-11 multilingual-section-heading">
                        <span class="subsection-sinhala-title" lang="si"
                            >ප්‍රතිස්ථාපන අගය හෝ අලුත්වැඩියා කිරීමේ වියදම</span
                        ><br /><span lang="ta"
                            >பதிலீடும் செலவு அல்லது திருத்தச் செலவு</span
                        ><br />Replacement value or cost of repairs
                    </td>
                    <td>{{ $value('replacementValue') }}</td>
                </tr>
                <tr>
                    <td class="h-11 multilingual-section-heading">
                        <span class="subsection-sinhala-title" lang="si">මූ. රෙ. 105(1) යටතේ වටිනාකම</span
                        ><br /><span lang="ta"
                            >நி. பி. 105(1) இன் படி பெறுமதி</span
                        ><br />Value in terms of F. R. 105(1)
                    </td>
                    <td>{{ $value('valueUnderFr105') }}</td>
                </tr>
                <tr>
                    <td class="h-11 multilingual-section-heading">
                        <span class="subsection-sinhala-title" lang="si"
                            >වගකියයුතු නිලධාරීන්ගෙන්/රක්ෂණයෙන්/ඇප සහතිකයෙන් අයකර ගන්නා ලද මුදල</span
                        ><br /><span lang="ta"
                            >இதற்குப் பொறுப்பான உத்தியோகத்தர்களிடமிருந்து/
                            காப்புறுதியிலிருந்து/உத்தரவாதத்திலிருந்து அறவிடப்பட்ட தொகை</span
                        ><br />Amount recovered from officers responsible/ Insurance/Guarantee
                    </td>
                    <td>{{ $value('amountRecovered') }}</td>
                </tr>
                <tr>
                    <td class="h-11 multilingual-section-heading">
                        <span class="subsection-sinhala-title" lang="si">වි.වි.හි.ස., රේගුබදු, දෙපාර්තමේන්තු ගාස්තු යනාදිය ඇතුලත්ව ශුද්ධ අලාභය</span><br /><span lang="ta"
                            >அ.செ.ஈ. சா., சுங்கத்தீர்வை, திணைக்களச் செலவுகள் முதலியன உட்பட்ட தேறிய நட்டம்</span
                        ><br />Net Loss inclusive of FEECs, Customs Duty,
                        Departmental charges, etc.,
                    </td>
                    <td>{{ $value('netLoss') }}</td>
                </tr>
            </table>

            {{-- <table class="no-border">
                <tr>
                    <td class="footer">
                        (2023/06) ශ්‍රී ලංකා රජයේ මුද්‍රණ දෙපාර්තමේන්තුව
                        <span style="float: right">1</span>
                    </td>
                </tr>
            </table> --}}
        </div>

        <div class="page page-2">
            <table
                rotate="-90"
                class="rotated-form"
                style="border: 0 !important; outline: 0 !important"
            >
                <tr>
                    <td
                        class="rotated-container"
                        style="border: 0 !important; padding: 0 !important"
                    >
                        <table>
                            <tr>
                                <td class="section-title" style="width: 50%">
                                    <span class="section-sinhala-title" lang="si">5. නීතිමය ක්‍රියාවන්ගේ ප්‍රතිඵල</span>
                                    / <span lang="ta">சட்ட நடவடிக்கைகளின் விளைவு</span> /
                                    Outcome of legal action -
                                </td>
                                <td class="section-title" style="width: 50%">
                                    <span lang="si">උසාවියේ නියෝගය</span> /
                                    <span lang="ta">நீதிமன்றக் கட்டளை</span> /
                                    Order of Court
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0">
                                    <table>
                                        <tr>
                                            <td class="header" style="width: 55%"><span class="table-header-sinhala" lang="si">උසාවියේ නම</span><br /><span lang="ta">நீதி மன்றத்தின் பெயர்</span><br />Name of Court</td>
                                            <td class="header" style="width: 45%"><span class="table-header-sinhala" lang="si">නඩු අංකය</span><br /><span lang="ta">வழக்கு இல.</span><br />Case No.</td>
                                        </tr>
                                        <tr>
                                            <td class="value h-16">{{ $value('nameOfCourt') }}</td>
                                            <td class="value h-16">{{ $value('caseNo') }}</td>
                                        </tr>
                                        @for ($emptyCourtRow = 0; $emptyCourtRow < 2; $emptyCourtRow++)
                                        <tr>
                                            <td class="line">&nbsp;</td>
                                            <td class="line">&nbsp;</td>
                                        </tr>
                                        @endfor
                                    </table>
                                </td>
                                <td class="value h-30">{{ $value('outcomeOfLegalAction') }}</td>
                            </tr>
                        </table>

                        <table style="margin-top: 3mm">
                            <tr>
                                <td class="section-title" colspan="8">
                                    <span class="section-sinhala-title" lang="si">6. නියම කරන ලද අධිභාරයේ විස්තර</span> /
                                    <span lang="ta">விதித்த மேலதிகக் கட்டணங்களின் விவரங்கள்</span> /
                                    Details of surcharges imposed -
                                </td>
                            </tr>
                            <tr>
                                <td class="header" style="width: 65mm">
                                    <span class="table-header-sinhala" lang="si">නිලධාරියාගේ නම</span><br />
                                    <span lang="ta">உத்தியோகத்தரின் பெயர்</span><br />
                                    Name of Officer
                                </td>
                                <td class="header" style="width: 35mm">
                                    <span class="table-header-sinhala" lang="si">තනතුර</span><br />
                                    <span lang="ta">பதவி</span><br />
                                    Designation
                                </td>
                                <td class="header section-six-currency-header" style="width: 25mm">
                                    <span class="table-header-sinhala" lang="si">නියම කරන ලද අධිභාරය</span><br />
                                    <span lang="ta">மேலதிகக் கட்டணத் தொகை</span><br />
                                    Amount surcharged
                                    <table class="currency-split-table"><tr><td class="currency-rupees" style="width: 50%; border-right: 0.4mm solid #000 !important">රු.<br />Rs.</td><td style="width: 50%">ශ.<br />Cts.</td></tr></table>
                                </td>
                                <td class="header section-six-currency-header" style="width: 25mm">
                                    <span class="table-header-sinhala" lang="si">අයකරගන්නා ලද මුදල</span><br />
                                    <span lang="ta">அறவிடப்பட்ட தொகை</span><br />
                                    Amount recovered
                                    <table class="currency-split-table"><tr><td class="currency-rupees" style="width: 50%; border-right: 0.4mm solid #000 !important">රු.<br />Rs.</td><td style="width: 50%">ශ.<br />Cts.</td></tr></table>
                                </td>
                                <td class="header" style="width: 30mm">
                                    <span class="table-header-sinhala" lang="si">අයකරගන්නා ලද දිනය</span><br />
                                    <span lang="ta">அறவிட்ட திகதி</span><br />
                                    Date of recovery
                                </td>
                                <td class="header" style="width: 25mm">
                                    <span class="table-header-sinhala" lang="si">කුවිතාන්සි අංකය</span><br />
                                    <span lang="ta">பற்றுச் சீட்டு இல.</span><br />
                                    Receipt No.
                                </td>
                                <td class="header" style="width: 47mm">
                                    <span class="table-header-sinhala" lang="si">ණය මුදල් පිළිබඳ විස්තර</span><br />
                                    <span lang="ta">வரவு விவரங்கள்</span><br />
                                    Credit particulars
                                </td>
                                <td class="header section-six-currency-header" style="width: 25mm">
                                    <span class="table-header-sinhala" lang="si">අය නොකරන ලද මුදල් ශේෂය</span><br />
                                    <span lang="ta">அறவிடாத மீதி</span><br />
                                    Balance not recovered
                                    <table class="currency-split-table"><tr><td class="currency-rupees" style="width: 50%; border-right: 0.4mm solid #000 !important">රු.<br />Rs.</td><td style="width: 50%">ශ.<br />Cts.</td></tr></table>
                                </td>
                            </tr>
                            @foreach ($officers as $officer)
                            <tr class="section-six-data-row">
                                <td>{{ data_get($officer, 'nameOfOfficer', '') }}</td>
                                <td>{{ data_get($officer, 'designation', '') }}</td>
                                <td style="padding: 0 !important"><table class="currency-split-table"><tr><td style="width: 50%">{{ $currencyParts(data_get($officer, 'amountSurcharged', ''))[0] }}</td><td style="width: 50%">{{ $currencyParts(data_get($officer, 'amountSurcharged', ''))[1] }}</td></tr></table></td>
                                <td style="padding: 0 !important"><table class="currency-split-table"><tr><td style="width: 50%">{{ $currencyParts(data_get($officer, 'amountRecoveredSurcharge', ''))[0] }}</td><td style="width: 50%">{{ $currencyParts(data_get($officer, 'amountRecoveredSurcharge', ''))[1] }}</td></tr></table></td>
                                <td>{{ data_get($officer, 'dateOfRecovery', '') }}</td>
                                <td>{{ data_get($officer, 'receiptNo', '') }}</td>
                                <td style="width: 47mm">{{ data_get($officer, 'creditParticulars', '') }}</td>
                                <td style="padding: 0 !important"><table class="currency-split-table"><tr><td style="width: 50%">{{ $currencyParts(data_get($officer, 'balanceNotRecovered', ''))[0] }}</td><td style="width: 50%">{{ $currencyParts(data_get($officer, 'balanceNotRecovered', ''))[1] }}</td></tr></table></td>
                            </tr>
                            @endforeach
                        </table>

                        {{-- <table class="no-border">
                            <tr>
                                <td class="footer" style="text-align: center">
                                    2
                                </td>
                            </tr>
                        </table> --}}
                    </td>
                </tr>
            </table>
        </div>

        <div class="page page-3">
            <table>
                <tr>
                    <td class="section-title">
                        <span class="section-sinhala-title" lang="si">7. නියමකරන ලද අධිභාරයන් අය නොකිරීමට හේතු</span> /
                        <span lang="ta">விதித்த மேலதிகக் கட்டணங்களை அறவிடாத காரணம்</span> /
                        Reasons for non-recoveries of surcharges imposed -
                    </td>
                </tr>
                <tr>
                    <td class="value page-three-section-seven-value">
                        {{ $value('reasonsForNonRecovery') }}
                    </td>
                </tr>
            </table>

            <table class="page-three-section-eight" style="margin-top: 2mm">
                <tr>
                    <td class="section-title">
                        <span class="section-sinhala-title" lang="si"
                            >8. (අ) නිලධාරියා සේවයේ නොමැති නම් ඔහුගේ වත්කම්වලින් අලාභහානි අයකර ගැනීමට ගන්නා ලද ක්‍රියාමාර්ගයන් පිළිබඳ විස්තර</span
                        ><br /><span lang="ta"
                            >(அ) உத்தியோகத்தர் சேவையிலில்லாவிடின், உத்தியோகத்தரின் சொத்துக்களிலிருந்து அறவிடுவதற்கு எடுத்துள்ள நடவடிக்கை</span
                        ><br />(a) Details of action taken to effect the
                        recovery of shortages from the assets of the officer, if
                        the officer is not in service -
                    </td>
                </tr>
                <tr>
                    <td class="value page-three-section-eight-action-value">
                        {{ $value('actionTakenDetails') }}
                    </td>
                </tr>
                <tr>
                    <td class="section-title">
                        <span lang="si">(ආ) ඉහත ක්‍රියාමාර්ගයේ ප්‍රතිඵල</span
                        ><br /><span lang="ta"
                            >(ஆ)மேற்படி நடவடிக்கையின் விளைவு</span
                        ><br />(b) Results of the above action -
                    </td>
                </tr>
                <tr>
                    <td class="value page-three-section-eight-result-value">{{ $value('resultsOfAction') }}</td>
                </tr>
            </table>

            @php
                $pageThreeApprovalSignatures = [
                    [
                        'signature' => $originatingAccountantSignature,
                        'role' => 'Accountant',
                        'alt' => 'Accountant signature',
                    ],
                    [
                        'signature' => $originatingHeadSignature,
                        'role' => 'Medical Superintendent / Regional Director',
                        'alt' => 'Medical Superintendent or Regional Director signature',
                    ],
                    [
                        'signature' => $pdhsChiefAccountantSignature,
                        'role' => 'Chief Accountant',
                        'alt' => 'Chief Accountant signature',
                        'separate_before' => true,
                    ],
                ];
                $displayedPageThreeApprovalSignatures = array_values(array_filter(
                    $pageThreeApprovalSignatures,
                    fn (array $signatureRow): bool => filled(data_get($signatureRow['signature'], 'signature_data_uri')),
                ));
            @endphp

            <table class="no-border page-three-approval-signatures">
                @foreach ($displayedPageThreeApprovalSignatures as $signatureRow)
                    @php
                        $signature = $signatureRow['signature'];
                        $recordedSignature = data_get($signature, 'signature_data_uri');
                        $role = \Illuminate\Support\Str::title(str_replace('_', ' ', (string) data_get($signature, 'role', '')));
                    @endphp
                    @if (($signatureRow['separate_before'] ?? false) && ! $loop->first)
                        <tr class="page-three-signature-separator-gap"><td colspan="2">&nbsp;</td></tr>
                        <tr class="page-three-signature-separator">
                            <td colspan="2">&nbsp;</td>
                        </tr>
                        <tr class="page-three-signature-separator-gap"><td colspan="2">&nbsp;</td></tr>
                    @endif
                    <tr>
                        <td class="page-three-signature-comment" style="width: 128mm;">
                            {{ \Illuminate\Support\Str::limit(trim((string) data_get($signature, 'comments', '')), 180, '...') }}
                        </td>
                        <td class="page-three-signature-card" style="width: 72mm;">
                            <div class="signature-space">
                                <img class="approval-signature-image" src="{{ $recordedSignature }}" alt="{{ $signatureRow['alt'] }}">
                            </div>
                            <div class="signature-dots">................................................</div>
                            <div class="signature-approver-name">{{ \Illuminate\Support\Str::limit(trim((string) data_get($signature, 'name', '')), 55) }}</div>
                            @if (filled($role))
                                <div class="signature-role">{{ $role }}</div>
                            @endif
                            @if (filled(data_get($signature, 'institution')))
                                <div class="signature-institution">{{ \Illuminate\Support\Str::limit(trim((string) data_get($signature, 'institution')), 70) }}</div>
                            @endif
                            @foreach (array_slice((array) data_get($signature, 'institution_lines', []), 0, 4) as $institutionLine)
                                @if (filled($institutionLine))
                                    <div class="signature-extra-line">{{ \Illuminate\Support\Str::limit(trim((string) $institutionLine), 70) }}</div>
                                @endif
                            @endforeach
                            <div class="signature-date"><span lang="si">&#x0DAF;&#x0DD2;&#x0DB1;&#x0DBA;</span> / <span lang="ta">&#x0BA4;&#x0BBF;&#x0B95;&#x0BA4;&#x0BBF;</span> / Date: {{ $signatureDate(data_get($signature, 'approved_at')) }}</div>
                        </td>
                    </tr>
                @endforeach
            </table>

        </div>

        <div class="page page-4">
            <table>
                <tr>
                    <td class="section-title field-nine-title" style="width: 100%; vertical-align: bottom;">
                        <span class="section-sinhala-title" lang="si"
                            >9. මූ. රෙ. 109 යටතේ දෙපාර්තමේන්තු ප්‍රධානියාගේ හෝ සංස්ථාවේ සභාපතිගේ නිර්දේශය හෝ නියෝගය</span
                        ><br /><span lang="ta"
                            >நி. பி. 109 இன் கீழ் திணைக்களத் தலைவரின் அல்லது கூட்டுத்தாபனத் தவிசாளரது கட்டளை அல்லது விதப்புரை</span
                        ><br />Order recommendation of Head of Department or Chairman
                        of Corporation under F. R. 109 -
                    </td>
                </tr>
                <tr>
                    <td class="field-nine-secretary">
                        <table class="no-border">
                            <tr>
                                <td style="width: 160mm; padding: 0; vertical-align: middle">
                                    * Secretary to the Ministry of
                                    <span lang="si">  ප්‍රධාන අමාත්‍යාංශය</span>
                                    
                                </td>
                                <td class="field-nine-secretary-caption" style="width: 40mm">
                                    <table class="no-border">
                                        <tr>
                                            <td class="field-nine-caption-brace" style="width: 6mm; padding: 0; text-align: left">{</td>
                                            <td style="padding: 0; text-align: center; vertical-align: middle">
                                            <span lang="si">අමාත්‍යාංශයේ ලේකම්</span>
                                            <br /><span lang="ta">அமைச்சின் செயலாளர்</span>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <table class="field-nine-body">
                <tr>
                    <td style="width: 100mm; padding: 0">&nbsp;</td>
                    <td
                        style="width: 100mm"
                        class="field-nine-signature"
                    >
                        <div class="signature-space field-nine-pd-signature-space">
                            @if (data_get($pdhsProvincialDirectorSignature, 'signature_data_uri'))
                                <img class="approval-signature-image field-nine-pd-signature-image" src="{{ data_get($pdhsProvincialDirectorSignature, 'signature_data_uri') }}" alt="Provincial Director signature">
                            @endif
                        </div>
                        <div class="signature-dots">....................................</div>
                        <div class="signature-approver-name">{{ \Illuminate\Support\Str::limit(trim((string) data_get($pdhsProvincialDirectorSignature, 'name', '')), 55) }}</div>
                        @if (filled(data_get($pdhsProvincialDirectorSignature, 'role')))
                            <div class="signature-role">{{ \Illuminate\Support\Str::limit(trim((string) data_get($pdhsProvincialDirectorSignature, 'role')), 70) }}</div>
                        @endif
                        @if (filled(data_get($pdhsProvincialDirectorSignature, 'institution')))
                            <div class="signature-institution">{{ \Illuminate\Support\Str::limit(trim((string) data_get($pdhsProvincialDirectorSignature, 'institution')), 70) }}</div>
                        @endif
                        @foreach (array_slice((array) data_get($pdhsProvincialDirectorSignature, 'institution_lines', []), 0, 4) as $institutionLine)
                            @if (filled($institutionLine))
                                <div class="signature-extra-line">{{ \Illuminate\Support\Str::limit(trim((string) $institutionLine), 70) }}</div>
                            @endif
                        @endforeach
                        @if (data_get($pdhsProvincialDirectorSignature, 'signature_data_uri'))
                            <div class="signature-date"><span lang="si">&#x0DAF;&#x0DD2;&#x0DB1;&#x0DBA;</span> / <span lang="ta">&#x0BA4;&#x0BBF;&#x0B95;&#x0BA4;&#x0BBF;</span> / Date: {{ $signatureDate(data_get($pdhsProvincialDirectorSignature, 'approved_at')) }}</div>
                        @endif
                    </td>
                </tr>
            </table>

            <table style="margin-top: 3mm">
    <tr>
        <td class="section-title">
            <span class="section-sinhala-title" lang="si">10. මූ. රෙ. 108(1) යටතේ ප්‍රධාන ගණන්දීමේ නිලධාරියාගේ නියෝගය හෝ මූ. රෙ. 108(3) යටතේ ප්‍රධාන ගණන්දීමේ නිලධාරියාගේ නිර්දේශය</span><br />
            <span lang="ta">நி. பி. 108(1) இன் கீழ் பிரதான கணக்குப் பொறுப்பு உத்தியோகத்தரின் கட்டளை அல்லது நி. பி. 108 (3) இன் கீழ் பிரதான கணக்குப் பொறுப்பு உத்தியோகத்தரின் விதப்புரை</span><br />
            Order of the Chief Accounting Officer under F. R. 108 (1) or recommendation of Chief Accounting Officer
            under F. R. 108 (3) -
        </td>
    </tr>
    <tr>
        <td class="field-ten-body" style="padding: 0">
            <table class="no-border" style="height: 30mm">
                <tr class="field-ten-reference-row">
                    <td class="field-ten-reference" style="width: 100mm">
                        <table class="no-border">
                            <tr>
                                <td class="field-ten-reference-label" style="width: 14mm; padding: 0">* <span lang="si">භා.ලේ.</span><br /><span lang="ta">எஸ். டி.</span><br />S. T.</td>
                                <td class="field-nine-brace" style="width: 6mm; padding: 0">}</td>
                                <td style="padding: 0; vertical-align: middle"><span class="field-nine-dots">{{ $value('chiefAccountingOfficerSTNo') ?: '.......................................' }}</span></td>
                            </tr>
                        </table>
                    </td>
                    <td class="field-ten-reference" style="width: 100mm; padding-left: 10mm">
                        <table class="no-border">
                            <tr>
                                <td class="field-ten-reference-label" style="width: 14mm; padding: 0"><span lang="si">යොමු අංකය</span><br /><span lang="ta">தொடர் இல.</span><br /><i>Ref. No.</i></td>
                                <td class="field-nine-brace" style="width: 6mm; padding: 0">}</td>
                                <td style="padding: 0; vertical-align: middle"><span class="field-nine-dots">{{ data_get($ministrySecretarySignature, 'signature_data_uri') ? $reference : '.......................................' }}</span></td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr class="field-ten-signature-row">
                    <td class="field-ten-bottom" style="width: 100mm; vertical-align: bottom">&nbsp;</td>
                    <td class="field-ten-secretary" style="width: 100mm; padding-left: 10mm; vertical-align: bottom">
                        <div style="height: 15mm; text-align: center">
                            @if (data_get($ministrySecretarySignature, 'signature_data_uri'))
                                <img class="ministry-secretary-signature-image" src="{{ data_get($ministrySecretarySignature, 'signature_data_uri') }}" alt="Ministry Secretary signature">
                            @endif
                        </div>
                        <div class="signature-dots">....................................</div>
                        <span class="signature-approver-name">{{ \Illuminate\Support\Str::limit(trim((string) data_get($ministrySecretarySignature, 'name', '')), 55) }}</span>
                        @if (filled(data_get($ministrySecretarySignature, 'role')))
                            <div class="signature-role">{{ \Illuminate\Support\Str::limit(trim((string) data_get($ministrySecretarySignature, 'role')), 70) }}</div>
                        @endif
                        @if (filled(data_get($ministrySecretarySignature, 'institution')))
                            <div class="signature-institution">{{ \Illuminate\Support\Str::limit(trim((string) data_get($ministrySecretarySignature, 'institution')), 70) }}</div>
                        @endif
                        @foreach (array_slice((array) data_get($ministrySecretarySignature, 'institution_lines', []), 0, 4) as $institutionLine)
                            @if (filled($institutionLine))
                                <div class="signature-extra-line">{{ \Illuminate\Support\Str::limit(trim((string) $institutionLine), 70) }}</div>
                            @endif
                        @endforeach
                        @if (data_get($ministrySecretarySignature, 'signature_data_uri'))
                            <div class="signature-date"><span lang="si">&#x0DAF;&#x0DD2;&#x0DB1;&#x0DBA;</span> / <span lang="ta">&#x0BA4;&#x0BBF;&#x0B95;&#x0BA4;&#x0BBF;</span> / Date: {{ $signatureDate(data_get($ministrySecretarySignature, 'approved_at')) }}</div>
                        @endif
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
            <table style="margin-top: 3mm">
               
                <tr>
                    <td class="field-eleven-body">
                        <table class="no-border" style="height: 68mm">
                            <tr style="height: 10mm">
                                <td class="field-eleven-top" style="width: 120mm">
                                    <b>11.</b>
                                    <span class="field-nine-dots">..........ප්‍රධාන අමාත්‍යාංශය</span>
                                    <span class="field-nine-dots">....................</span>
                                    <span class="section-sinhala-title" lang="si" style="white-space: nowrap">අමාත්‍යාංශයේ ලේකම්</span><br />
                                    <span style="display: inline-block; width: 10mm"></span>
                                    <span class="field-nine-dots">................................................................</span>
                                    <span lang="ta">அமைச்சின் செயலாளர்</span><br />
                                    <span style="display: inline-block; width: 10mm"></span>
                                    <span class="field-nine-dots">..............................................................................</span>
                                </td>
                                <td class="field-eleven-top" style="width: 80mm">
                                    <table class="no-border">
                                        <tr>
                                            <td class="field-ten-reference-label" style="width: 14mm; padding: 0"><span lang="si">යොමු අංකය</span><br /><span lang="ta">தொடர் இல.</span><br /><i>Ref. No.</i></td>
                                            <td class="field-nine-brace" style="width: 6mm; padding: 0">}</td>
                                            <td style="padding: 0; vertical-align: middle"><span class="field-nine-dots">{{ data_get($chiefSecretarySignature, 'signature_data_uri') ? $reference : '....................................' }}</span></td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr style="height: 13mm">
                                <td class="field-eleven-middle" colspan="3">
                                    @php
                                        $writeOffStatus = $value('writeOffStatus');
                                        $writeOffDecision = match ($writeOffStatus) {
                                            'AUTHORISED' => 'අනුමතයි',
                                            'NOT_APPROVED' => 'අනුමත නොකෙරේ',
                                            default => '',
                                        };
                                    @endphp
                                    <div lang="si" style="line-height: 1.1">
                                        @if ($writeOffDecision !== '')
                                            <b>{{ $writeOffDecision }}</b>
                                        @endif
                                    </div>
                                    <div class="field-nine-dots">..........................................................</div>
                                    <span lang="si">පොතෙන් කපාහැරීම අනුමතයි/අනුමත නොකෙරේ.</span><br />
                                    <span lang="ta">பதிவழித்தல் அனுமதிக்கப்படுகிறது / அனுமதிக்கப்படவில்லை.</span><br />
                                    Write off authorised /not approved.
                                </td>
                            </tr>
                            <tr style="height: 30mm">
                                <td class="field-eleven-bottom" style="width: 120mm">&nbsp;</td>
                                <td class="field-eleven-chief-secretary" colspan="2" style="width: 80mm">
                                    <div style="height: 15mm">
                                        @if (data_get($chiefSecretarySignature, 'signature_data_uri'))
                                            <img class="chief-secretary-signature-image" src="{{ data_get($chiefSecretarySignature, 'signature_data_uri') }}" alt="Chief Secretary signature">
                                        @endif
                                    </div>
                                    <div class="signature-dots">....................................</div>
                                    <span class="signature-approver-name">{{ \Illuminate\Support\Str::limit(trim((string) data_get($chiefSecretarySignature, 'name', '')), 55) }}</span>
                                    @if (filled(data_get($chiefSecretarySignature, 'role')))
                                        <div class="signature-role">{{ \Illuminate\Support\Str::limit(trim((string) data_get($chiefSecretarySignature, 'role')), 70) }}</div>
                                    @endif
                                    @if (filled(data_get($chiefSecretarySignature, 'institution')))
                                        <div class="signature-institution">{{ \Illuminate\Support\Str::limit(trim((string) data_get($chiefSecretarySignature, 'institution')), 70) }}</div>
                                    @endif
                                    @foreach (array_slice((array) data_get($chiefSecretarySignature, 'institution_lines', []), 0, 4) as $institutionLine)
                                        @if (filled($institutionLine))
                                            <div class="signature-extra-line">{{ \Illuminate\Support\Str::limit(trim((string) $institutionLine), 70) }}</div>
                                        @endif
                                    @endforeach
                                    @if (data_get($chiefSecretarySignature, 'signature_data_uri'))
                                        <div class="signature-date"><span lang="si">&#x0DAF;&#x0DD2;&#x0DB1;&#x0DBA;</span> / <span lang="ta">&#x0BA4;&#x0BBF;&#x0B95;&#x0BA4;&#x0BBF;</span> / Date: {{ $signatureDate(data_get($chiefSecretarySignature, 'approved_at')) }}</div>
                                    @endif
                                </td>
                            </tr>
                            <tr style="height: 15mm">
                                <td class="field-eleven-copy" colspan="3">
                                    <span lang="si"></span><br />
                                    <span lang="ta"></span><br />
                                    
                                </td>
                            </tr>
                            <tr style="height: 15mm">
                                <td class="field-eleven-copy" colspan="3">
                                    <span lang="si">පිටපත : විගණකාධිපති.</span><br />
                                    <span lang="ta">பிரதி : கணக்காய்வு அதிபதி.</span><br />
                                    Copy to : Auditor-General.
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <table style="margin-top: 3mm" class="writeoff">
                <tr>
                    <td class="section-title" colspan="4">
                        <span class="section-sinhala-title" lang="si">12. පොතෙන් කපාහැරීම සටහන් කරන ලද්දේ -</span><br />
                        <span lang="ta">பதிவழித்தல் பின்வருவனவற்றில் குறிக்கப்பட்டுள்ளது -</span><br />
                        Write off noted in-
                    </td>
                </tr>
                <tr>
                    <td class="header" style="width: 43mm">
                        <span class="table-header-sinhala" lang="si">තොග පොතේ අංකය</span><br />
                        <span lang="ta">இருப்புப் புத்தகப் பக்கம்</span><br />
                        Stock Book folio
                    </td>
                    <td class="header" style="width: 41mm">
                        <span class="table-header-sinhala" lang="si">බඩු වට්ටෝරු පිටුව</span><br />
                        <span lang="ta">பதிவேட்டுப் புத்தகப் பக்கம்</span><br />
                        Inventory Book folio
                    </td>
                    <td class="header" style="width: 70mm">
                        <span class="table-header-sinhala" lang="si">ස්ථාවර වත්කම් ලේඛනය</span><br />
                        <span lang="ta">நிலையான சொத்துக்களின் பதிவேட்டுப் பக்கம்</span><br />
                        Register of fixed Assets folio
                    </td>
                    <td class="header" style="width: 46mm">
                        <span class="table-header-sinhala" lang="si">ලෙජර් පිටුව</span><br />
                        <span lang="ta">பேரேட்டுப் பக்கம்</span><br />
                        Ledger folio
                    </td>
                </tr>
                @foreach ($writeOffEntries as $entry)
                <tr>
                    <td>{{ data_get($entry, 'stockBookFolio', '') }}</td>
                    <td>{{ data_get($entry, 'inventoryBookFolio', '') }}</td>
                    <td>
                        {{ data_get($entry, 'fixedAssetsRegisterFolio', '') }}
                    </td>
                    <td>{{ data_get($entry, 'ledgerFolio', '') }}</td>
                </tr>
                @endforeach
            </table>

            {{-- <table class="no-border">
                <tr>
                    <td class="footer">
                        * <span lang="si">අදාළ නොවන වචන කපා හරින්න</span> /
                        <span lang="ta">பொருந்தாதவற்றைக் கறை</span> / Delete if
                        inapplicable
                    </td>
                </tr>
            </table> --}}
        </div>
    </body>
</html>
  

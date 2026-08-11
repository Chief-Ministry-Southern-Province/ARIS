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
            .page-1,
            .page-2,
            .page-3 {
                page-break-after: always;
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
                font-size: 10pt;
                font-weight: normal !important;
            }
            [lang="ta"] {
                font-family: notosanstamil, sans-serif;
                font-size: 8.5pt;
                font-weight: normal !important;
            }
            .small {
                font-size: 7.6pt;
                line-height: 1.03;
            }
            .header {
                font-size: 8.4pt;
                font-weight: bold;
                text-align: center;
                vertical-align: middle;
            }
            .title {
                height: 29mm;
                text-align: center;
                vertical-align: middle;
            }
            .title-si {
                font-size: 16pt !important;
                font-weight: bold !important;
                line-height: 1.2;
            }
            .title-ta {
                font-size: 13pt !important;
                line-height: 1.15;
            }
            .title-en {
                font-family: dejavuserifcondensed, serif;
                font-size: 13pt;
                font-weight: bold;
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
            .reference {
                font-size: 8.5pt;
                vertical-align: middle;
            }
            .dotted {
                display: inline-block;
                min-width: 45mm;
                border-bottom: 0.25mm dotted #000;
            }
            .section-title {
                padding: 1.5mm 0;
                border-left: 0;
                border-right: 0;
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
                display: inline-block;
                font-family: dejavuserifcondensed, serif;
                font-size: 23pt;
                line-height: 0.65;
                margin-right: 1mm;
                vertical-align: middle;
            }
            .brace-caption-wrap {
                text-align: left;
                white-space: nowrap;
            }
            .brace-caption-text {
                display: inline-block;
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
                text-align: center;
                vertical-align: bottom;
                font-size: 8.5pt;
                line-height: 1.04;
            }
            .field-nine-signature-line {
                height: 10mm;
                border-bottom: 0.25mm dotted #000;
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
                height: 53mm;
                border-bottom: 0.25mm solid #000;
            }
            .field-ten-reference {
                padding: 3mm 12mm 0 !important;
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
                padding: 14mm 12mm 2mm !important;
                vertical-align: bottom;
            }
            .field-ten-date-label {
                display: inline-block;
                width: 10mm;
                line-height: 1.02;
                vertical-align: middle;
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
                padding: 7mm 5mm 2mm !important;
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
                height: 29mm;
            }
            .field-ten-reference-row td {
                height: 24mm;
            }
            .field-ten-signature-row td {
                height: 29mm;
            }
            .field-eleven-body,
            .field-eleven-body td {
                border: 0 !important;
            }
            .field-eleven-body {
                height: 58mm;
                padding: 0 !important;
                border-top: 0.25mm solid #000 !important;
                border-bottom: 0.25mm solid #000 !important;
            }
            .field-eleven-top {
                padding: 2mm 8mm 0 !important;
                vertical-align: top;
            }
            .field-eleven-middle {
                padding: 1mm 20mm !important;
                vertical-align: middle;
            }
            .field-eleven-bottom {
                padding: 3mm 12mm 2mm !important;
                vertical-align: bottom;
            }
            .field-eleven-copy {
                padding: 1mm 0 0 1mm !important;
                font-size: 7pt;
                line-height: 1.02;
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
            .footer {
                border: 0;
                padding-top: 2mm;
                font-size: 7.5pt;
            }
            .signature-space {
                height: 32mm;
                border-bottom: 0.25mm dotted #000;
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
                width: 52mm;
                height: 28mm;
                object-fit: contain;
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
                font-size: 8pt;
                line-height: 1.02;
            }
        </style>
    </head>
    <body>
        @php $data = (array) data_get($document, 'data', []); $value = static fn
        (string $key, mixed $default = ''): string => trim((string)
        data_get($data, $key, $default)); $officers = collect(data_get($data,
        'surchargedOfficers', []))->filter(fn ($item) =>
        is_array($item))->values()->take(4)->pad(4, []); $writeOffEntries =
        collect(data_get($data, 'writeOffEntries', []))->filter(fn ($item) =>
        is_array($item))->values()->take(1)->pad(1, []); $reference = (string)
        (data_get($document, 'reference_number') ?: $value('refNo')); $signatureDate = static fn (mixed $date): string => filled($date) ? \Carbon\Carbon::parse($date)->toDateString() : ''; @endphp

        <div class="page page-1">
            <table class="no-border">
                <tr>
                    <td class="admin">
                        <div class="admin-block">
                            <span lang="si">පොදු</span> /
                            <span lang="ta">பொது</span> / General <b>285</b
                            ><br />(F* S., T. &amp; E.) 12/76<br />[A4* S., T.
                            &amp; E. 06/2023 - Amended]
                        </div>
                    </td>
                </tr>
            </table>

            <table>
                <tr>
                    <td class="title" style="width: 140mm">
                        <span class="title-si" lang="si"
                            >මූ. රෙ. 109 යටතේ අලාභයන් ලියාහැරීම සඳහා<br />ඉල්ලුම්
                            පත්‍රය</span
                        ><br />
                        <span class="title-ta" lang="ta"
                            >நி. பி. 109 இன் படி இழப்புகளைத் தள்ளுபடி
                            செய்வதற்கான<br />விண்ணப்பம்</span
                        ><br />
                        <span class="title-en"
                            >APPLICATION FOR WRITE OFF OF LOSSES IN TERMS OF
                            F.R. 109</span
                        >
                    </td>
                    <td class="reference" style="width: 60mm">
                        <span lang="si">යොමු අංකය</span> /
                        <span lang="ta">தொடர் இல.</span> / Ref. No.<br /><span
                            class="dotted"
                            >{{ $reference }}</span
                        >
                    </td>
                </tr>
            </table>

            <table>
                <tr>
                    <td style="width: 35mm" class="h-11">
                        <span lang="si">1. දෙපාර්තමේන්තුව</span><br /><span
                            lang="ta"
                            >திணைக்களம்</span
                        ><br />Department
                    </td>
                    <td class="h-11">{{ $value('department') }}</td>
                </tr>
            </table>

            <table>
                <tr>
                    <td style="width: 35mm" rowspan="3" class="h-30">
                        <span lang="si">2. වාර්තාව</span><br /><span lang="ta"
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
                        <span lang="si">3. දේපළ පිළිබඳ විස්තර</span> /
                        <span lang="ta">பொருட்களின் விபரம்</span> / Particulars
                        of Property -
                    </td>
                </tr>
                <tr>
                    <td class="header" style="width: 120mm">
                        <span lang="si">දේපළ පිළිබඳ විස්තර</span> /
                        <span lang="ta">பொருட்களின் விபரம்</span> / Description
                        of Property
                    </td>
                    <td class="header" style="width: 80mm">
                        <span lang="si">ප්‍රමාණය</span> /
                        <span lang="ta">அளவு</span> / Quantity
                    </td>
                </tr>
                <tr>
                    <td class="value h-42">
                        {{ $value('descriptionOfProperty') }}
                    </td>
                    <td class="value h-42">{{ $value('quantity') }}</td>
                </tr>
                <tr>
                    <td class="h-11">
                        <span lang="si">4. මුල් පිරිවැය</span><br /><span
                            lang="ta"
                            >அசல் பெறுமதி</span
                        ><br />Original Cost
                    </td>
                    <td>{{ $value('originalCost') }}</td>
                </tr>
                <tr>
                    <td class="h-11">
                        <span lang="si"
                            >අලාභය සිදු වූ අවස්ථාවේ දී ඇස්තමේන්තුගත
                            වටිනාකම</span
                        ><br /><span lang="ta"
                            >இழப்பு ஏற்பட்ட நேரத்தில் மதிப்பிடப்பட்ட
                            பெறுமதி</span
                        ><br />Approximate or Estimated cost at time of loss
                    </td>
                    <td>{{ $value('estimatedCostAtTimeOfLoss') }}</td>
                </tr>
                <tr>
                    <td class="h-11">
                        <span lang="si"
                            >ප්‍රතිස්ථාපන අගය හෝ අලුත්වැඩියා කිරීමේ වියදම</span
                        ><br /><span lang="ta"
                            >மாற்றீட்டு பெறுமதி அல்லது பழுதுபார்ப்பு செலவு</span
                        ><br />Replacement value or cost of repairs
                    </td>
                    <td>{{ $value('replacementValue') }}</td>
                </tr>
                <tr>
                    <td class="h-11">
                        <span lang="si">මූ. රෙ. 105(1) යටතේ වටිනාකම</span
                        ><br /><span lang="ta"
                            >நி. பி. 105(1) இன் கீழ் பெறுமதி</span
                        ><br />Value in terms of F. R. 105(1)
                    </td>
                    <td>{{ $value('valueUnderFr105') }}</td>
                </tr>
                <tr>
                    <td class="h-11">
                        <span lang="si"
                            >රක්ෂණයෙන්/ඇප සහතිකයෙන් අයකර ගන්නා ලද මුදල</span
                        ><br /><span lang="ta"
                            >காப்புறுதி/உத்தரவாதத்திலிருந்து அறவிடப்பட்ட
                            தொகை</span
                        ><br />Amount recovered from Insurance/Guarantee
                    </td>
                    <td>{{ $value('amountRecovered') }}</td>
                </tr>
                <tr>
                    <td class="h-11">
                        <span lang="si">ශුද්ධ අලාභය</span><br /><span lang="ta"
                            >நிகர இழப்பு</span
                        ><br />Net Loss inclusive of FEECs, Customs Duty,
                        Departmental charges, etc.,
                    </td>
                    <td>{{ $value('netLoss') }}</td>
                </tr>
            </table>

            <table class="no-border">
                <tr>
                    <td class="footer">
                        (2023/06) ශ්‍රී ලංකා රජයේ මුද්‍රණ දෙපාර්තමේන්තුව
                        <span style="float: right">1</span>
                    </td>
                </tr>
            </table>
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
                                    <span lang="si">5. නීතිමය ක්‍රියාමාර්ගය</span>
                                    / <span lang="ta">சட்ட நடவடிக்கைகளின் விளைவு</span> /
                                    Outcome of legal action -
                                </td>
                                <td class="section-title" style="width: 50%">
                                    <span lang="si">අධිකරණ නියෝගය</span> /
                                    <span lang="ta">நீதிமன்றக் கட்டளை</span> /
                                    Order of Court
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0">
                                    <table>
                                        <tr>
                                            <td class="header" style="width: 55%">Name of Court</td>
                                            <td class="header" style="width: 45%">Case No.</td>
                                        </tr>
                                        <tr>
                                            <td class="value h-16">{{ $value('nameOfCourt') }}</td>
                                            <td class="value h-16">{{ $value('caseNo') }}</td>
                                        </tr>
                                    </table>
                                </td>
                                <td class="value h-30">{{ $value('outcomeOfLegalAction') }}</td>
                            </tr>
                        </table>

                        <table style="margin-top: 3mm">
                            <tr>
                                <td class="section-title" colspan="8">
                                    <span lang="si">6. අයකර ගැනීම් සහ අය කිරීමේ විස්තර</span> /
                                    <span lang="ta">வசூலிப்பு விபரங்கள்</span> /
                                    Details of surcharges imposed and recoveries
                                </td>
                            </tr>
                            <tr>
                                <td class="header" style="width: 55mm">Details of Surcharges imposed / Name of Officer</td>
                                <td class="header" style="width: 30mm">Designation</td>
                                <td class="header" style="width: 25mm">Amount surcharged</td>
                                <td class="header" style="width: 25mm">Amount recovered</td>
                                <td class="header" style="width: 35mm">Date of recovery</td>
                                <td class="header" style="width: 35mm">Receipt No.</td>
                                <td class="header" style="width: 40mm">Credit particulars</td>
                                <td class="header" style="width: 32mm">Balance not recovered</td>
                            </tr>
                            @foreach ($officers as $officer)
                            <tr>
                                <td class="line">{{ data_get($officer, 'nameOfOfficer', '') }}</td>
                                <td class="line">{{ data_get($officer, 'designation', '') }}</td>
                                <td class="line">{{ data_get($officer, 'amountSurcharged', '') }}</td>
                                <td class="line">{{ data_get($officer, 'amountRecoveredSurcharge', '') }}</td>
                                <td class="line">{{ data_get($officer, 'dateOfRecovery', '') }}</td>
                                <td class="line">{{ data_get($officer, 'receiptNo', '') }}</td>
                                <td class="line">{{ data_get($officer, 'creditParticulars', '') }}</td>
                                <td class="line">{{ data_get($officer, 'balanceNotRecovered', '') }}</td>
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
                        <span lang="si">7. අයකර ගැනීම් නොකිරීමට හේතු</span> /
                        <span lang="ta">அறவிடப்படாமைக்கான காரணங்கள்</span> /
                        Reasons for non-recoveries of surcharges imposed -
                    </td>
                </tr>
                <tr>
                    <td class="value h-68">
                        {{ $value('reasonsForNonRecovery') }}
                    </td>
                </tr>
            </table>

            <table style="margin-top: 3mm">
                <tr>
                    <td class="section-title">
                        <span lang="si"
                            >8. (අ) නිලධාරියාගේ වත්කම්වලින් අයකර ගැනීමට ගෙන ඇති
                            ක්‍රියාමාර්ගය</span
                        ><br /><span lang="ta"
                            >(அ)அலுவலரின் சொத்துக்களிலிருந்து அறவிட எடுக்கப்பட்ட
                            நடவடிக்கையின் விபரம்</span
                        ><br />(a) Details of action taken to effect the
                        recovery of shortages from the assets of the officer, if
                        the officer is not in service -
                    </td>
                </tr>
                <tr>
                    <td class="value h-55">
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
                    <td class="value h-42">{{ $value('resultsOfAction') }}</td>
                </tr>
            </table>

            <table class="no-border" style="margin-top: 3mm">
                <tr>
                    <td style="width: 55mm; vertical-align: bottom">
                        <span lang="si">දිනය</span><br /><span lang="ta"
                            >திகதி</span
                        ><br />Date <span class="dotted">{{ $signatureDate(data_get($pdhsChiefAccountantSignature, 'approved_at')) }}</span>
                    </td>
                    <td class="signature-comment" style="width: 85mm">
                        {{ \Illuminate\Support\Str::limit(trim((string) data_get($pdhsChiefAccountantSignature, 'comments', '')), 110, '...') }}
                    </td>
                    <td
                        style="width: 60mm; vertical-align: bottom"
                        class="signature-text"
                    >
                        <div class="signature-space">
                            @if (data_get($pdhsChiefAccountantSignature, 'signature_data_uri'))
                                <img class="approval-signature-image" src="{{ data_get($pdhsChiefAccountantSignature, 'signature_data_uri') }}" alt="Chief Accountant signature">
                            @endif
                        </div>
                        <span lang="si">ප්‍රධාන ගණකාධිකාරීගේ අත්සන</span
                        ><br /><span lang="ta">பிரதம கணக்காளரின் கையொப்பம்</span
                        ><br /><i>Signature of Chief Accountant.</i>
                    </td>
                </tr>
            </table>

        </div>

        <div class="page page-4">
            <table>
                <tr>
                    <td class="section-title field-nine-title" style="width: 100%; vertical-align: bottom;">
                        <span lang="si"
                            >9. මූ. රෙ. 109 යටතේ අලාභයන් ලියාහැරීම සඳහා
                            දෙපාර්තමේන්තු ප්‍රධානියාගේ හෝ සංස්ථාපතිවරයාගේ
                            නිර්දේශය</span
                        ><br /><span lang="ta"
                            >நி. பி. 109 இன் கீழ் தள்ளுபடி செய்வதற்கான
                            திணைக்களத் தலைவரின் அல்லது கூட்டுத்தாபனத் தலைவரின்
                            சிபாரிசு</span
                        ><br />Recommendation of Head of Department or Chairman
                        of Corporation under F. R. 109 -
                    </td>
                </tr>
                <tr>
                    <td class="field-nine-secretary">
                        <table class="no-border">
                            <tr>
                                <td style="width: 160mm; padding: 0; vertical-align: middle">
                                    * Secretary to the Ministry of
                                    <span class="field-nine-dots">....................................................................................</span>
                                </td>
                                <td class="field-nine-secretary-caption" style="width: 40mm">
                                    <div class="brace-caption-wrap" style="">
                                        <span class="field-nine-caption-brace">{</span>
                                        <div class="brace-caption-text">
                                            <span lang="si">අමාත්‍යාංශයේ ලේකම්</span>
                                            <span lang="ta">அமைச்சின் செயலாளர்</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <table class="field-nine-body">
                <tr>
                    <td class="field-nine-date" style="width: 14mm">
                        <span lang="si">දිනය</span><br /><span lang="ta"
                            >திகதி</span
                        ><br />Date
                    </td>
                    <td class="field-nine-brace" style="width: 5mm">}</td>
                    <td style="width: 55mm; padding: 0; vertical-align: middle">
                        <span class="field-nine-dots">.......................................</span>
                    </td>
                    <td style="width: 56mm; padding: 0"></td>
                    <td
                        style="width: 70mm"
                        class="field-nine-signature"
                    >
                        <div class="field-nine-signature-line"></div>
                        <span lang="si"
                            >දෙපාර්තමේන්තු ප්‍රධානියාගේ/සංස්ථාපතිවරයාගේ
                            අත්සන</span
                        ><br /><span lang="ta"
                            >திணைக்களத் தலைவரின் கையொப்பம்</span
                        ><br /><i
                            >Head of Department/ Chairman of Corporation.</i
                        >
                    </td>
                </tr>
            </table>

            <table style="margin-top: 3mm">
    <tr>
        <td class="section-title">
            <span lang="si">10. ප්‍රධාන ගණන් දීමේ නිලධාරියාගේ නියෝගය</span><br />
            <span lang="ta">பிரதம கணக்கீட்டு அலுவலரின் கட்டளை</span><br />
            Order of the Chief Accounting Officer under F. R. 108 (1) or recommendation of Chief Accounting Officer
            under F. R. 108 (3) -
        </td>
    </tr>
    <tr>
        <td class="field-ten-body" style="padding: 0">
            <table class="no-border" style="height: 53mm">
                <tr class="field-ten-reference-row">
                    <td class="field-ten-reference" style="width: 100mm">
                        <span class="field-ten-reference-label">* <span lang="si">එස්. ටී.</span><br /><span lang="ta">எஸ். ரி.</span><br />S. T.</span>
                        <span class="field-ten-reference-brace">}</span>
                        <span class="field-nine-dots">{{ $value('chiefAccountingOfficerSTNo') ?: '.......................................' }}</span>
                    </td>
                    <td class="field-ten-reference" style="width: 100mm; padding-left: 10mm">
                        <span class="field-ten-reference-label"><span lang="si">යොමු අංකය</span><br /><span lang="ta">தொடர் இல.</span><br /><i>Ref. No.</i></span>
                        <span class="field-ten-reference-brace">}</span>
                        <span class="field-nine-dots">{{ $value('chiefAccountingOfficerRefNo') ?: '.......................................' }}</span>
                    </td>
                </tr>
                <tr class="field-ten-signature-row">
                    <td class="field-ten-bottom" style="width: 100mm; vertical-align: bottom">
                        <span class="field-ten-date-label"><span lang="si">දිනය</span><br /><span lang="ta">திகதி</span><br /><i>Date</i></span>
                        <span class="field-ten-reference-brace">}</span>
                        <span class="field-nine-dots">.......................................</span>
                    </td>
                    <td class="field-ten-secretary" style="width: 100mm; padding-left: 10mm; vertical-align: bottom">
                        <div class="field-ten-secretary-line dotted" style="height: 5mm"></div>
                        <div class="field-ten-secretary-caption" lang="si" style="text-align: right; font-size: 8pt">
                            අමාත්‍යාංශයේ ලේකම්
                        </div>
                        <div style="margin-top: 2mm">
                            <i>Secretary to the Ministry of</i>
                            <span class="field-nine-dots">....................................</span>
                        </div>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
            <table style="margin-top: 3mm">
                <tr>
                    <td class="section-title" style="display: none">
                        <span lang="si">11. ලියාහැරීම සඳහා අනුමැතිය</span> /
                        <span lang="ta">தள்ளுபடி செய்வதற்கான அனுமதி</span> /
                        Write off authorised / not approved.
                    </td>
                </tr>
                <tr>
                    <td class="value h-30" style="display: none">
                        <span lang="si">ලේකම්, අමාත්‍යාංශය</span> /
                        <span lang="ta">அமைச்சின் செயலாளர்</span> / Secretary to
                        the Ministry of
                        <span class="dotted"
                            >{{ $value('chiefSecretaryToMinistryOf') }}</span
                        ><br /><br /><span lang="si">යොමු අංකය</span> /
                        <span lang="ta">தொடர் இல.</span> / Ref. No.
                        <span class="dotted"
                            >{{ $value('chiefSecretaryRefNo') }}</span
                        ><br /><br />{{ $value('writeOffStatus') ===
                        'AUTHORISED' ? '✓ Write off authorised.' :
                        ($value('writeOffStatus') === 'NOT_APPROVED' ? '✓ Write
                        off not approved.' : '') }}
                    </td>
                </tr>
                <tr>
                    <td class="field-eleven-body">
                        <table class="no-border" style="height: 58mm">
                            <tr style="height: 18mm">
                                <td class="field-eleven-top" style="width: 55mm">
                                    <b>11.</b>
                                    <span class="field-nine-dots">....................................</span><br />
                                    <span class="field-nine-dots">....................................</span><br />
                                    <i>Secretary to the Ministry of</i>
                                </td>
                                <td class="field-eleven-top" style="width: 75mm">
                                    <span lang="si">ලේකම්, අමාත්‍යාංශය</span><br />
                                    <span lang="ta">அமைச்சின் செயலாளர்</span><br />
                                    <span class="field-nine-dots">....................................</span>
                                </td>
                                <td class="field-eleven-top" style="width: 70mm">
                                    <span lang="si">යොමු අංකය</span><br />
                                    <span lang="ta">தொடர் இல.</span><br />
                                    <i>Ref. No.</i>
                                    <span class="field-ten-reference-brace">}</span>
                                    <span class="field-nine-dots">....................................</span>
                                </td>
                            </tr>
                            <tr style="height: 17mm">
                                <td class="field-eleven-middle" colspan="3">
                                    <span lang="si">ලියාහැරීම සඳහා අනුමැතිය/අනුමත නොකෙරේ.</span><br />
                                    <span lang="ta">தள்ளுபடிக்கு அனுமதிக்கப்படுகிறது / அனுமதிக்கப்படவில்லை.</span><br />
                                    Write off authorised/not approved.
                                </td>
                            </tr>
                            <tr style="height: 18mm">
                                <td class="field-eleven-bottom" style="width: 90mm">
                                    <span class="field-ten-date-label"><span lang="si">දිනය</span><br /><span lang="ta">திகதி</span><br /><i>Date</i></span>
                                    <span class="field-ten-reference-brace">}</span>
                                    <span class="field-nine-dots">....................................</span>
                                </td>
                                <td class="field-eleven-bottom" colspan="2" style="width: 110mm; text-align: center">
                                    <span class="field-nine-dots">....................................................</span><br />
                                    <span lang="si">භාණ්ඩාගාරයේ ලේකම්</span><br />
                                    <span lang="ta">திறைசேரியின் செயலாளர்</span><br />
                                    <i>Secretary to the Treasury.</i>
                                </td>
                            </tr>
                            <tr>
                                <td class="field-eleven-copy" colspan="3">
                                    <span lang="si">පිටපත : විගණකාධිපති ජනරාල්</span><br />
                                    <span lang="ta">பிரதி : கணக்காய்வாளர் நாயகம்</span><br />
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
                        <span lang="si">12. ලියාහැරීම සටහන් කරන ලද්දේ -</span><br />
                        <span lang="ta">தள்ளுபடி பதிவு செய்யப்பட்ட இடம் -</span><br />
                        Write off noted in-
                    </td>
                </tr>
                <tr>
                    <td class="header" style="width: 43mm">
                        <span lang="si">තොග පොතේ පිටු අංකය</span><br />
                        <span lang="ta">இருப்புப் பதிவேட்டுப் பக்க இல.</span><br />
                        Stock Book folio
                    </td>
                    <td class="header" style="width: 41mm">
                        <span lang="si">භාණ්ඩ ලේඛන පොතේ පිටු අංකය</span><br />
                        <span lang="ta">சரக்குப் பதிவேட்டுப் பக்க இல.</span><br />
                        Inventory Book folio
                    </td>
                    <td class="header" style="width: 70mm">
                        <span lang="si">ස්ථාවර වත්කම් ලේඛනයේ පිටු අංකය</span><br />
                        <span lang="ta">நிலையான சொத்துப் பதிவேட்டுப் பக்க இல.</span><br />
                        Register of fixed Assets folio
                    </td>
                    <td class="header" style="width: 46mm">
                        <span lang="si">ලෙජර් පිටු අංකය</span><br />
                        <span lang="ta">பேரேட்டுப் பக்க இல.</span><br />
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

            <table class="no-border">
                <tr>
                    <td class="footer">
                        * <span lang="si">අදාළ නොවන වචන කපා හරින්න</span> /
                        <span lang="ta">பொருந்தாதவற்றைக் கறை</span> / Delete if
                        inapplicable
                    </td>
                </tr>
            </table>
        </div>
    </body>
</html>

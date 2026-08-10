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
            .page-2 .rotated-form {
                width: 277mm;
                border: 0;
            }
            .page-2 .rotated-form > tbody > tr > td {
                width: 277mm;
                border: 0;
                padding: 0;
            }
            .writeoff td {
                height: 27mm;
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
        (data_get($document, 'reference_number') ?: $value('refNo')); @endphp

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
            <table rotate="-90" class="rotated-form">
                <tr>
                    <td>
                        <table>
                            <tr>
                                <td class="section-title" colspan="8">
                                    <span lang="si"
                                        >5. නීතිමය ක්‍රියාමාර්ගය</span
                                    >
                                    / <span lang="ta">சட்ட நடவடிக்கை</span> /
                                    Outcome of legal action -
                                </td>
                            </tr>
                            <tr>
                                <td class="header" style="width: 40mm">
                                    Name of Court
                                </td>
                                <td class="header" style="width: 25mm">
                                    Case No.
                                </td>
                                <td class="header" style="width: 55mm">
                                    Details of Surcharges imposed / Name of
                                    Officer
                                </td>
                                <td class="header" style="width: 30mm">
                                    Designation
                                </td>
                                <td class="header" style="width: 25mm">
                                    Amount surcharged
                                </td>
                                <td class="header" style="width: 25mm">
                                    Amount recovered
                                </td>
                                <td class="header" style="width: 35mm">
                                    Date / Receipt No.
                                </td>
                                <td class="header" style="width: 42mm">
                                    Credit particulars / Balance not recovered
                                </td>
                            </tr>
                            @foreach ($officers as $index => $officer)
                            <tr>
                                @if ($index === 0)
                                <td rowspan="4" class="value h-78">
                                    {{ $value('nameOfCourt') }}
                                </td>
                                <td rowspan="4" class="value h-78">
                                    {{ $value('caseNo') }}
                                </td>
                                @endif
                                <td class="line">
                                    {{ data_get($officer, 'nameOfOfficer', '')
                                    }}
                                </td>
                                <td class="line">
                                    {{ data_get($officer, 'designation', '') }}
                                </td>
                                <td class="line">
                                    {{ data_get($officer, 'amountSurcharged',
                                    '') }}
                                </td>
                                <td class="line">
                                    {{ data_get($officer,
                                    'amountRecoveredSurcharge', '') }}
                                </td>
                                <td class="line">
                                    {{ data_get($officer, 'dateOfRecovery', '')
                                    }}<br />{{ data_get($officer, 'receiptNo',
                                    '') }}
                                </td>
                                <td class="line">
                                    {{ data_get($officer, 'creditParticulars',
                                    '') }}<br />{{ data_get($officer,
                                    'balanceNotRecovered', '') }}
                                </td>
                            </tr>
                            @endforeach
                        </table>

                        <table style="margin-top: 3mm">
                            <tr>
                                <td class="section-title">
                                    <span lang="si">6. අධිකරණ නියෝගය</span> /
                                    <span lang="ta">நீதிமன்றக் கட்டளை</span> /
                                    Order of Court
                                </td>
                            </tr>
                            <tr>
                                <td class="value h-30">
                                    {{ $value('outcomeOfLegalAction') }}
                                </td>
                            </tr>
                        </table>

                        <table class="no-border">
                            <tr>
                                <td class="footer" style="text-align: center">
                                    2
                                </td>
                            </tr>
                        </table>
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
                            >அலுவலரின் சொத்துக்களிலிருந்து அறவிட எடுக்கப்பட்ட
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
                            >மேற்படி நடவடிக்கையின் விளைவு</span
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
                        ><br />Date <span class="dotted"></span>
                    </td>
                    <td style="width: 85mm"></td>
                    <td
                        style="width: 60mm; vertical-align: bottom"
                        class="signature-text"
                    >
                        <div class="signature-space"></div>
                        <span lang="si">ප්‍රධාන ගණකාධිකාරීගේ අත්සන</span
                        ><br /><span lang="ta">பிரதம கணக்காளரின் கையொப்பம்</span
                        ><br /><i>Signature of Chief Accountant.</i>
                    </td>
                </tr>
            </table>

            <table class="no-border">
                <tr>
                    <td
                        class="footer"
                        style="
                            border-bottom: 0.25mm solid #000;
                            text-align: center;
                        "
                    >
                        3
                    </td>
                </tr>
            </table>
        </div>

        <div class="page page-4">
            <table>
                <tr>
                    <td class="section-title">
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
                    <td class="value h-22">
                        {{ $value('secretaryOfMinistry') ? 'Secretary to the
                        Ministry of '.$value('secretaryOfMinistry') : '' }}
                    </td>
                </tr>
            </table>

            <table class="no-border">
                <tr>
                    <td style="width: 60mm; vertical-align: bottom">
                        <span lang="si">දිනය</span><br /><span lang="ta"
                            >திகதி</span
                        ><br />Date <span class="dotted"></span>
                    </td>
                    <td style="width: 70mm"></td>
                    <td
                        style="width: 70mm; vertical-align: bottom"
                        class="signature-text"
                    >
                        <div class="signature-space"></div>
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
                        <span lang="si"
                            >10. ප්‍රධාන ගණන් දීමේ නිලධාරියාගේ නියෝගය</span
                        ><br /><span lang="ta"
                            >பிரதம கணக்கீட்டு அலுவலரின் கட்டளை</span
                        ><br />Order of the Chief Accounting Officer under F. R.
                        108 (1) or recommendation of Chief Accounting Officer
                        under F. R. 108 (3) -
                    </td>
                </tr>
                <tr>
                    <td class="value h-30">
                        <span lang="si">එස්. ටී. අංකය</span> /
                        <span lang="ta">எஸ். ரி. இல.</span> / S. T. No.
                        <span class="dotted"
                            >{{ $value('chiefAccountingOfficerSTNo') }}</span
                        ><br /><br /><span lang="si">යොමු අංකය</span> /
                        <span lang="ta">தொடர் இல.</span> / Ref. No.
                        <span class="dotted"
                            >{{ $value('chiefAccountingOfficerRefNo') }}</span
                        >
                    </td>
                </tr>
            </table>

            <table style="margin-top: 3mm">
                <tr>
                    <td class="section-title">
                        <span lang="si">11. ලියාහැරීම සඳහා අනුමැතිය</span> /
                        <span lang="ta">தள்ளுபடி செய்வதற்கான அனுமதி</span> /
                        Write off authorised / not approved.
                    </td>
                </tr>
                <tr>
                    <td class="value h-30">
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
            </table>

            <table style="margin-top: 3mm" class="writeoff">
                <tr>
                    <td class="section-title" colspan="4">
                        <span lang="si">12. ලියාහැරීම සටහන් කරන ලද්දේ</span> /
                        <span lang="ta">தள்ளுபடி பதிவு செய்யப்பட்ட இடம்</span> /
                        Write off noted in-
                    </td>
                </tr>
                <tr>
                    <td class="header">Stock Book folio</td>
                    <td class="header">Inventory Book folio</td>
                    <td class="header">Register of fixed Assets folio</td>
                    <td class="header">Ledger folio</td>
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
                        inapplicable <span style="float: right">4</span>
                    </td>
                </tr>
            </table>
        </div>
    </body>
</html>

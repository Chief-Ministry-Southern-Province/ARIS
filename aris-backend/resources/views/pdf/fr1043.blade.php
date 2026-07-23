<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <style>
        html,
        body {
            margin: 0;
            padding: 0;
        }

        body,
        table,
        td,
        th,
        span {
            font-family: iskoolapota, notosanssinhala, notosanstamil, dejavusans, sans-serif;
            font-size: 10pt;
            line-height: 1.15;
            color: #000;
        }

        table {
            width: 200mm;
            margin: 0;
            border-collapse: collapse;
            border-spacing: 0;
        }

        .inner-table {
            width: 100%;
        }

        .items-table {
            table-layout: fixed;
        }

        .items-row td {
            border-top: 0;
            border-bottom: 0;
        }

        .items-row-last td {
            border-bottom: 1px solid #000;
        }

        td,
        th {
            border: 1px solid #000;
            padding: 2mm;
            vertical-align: top;
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

        .page-break {
            page-break-after: always;
        }

        .gazette {
            height: 12mm;
            font-size: 8pt;
            line-height: 1.1;
            text-align: right;
        }

        .title-block {
            height: 18mm;
            text-align: center;
            vertical-align: middle;
        }

        .title-si,
        .title-ta {
            font-size: 13pt;
            font-weight: bold;
        }

        .title-en {
            font-size: 14pt;
            font-weight: bold;
        }

        .label-local {
            font-size: 8pt;
        }

        .table-header {
            font-size: 9pt;
            font-weight: bold;
            text-align: center;
            vertical-align: middle;
        }

        .reference {
            font-size: 9pt;
            text-align: right;
        }

        .fixed-12 { height: 12mm; }
        .fixed-14 { height: 14mm; }
        .fixed-16 { height: 16mm; }
        .fixed-18 { height: 18mm; }
        .fixed-24 { height: 24mm; }
        .fixed-32 { height: 32mm; }
        .fixed-36 { height: 36mm; }
        .fixed-40 { height: 40mm; }
        .fixed-45 { height: 45mm; }
        .fixed-60 { height: 60mm; }

        .items-cell,
        .officers-cell,
        .response-cell {
            overflow: hidden;
        }

        .item-line,
        .officer-line {
            line-height: 1.45;
        }

        .signature-line {
            height: 12mm;
            border-bottom: 1px dotted #000;
        }

        .signature-image {
            width: 32mm;
            height: 12mm;
        }

        .signature-label {
            font-size: 10pt;
            line-height: 1.2;
        }

        .footer {
            height: 4mm;
            font-size: 8pt;
            text-align: center;
            vertical-align: middle;
        }
    </style>
</head>
<body>
    @php
        $text = static fn (mixed $value, int $limit): string => \Illuminate\Support\Str::limit(
            trim((string) $value),
            $limit,
            '...'
        );

        $items = collect(data_get($document->data, 'items', []))
            ->filter(static fn ($item): bool => is_array($item) || is_object($item))
            ->values()
            ->take(5);

        $officers = collect(data_get($document->data, 'officers', []))
            ->filter(static fn ($officer): bool => is_array($officer) || is_object($officer))
            ->values()
            ->take(4);
    @endphp

    {{-- PAGE 1: Header and sections 1–4 only. --}}
    <table class="no-border">
        <tr>
            <td class="gazette">
                <span lang="si">පොදු</span> / <span lang="ta">பொது</span> / General<br>
                <strong>283</strong><br>
                (F2* S., T. &amp; E.) 12/76<br>
                (A4* S., T. &amp; E. 06/2023 - Amended)
            </td>
        </tr>
        <tr>
            <td class="title-block">
                <span class="title-si" lang="si">මූ. රෙ. 104 (3) යටතේ අලාභයන් පිළිබඳ ප්‍රාථමික වාර්තාව</span><br>
                <span class="title-ta" lang="ta">நி.பி. 104 (3) இன் கீழ் இழப்புகள் பற்றிய தொடக்க அறிக்கை</span><br>
                <span class="title-en">PRELIMINARY REPORT OF LOSSES UNDER F.R. 104 (3)</span>
            </td>
        </tr>
        <tr>
            <td class="fixed-14">
                <table class="no-border inner-table">
                    <tr>
                        <td style="width: 140mm;">
                            <span class="label-local" lang="si">අමාත්‍යාංශයේ ලේකම්</span> /
                            <span class="label-local" lang="ta">அமைச்சின் செயலாளர்</span> /
                            Secretary to the Ministry of
                            {{ $text(data_get($document->data, 'ministry', ''), 50) }}
                        </td>
                        <td class="reference" style="width: 60mm;">
                            <span class="label-local" lang="si">යොමු අංකය</span> /
                            <span class="label-local" lang="ta">தொடர் இல.</span><br>
                            Ref. No.: {{ $text($document->reference_number ?? '', 30) }}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="label-local" lang="si">පිටපත: විගණකාධිපති</span> /
                            <span class="label-local" lang="ta">பிரதி: கணக்காய்வாளர் தலைமை அதிபதி</span> /
                            Copy to: Auditor-General
                        </td>
                        <td></td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

    <table>
        <tr class="fixed-16">
            <td style="width: 50mm;">
                <span class="label-local" lang="si">1. දෙපාර්තමේන්තුව / සංස්ථාව</span><br>
                <span class="label-local" lang="ta">1. திணைக்களம் / கூட்டுத்தாபனம்</span><br>
                Department / Corporation
            </td>
            <td class="response-cell" style="width: 150mm;">
                {{ $text(data_get($document->data, 'department', ''), 180) }}
            </td>
        </tr>
    </table>

    <table>
        <tr class="fixed-32">
            <td style="width: 82mm;">
                <span class="label-local" lang="si">2. අලාභය</span><br>
                <span class="label-local" lang="ta">2. இழப்பு</span><br>
                Loss<br>
                {{ $text(data_get($document->data, 'lossDetails', data_get($document->data, 'loss', '')), 180) }}
            </td>
            <td style="width: 52mm;">
                <span class="label-local" lang="si">දිනය</span> / <span class="label-local" lang="ta">திகதி</span><br>
                Date<br>
                {{ $text(data_get($document->data, 'lossDate', data_get($document->data, 'date', '')), 30) }}
            </td>
            <td style="width: 66mm;">
                <span class="label-local" lang="si">ස්ථානය</span> / <span class="label-local" lang="ta">இடம்</span><br>
                Place<br>
                {{ $text(data_get($document->data, 'lossPlace', data_get($document->data, 'place', '')), 60) }}
            </td>
        </tr>
    </table>

    <table>
        <tr class="fixed-12">
            <td style="width: 50mm;">
                <span class="label-local" lang="si">3. අලාභයේ ස්වභාවය</span><br>
                <span class="label-local" lang="ta">3. இழப்பின் தன்மை</span><br>
                Nature of Loss
            </td>
            <td class="response-cell" style="width: 150mm;">
                {{ $text(data_get($document->data, 'natureOfLoss', ''), 180) }}
            </td>
        </tr>
    </table>

    <table class="items-table">
        <tr class="fixed-12">
            <th class="table-header" style="width: 90mm;">
                <span lang="si">අහිමි වූ භාණ්ඩවල විස්තරය</span><br>
                <span lang="ta">இழந்த பொருட்களின் விபரம்</span><br>
                Description of items lost
            </th>
            <th class="table-header" style="width: 34mm;">
                <span lang="si">ප්‍රමාණය</span><br>
                <span lang="ta">அளவு</span><br>
                Quantity
            </th>
            <th class="table-header" style="width: 36mm;">
                <span lang="si">මිනුම් ඒකක</span><br>
                <span lang="ta">அளவீட்டு அலகு</span><br>
                Units of Measure
            </th>
            <th class="table-header" style="width: 40mm;">
                <span lang="si">වටිනාකම</span><br>
                <span lang="ta">பெறுமதி</span><br>
                Value
            </th>
        </tr>
        @for($itemIndex = 0; $itemIndex < 5; $itemIndex++)
            @php
                $item = $items->get($itemIndex);
            @endphp
            <tr class="fixed-36 items-row {{ $itemIndex === 4 ? 'items-row-last' : '' }}">
                <td class="items-cell" style="width: 90mm;">
                    <span class="item-line">{{ $text(data_get($item, 'description', ''), 90) }}</span>
                </td>
                <td class="items-cell" style="width: 34mm; text-align: center;">
                    <span class="item-line">{{ $text(data_get($item, 'quantity', ''), 20) }}</span>
                </td>
                <td class="items-cell" style="width: 36mm; text-align: center;">
                    <span class="item-line">{{ $text(data_get($item, 'unitOfMeasure', data_get($item, 'unit', '')), 25) }}</span>
                </td>
                <td class="items-cell" style="width: 40mm; text-align: right;">
                    <span class="item-line">{{ $text(data_get($item, 'value', ''), 25) }}</span>
                </td>
            </tr>
        @endfor
    </table>

    <table>
        <tr class="fixed-12">
            <td style="width: 50mm;">
                <span class="label-local" lang="si">4. අලාභයට හේතුව</span><br>
                <span class="label-local" lang="ta">4. இழப்பிற்கான காரணம்</span><br>
                Cause of Loss
            </td>
            <td class="response-cell" style="width: 150mm;">
                {{ $text(data_get($document->data, 'causeOfLoss', ''), 180) }}
            </td>
        </tr>
    </table>

    <table class="no-border page-break">
        <tr><td class="footer">1</td></tr>
    </table>

    {{-- PAGE 2: Sections 5–9 and signatures only. --}}
    <table class="no-border">
        <tr><td class="footer" style="height: 6mm;">(2)</td></tr>
    </table>

    <table>
        <tr class="fixed-12">
            <th class="table-header" style="width: 100mm;">
                <span lang="si">5. වගකිවයුතු නිලධාරීන්ගේ නම</span><br>
                <span lang="ta">5. பொறுப்பான அலுவலர்களின் பெயர்</span><br>
                Name
            </th>
            <th class="table-header" style="width: 100mm;">
                <span lang="si">තනතුර</span><br>
                <span lang="ta">பதவி</span><br>
                Designation
            </th>
        </tr>
        <tr class="fixed-40">
            <td class="officers-cell" style="width: 100mm;">
                @foreach($officers as $officer)
                    <span class="officer-line">{{ $text(data_get($officer, 'name', ''), 70) }}</span><br>
                @endforeach
            </td>
            <td class="officers-cell" style="width: 100mm;">
                @foreach($officers as $officer)
                    @php
                        $designation = is_object($officer) && method_exists($officer, 'getRoleNames')
                            ? $officer->getRoleNames()->implode(', ')
                            : data_get($officer, 'designation', data_get($officer, 'roles', ''));
                    @endphp
                    <span class="officer-line">{{ $text($designation, 70) }}</span><br>
                @endforeach
            </td>
        </tr>
    </table>

    <table>
        <tr class="fixed-24">
            <td style="width: 100mm;">
                <span class="label-local" lang="si">6. පොලිස් ස්ථානයේ නම</span><br>
                <span class="label-local" lang="ta">6. பொலிஸ் நிலையத்தின் பெயர்</span><br>
                Name of Police Station<br>
                {{ $text(data_get($document->data, 'policeStation', ''), 110) }}
            </td>
            <td style="width: 100mm;">
                <span class="label-local" lang="si">පොලිසියට වාර්තා කළ දිනය</span><br>
                <span class="label-local" lang="ta">பொலிஸாருக்கு அறிவித்த திகதி</span><br>
                Date reported to Police<br>
                {{ $text(data_get($document->data, 'policeReportDate', ''), 35) }}
            </td>
        </tr>
    </table>

    <table>
        <tr class="fixed-40">
            <td style="width: 60mm;">
                <span class="label-local" lang="si">7. සිදු කරනු ලබන විමර්ශනයේ ස්වභාවය</span><br>
                <span class="label-local" lang="ta">7. மேற்கொள்ளப்படும் விசாரணையின் தன்மை</span><br>
                Nature of Investigation being carried out
            </td>
            <td class="response-cell" style="width: 140mm;">
                {{ $text(data_get($document->data, 'investigation', ''), 280) }}
            </td>
        </tr>
    </table>

    <table>
        <tr class="fixed-45">
            <td style="width: 60mm;">
                <span class="label-local" lang="si">8. පොත්පත්, වාර්තා ආදියෙහි ආරක්ෂාව සඳහා කරන ලද විධිවිධාන</span><br>
                <span class="label-local" lang="ta">8. புத்தகங்கள், பதிவேடுகள் முதலியவற்றின் பாதுகாப்பிற்காக செய்யப்பட்ட ஏற்பாடுகள்</span><br>
                Arrangements made for the security of books, records, etc.
            </td>
            <td class="response-cell" style="width: 140mm;">
                {{ $text(data_get($document->data, 'securityArrangements', ''), 320) }}
            </td>
        </tr>
    </table>

    <table>
        <tr class="fixed-45">
            <td style="width: 60mm;">
                <span class="label-local" lang="si">9. තවදුරටත් අලාභ සිදුවීම වැළැක්වීම සඳහා කරන ලද විධිවිධාන</span><br>
                <span class="label-local" lang="ta">9. மேலும் இழப்புகள் ஏற்படுவதைத் தடுப்பதற்காக செய்யப்பட்ட ஏற்பாடுகள்</span><br>
                Arrangements made for prevention of further losses
            </td>
            <td class="response-cell" style="width: 140mm;">
                {{ $text(data_get($document->data, 'preventionArrangements', ''), 320) }}
            </td>
        </tr>
    </table>

    <table class="no-border">
        <tr class="fixed-60">
            <td style="width: 90mm; padding-top: 4mm;">
                <span class="signature-label">Date: {{ $text(data_get($headSignature, 'approved_at', ''), 30) }}</span><br><br>
                @if(data_get($headSignature, 'signature_data_uri'))
                    <img class="signature-image" src="{{ data_get($headSignature, 'signature_data_uri') }}" alt="Head signature">
                @else
                    <table class="no-border inner-table"><tr><td class="signature-line"></td></tr></table>
                @endif
            </td>
            <td style="width: 110mm; padding-top: 4mm;">
                <table class="no-border inner-table">
                    <tr><td class="signature-line"></td></tr>
                    <tr><td class="signature-label">Head of Department / Chairman of Corporation</td></tr>
                    <tr><td style="height: 7mm;">Forwarded</td></tr>
                    <tr><td>Ref. No.: {{ $text($document->reference_number ?? '', 30) }}</td></tr>
                    <tr><td class="signature-line"></td></tr>
                    <tr><td class="signature-label">Secretary to the Ministry of {{ $text(data_get($document->data, 'ministry', ''), 45) }}</td></tr>
                </table>
            </td>
        </tr>
    </table>

    <table class="no-border">
        <tr><td class="footer">2</td></tr>
    </table>
</body>
</html>

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
        span,
        div,
        p {
            font-family: dejavusans, sans-serif;
        }

        body {
            color: #000;
            font-size: 9px;
            line-height: 1.3;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            border-spacing: 0;
        }

        td,
        th {
            vertical-align: top;
        }

        .border-table td,
        .border-table th {
            border: 0.7px solid #000;
            padding: 5px;
        }

        .no-border,
        .no-border td,
        .no-border th {
            border: none !important;
        }

        .no-border td,
        .no-border th {
            padding: 2px 4px;
        }

        .header-table,
        .header-table td {
            border: none;
        }

        .header-table td {
            padding: 0;
        }

        .form-code-box {
            border: 0.7px solid #000;
            padding: 4px 6px;
            text-align: center;
            font-size: 7px;
            line-height: 1.3;
        }

        .form-code-number {
            font-size: 10px;
            font-weight: bold;
        }

        .heading-section {
            text-align: center;
            margin-top: 7px;
            margin-bottom: 8px;
        }

        .heading-section p {
            margin: 1px 0;
        }

        .heading-si,
        .heading-ta {
            font-size: 9px;
        }

        .heading-en {
            margin-top: 3px !important;
            font-size: 11px;
            font-weight: bold;
        }

        .top-info {
            margin-bottom: 8px;
        }

        .top-info td {
            font-size: 8px;
            line-height: 1.4;
        }

        .field-line {
            text-decoration: underline;
        }

        .field-line-short {
            text-decoration: underline;
        }

        .number-cell {
            width: 6%;
            text-align: center;
            font-weight: bold;
        }

        .label-cell {
            width: 30%;
        }

        .value-cell {
            width: 64%;
        }

        .label-en {
            font-weight: bold;
        }

        .center {
            text-align: center;
        }

        .right {
            text-align: right;
        }

        .bold {
            font-weight: bold;
        }

        .small {
            font-size: 7px;
        }

        .medium-padding {
            padding-bottom: 18px !important;
        }

        .large-padding {
            padding-bottom: 32px !important;
        }

        .very-large-padding {
            padding-bottom: 50px !important;
        }

        .items-table {
            margin-top: 7px;
        }

        .items-table th {
            text-align: center;
            vertical-align: middle;
            font-weight: normal;
        }

        .items-table td {
            padding-top: 7px;
            padding-bottom: 7px;
        }

        .page-title {
            text-align: center;
            font-size: 9px;
            margin: 0 0 8px 0;
        }

        .section-label {
            font-size: 8px;
            margin: 8px 0 4px 0;
        }

        .signature-table {
            margin-top: 15px;
        }

        .signature-table td {
            border: none;
            padding: 3px 5px;
        }

        .signature-space {
            padding-top: 5px;
            padding-bottom: 5px;
        }

        .signature-image {
            width: 110px;
            height: 45px;
        }

        .signature-line {
            width: 155px;
            border-top: 0.7px dotted #000;
            margin-top: 38px;
        }

        .signature-label {
            line-height: 1.5;
        }

        .page-number {
            text-align: center;
            font-size: 8px;
            margin-top: 8px;
        }
    </style>
</head>

<body>

    {{-- ============================================================ --}}
    {{-- PAGE 1 --}}
    {{-- ============================================================ --}}

        <table class="header-table">
            <tr>
                <td style="width: 65%;">
                    &nbsp;
                </td>

                <td style="width: 35%;">
                    <div class="form-code-box">
                        <span lang="si">පොදු</span>
                        /
                        <span lang="ta">பொது</span>
                        /
                        General

                        &nbsp;

                        <span class="form-code-number">283</span>

                        <br>

                        (F2* S., T. &amp; E.) 12/76

                        <br>

                        (A4* S., T. &amp; E. 06/2023 - Amended)
                    </div>
                </td>
            </tr>
        </table>

        <div class="heading-section">
            <p class="heading-si" lang="si">
                මූ. රෙ. 104 (3) යටතේ අලාභයන් පිළිබඳ ප්‍රාථමික වාර්තාව
            </p>

            <p class="heading-ta" lang="ta">
                நி.பி. 104 (3) இன் கீழ் இழப்புகள் பற்றிய தொடக்க அறிக்கை
            </p>

            <p class="heading-en">
                PRELIMINARY REPORT OF LOSSES UNDER F. R. 104 (3)
            </p>
        </div>

        <table class="no-border top-info">
            <tr>
                <td style="width: 65%;">
                    <span lang="si">අමාත්‍යාංශයේ ලේකම්</span>
                    /
                    <span lang="ta">அமைச்சின் செயலாளர்</span>
                    /
                    Secretary to the Ministry of

                    <span class="field-line">
                        {{ data_get($document->data, 'ministry', '') ?: '____________________' }}
                    </span>
                </td>

                <td style="width: 35%;">
                    &nbsp;
                </td>
            </tr>

            <tr>
                <td>
                    <span lang="si">පිටපත: විගණකාධිපති</span>
                    /
                    <span lang="ta">
                        பிரதி: கணக்காய்வாளர் தலைமை அதிபதி
                    </span>
                    /
                    Copy to: Auditor-General
                </td>

                <td>
                    <span lang="si">යොමු අංකය</span>
                    /
                    <span lang="ta">தொடர் இல.</span>
                    /
                    Ref. No.:

                    <span class="field-line-short">
                        {{ $document->reference_number ?: '____________' }}
                    </span>
                </td>
            </tr>
        </table>

        <table class="border-table">
            <tr>
                <td class="number-cell">
                    1.
                </td>

                <td class="label-cell">
                    <span lang="si">
                        දෙපාර්තමේන්තුව / සංස්ථාව
                    </span>

                    <br>

                    <span lang="ta">
                        திணைக்களம் / கூட்டுத்தாபனம்
                    </span>

                    <br>

                    <span class="label-en">
                        Department / Corporation
                    </span>
                </td>

                <td class="value-cell medium-padding">
                    {!! nl2br(e(data_get(
                        $document->data,
                        'department',
                        ''
                    ))) !!}
                </td>
            </tr>

            <tr>
                <td class="number-cell">
                    2.
                </td>

                <td class="label-cell">
                    <span lang="si">අලාභය</span>

                    <br>

                    <span lang="ta">இழப்பு</span>

                    <br>

                    <span class="label-en">
                        Loss
                    </span>
                </td>

                <td class="value-cell large-padding">
                    <div>
                        <span class="bold">
                            Date:
                        </span>

                        {{ data_get(
                            $document->data,
                            'lossDate',
                            data_get($document->data, 'date', '')
                        ) }}

                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                        <span class="bold">
                            Place:
                        </span>

                        {{ data_get(
                            $document->data,
                            'lossPlace',
                            data_get($document->data, 'place', '')
                        ) }}
                    </div>

                    <div style="margin-top: 7px;">
                        {!! nl2br(e(data_get(
                            $document->data,
                            'lossDetails',
                            data_get($document->data, 'loss', '')
                        ))) !!}
                    </div>
                </td>
            </tr>

            <tr>
                <td class="number-cell">
                    3.
                </td>

                <td class="label-cell">
                    <span lang="si">
                        අලාභයේ ස්වභාවය
                    </span>

                    <br>

                    <span lang="ta">
                        இழப்பின் தன்மை
                    </span>

                    <br>

                    <span class="label-en">
                        Nature of Loss
                    </span>
                </td>

                <td class="value-cell medium-padding">
                    {!! nl2br(e(data_get(
                        $document->data,
                        'natureOfLoss',
                        ''
                    ))) !!}
                </td>
            </tr>
        </table>

        @php
            $rawItems = data_get($document->data, 'items', []);

            $items = collect(is_array($rawItems) ? $rawItems : [])
                ->filter(function ($item) {
                    return is_array($item);
                })
                ->values()
                ->take(6);

            $minimumItemRows = 6;

            $emptyItemRows = max(
                0,
                $minimumItemRows - $items->count()
            );
        @endphp

        <table class="border-table items-table">
            <tbody>
                <tr>
                    <th style="width: 43%;">
                        <span lang="si">
                            අහිමි වූ භාණ්ඩවල විස්තරය
                        </span>

                        <br>

                        <span lang="ta">
                            இழந்த பொருட்களின் விபரம்
                        </span>

                        <br>

                        <span class="bold">
                            Description of items lost
                        </span>
                    </th>

                    <th style="width: 14%;">
                        <span lang="si">
                            ප්‍රමාණය
                        </span>

                        <br>

                        <span lang="ta">
                            அளவு
                        </span>

                        <br>

                        <span class="bold">
                            Quantity
                        </span>
                    </th>

                    <th style="width: 20%;">
                        <span lang="si">
                            මිනුම් ඒකක
                        </span>

                        <br>

                        <span lang="ta">
                            அளவீட்டு அலகு
                        </span>

                        <br>

                        <span class="bold">
                            Unit of Measure
                        </span>
                    </th>

                    <th style="width: 23%;">
                        <span lang="si">
                            වටිනාකම
                        </span>

                        <br>

                        <span lang="ta">
                            பெறுமதி
                        </span>

                        <br>

                        <span class="bold">
                            Value
                        </span>
                    </th>
                </tr>
            </tbody>

            <tbody>
                @foreach($items as $item)
                    <tr>
                        <td class="medium-padding">
                            {!! nl2br(e(data_get(
                                $item,
                                'description',
                                ''
                            ))) !!}
                        </td>

                        <td class="center">
                            {{ data_get($item, 'quantity', '') }}
                        </td>

                        <td class="center">
                            {{ data_get(
                                $item,
                                'unitOfMeasure',
                                data_get($item, 'unit', '')
                            ) }}
                        </td>

                        <td class="right">
                            {{ data_get($item, 'value', '') }}
                        </td>
                    </tr>
                @endforeach

                @for($row = 0; $row < $emptyItemRows; $row++)
                    <tr>
                        <td class="medium-padding">
                            &nbsp;
                        </td>

                        <td>
                            &nbsp;
                        </td>

                        <td>
                            &nbsp;
                        </td>

                        <td>
                            &nbsp;
                        </td>
                    </tr>
                @endfor
            </tbody>
        </table>

        <table
            class="border-table"
            style="margin-top: 8px;"
        >
            <tr>
                <td class="number-cell">
                    4.
                </td>

                <td class="label-cell">
                    <span lang="si">
                        අලාභයට හේතුව
                    </span>

                    <br>

                    <span lang="ta">
                        இழப்பிற்கான காரணம்
                    </span>

                    <br>

                    <span class="label-en">
                        Cause of Loss
                    </span>
                </td>

                <td class="value-cell large-padding">
                    {!! nl2br(e(data_get(
                        $document->data,
                        'causeOfLoss',
                        ''
                    ))) !!}
                </td>
            </tr>
        </table>

        <div class="page-number">
            1
        </div>

    <pagebreak />

    {{-- ============================================================ --}}
    {{-- PAGE 2 --}}
    {{-- ============================================================ --}}

        <p class="page-title">
            (2)
        </p>

        @php
            $rawOfficers = data_get(
                $document->data,
                'officers',
                []
            );

            $officers = collect(
                is_array($rawOfficers) || $rawOfficers instanceof \Illuminate\Support\Collection
                    ? $rawOfficers
                    : []
            )
                ->filter(function ($officer) {
                    return is_array($officer) || is_object($officer);
                })
                ->values()
                ->take(4);

            $minimumOfficerRows = 4;

            $emptyOfficerRows = max(
                0,
                $minimumOfficerRows - $officers->count()
            );
        @endphp

        <p class="section-label">
            5.
            <span lang="si">
                වගකිවයුතු නිලධාරීන්
            </span>
            /
            <span lang="ta">
                பொறுப்பான அலுவலர்கள்
            </span>
            /
            <span class="bold">
                Officers responsible
            </span>
        </p>

        <table class="border-table">
            <tbody>
                <tr>
                    <th style="width: 6%;">
                        &nbsp;
                    </th>

                    <th style="width: 47%;">
                        <span lang="si">
                            නම
                        </span>

                        <br>

                        <span lang="ta">
                            பெயர்
                        </span>

                        <br>

                        <span class="bold">
                            Name
                        </span>
                    </th>

                    <th style="width: 47%;">
                        <span lang="si">
                            තනතුර
                        </span>

                        <br>

                        <span lang="ta">
                            பதவி
                        </span>

                        <br>

                        <span class="bold">
                            Designation
                        </span>
                    </th>
                </tr>
            </tbody>

            <tbody>
                @foreach($officers as $officer)
                    <tr>
                        <td>
                            &nbsp;
                        </td>

                        <td class="medium-padding">
                            {!! nl2br(e(data_get(
                                $officer,
                                'name',
                                ''
                            ))) !!}
                        </td>

                        <td class="medium-padding">
                            @if(is_object($officer) && method_exists($officer, 'getRoleNames'))
                                {{ $officer->getRoleNames()->implode(', ') }}
                            @else
                                {!! nl2br(e(data_get(
                                    $officer,
                                    'designation',
                                    data_get($officer, 'roles', '')
                                ))) !!}
                            @endif
                        </td>
                    </tr>
                @endforeach

                @for($row = 0; $row < $emptyOfficerRows; $row++)
                    <tr>
                        <td>
                            &nbsp;
                        </td>

                        <td class="medium-padding">
                            &nbsp;
                        </td>

                        <td class="medium-padding">
                            &nbsp;
                        </td>
                    </tr>
                @endfor
            </tbody>
        </table>

        <table
            class="border-table"
            style="margin-top: 8px;"
        >
            <tr>
                <td style="width: 6%; text-align: center; font-weight: bold;">
                    6.
                </td>

                <td style="width: 24%;">
                    <span lang="si">
                        පොලිස් ස්ථානයේ නම
                    </span>

                    <br>

                    <span lang="ta">
                        பொலிஸ் நிலையத்தின் பெயர்
                    </span>

                    <br>

                    <span class="label-en">
                        Name of Police Station
                    </span>
                </td>

                <td style="width: 26%;" class="medium-padding">
                    {!! nl2br(e(data_get(
                        $document->data,
                        'policeStation',
                        ''
                    ))) !!}
                </td>

                <td style="width: 25%;">
                    <span lang="si">
                        පොලිසියට වාර්තා කළ දිනය
                    </span>

                    <br>

                    <span lang="ta">
                        பொலிஸாருக்கு அறிவித்த திகதி
                    </span>

                    <br>

                    <span class="label-en">
                        Date of reporting to Police
                    </span>
                </td>

                <td style="width: 19%;" class="medium-padding">
                    {{ data_get(
                        $document->data,
                        'policeReportDate',
                        ''
                    ) }}
                </td>
            </tr>
        </table>

        <table
            class="border-table"
            style="margin-top: 8px;"
        >
            <tr>
                <td class="number-cell">
                    7.
                </td>

                <td style="width: 34%;">
                    <span lang="si">
                        සිදු කරනු ලබන විමර්ශනයේ ස්වභාවය
                    </span>

                    <br>

                    <span lang="ta">
                        மேற்கொள்ளப்படும் விசாரணையின் தன்மை
                    </span>

                    <br>

                    <span class="label-en">
                        Nature of investigation being carried out
                    </span>
                </td>

                <td style="width: 60%;" class="large-padding">
                    {!! nl2br(e(data_get(
                        $document->data,
                        'investigation',
                        ''
                    ))) !!}
                </td>
            </tr>

            <tr>
                <td class="number-cell">
                    8.
                </td>

                <td style="width: 34%;">
                    <span lang="si">
                        පොත්පත්, වාර්තා ආදියෙහි ආරක්ෂාව සඳහා කරන ලද
                        විධිවිධාන
                    </span>

                    <br>

                    <span lang="ta">
                        புத்தகங்கள், பதிவேடுகள் முதலியவற்றின்
                        பாதுகாப்பிற்காக செய்யப்பட்ட ஏற்பாடுகள்
                    </span>

                    <br>

                    <span class="label-en">
                        Arrangements made for the security of the books,
                        records, etc.
                    </span>
                </td>

                <td style="width: 60%;" class="very-large-padding">
                    {!! nl2br(e(data_get(
                        $document->data,
                        'securityArrangements',
                        ''
                    ))) !!}
                </td>
            </tr>

            <tr>
                <td class="number-cell">
                    9.
                </td>

                <td style="width: 34%;">
                    <span lang="si">
                        තවදුරටත් අලාභ සිදුවීම වැළැක්වීම සඳහා කරන ලද
                        විධිවිධාන
                    </span>

                    <br>

                    <span lang="ta">
                        மேலும் இழப்புகள் ஏற்படுவதைத் தடுப்பதற்காக
                        செய்யப்பட்ட ஏற்பாடுகள்
                    </span>

                    <br>

                    <span class="label-en">
                        Arrangements made for the prevention of further
                        losses
                    </span>
                </td>

                <td style="width: 60%;" class="very-large-padding">
                    {!! nl2br(e(data_get(
                        $document->data,
                        'preventionArrangements',
                        ''
                    ))) !!}
                </td>
            </tr>
        </table>

        <table class="signature-table">
            <tr>
                <td style="width: 48%;">
                    <div>
                        <span lang="si">
                            දිනය
                        </span>

                        /

                        <span lang="ta">
                            திகதி
                        </span>

                        /

                        Date:

                        {{ data_get(
                            $headSignature,
                            'approved_at',
                            ''
                        ) }}
                    </div>

                    <div class="signature-space">
                        @if(data_get(
                            $headSignature,
                            'signature_data_uri'
                        ))
                            <img
                                class="signature-image"
                                src="{{ data_get(
                                    $headSignature,
                                    'signature_data_uri'
                                ) }}"
                                alt="Head of department signature"
                            >
                        @else
                            <div class="signature-line">
                                &nbsp;
                            </div>
                        @endif
                    </div>
                </td>

                <td style="width: 52%;">
                    <div class="signature-space">
                        <div class="signature-line">
                            &nbsp;
                        </div>
                    </div>

                    <div class="signature-label">
                        <span lang="si">
                            දෙපාර්තමේන්තු ප්‍රධානියා /
                            සංස්ථාවේ සභාපති
                        </span>

                        <br>

                        <span lang="ta">
                            திணைக்களத் தலைவர் /
                            கூட்டுத்தாபனத் தலைவர்
                        </span>

                        <br>

                        <span class="bold">
                            Head of Department /
                            Chairman of Corporation
                        </span>
                    </div>
                </td>
            </tr>
        </table>

        <table
            class="no-border"
            style="margin-top: 5px;"
        >
            <tr>
                <td style="width: 50%;">
                    <span lang="si">
                        ඉදිරිපත් කරන ලදී
                    </span>

                    /

                    <span lang="ta">
                        அனுப்பப்பட்டது
                    </span>

                    /

                    <span class="bold">
                        Forwarded
                    </span>
                </td>

                <td style="width: 50%;">
                    <span lang="si">
                        යොමු අංකය
                    </span>

                    /

                    <span lang="ta">
                        தொடர் இல.
                    </span>

                    /

                    Ref. No.:

                    {{ $document->reference_number ?? '' }}
                </td>
            </tr>
        </table>

        <table class="signature-table">
            <tr>
                <td style="width: 48%;">
                    <div>
                        <span lang="si">
                            දිනය
                        </span>

                        /

                        <span lang="ta">
                            திகதி
                        </span>

                        /

                        Date:

                        {{ data_get(
                            $secretarySignature,
                            'approved_at',
                            ''
                        ) }}
                    </div>

                    <div class="signature-space">
                        @if(data_get(
                            $secretarySignature,
                            'signature_data_uri'
                        ))
                            <img
                                class="signature-image"
                                src="{{ data_get(
                                    $secretarySignature,
                                    'signature_data_uri'
                                ) }}"
                                alt="Secretary signature"
                            >
                        @else
                            <div class="signature-line">
                                &nbsp;
                            </div>
                        @endif
                    </div>
                </td>

                <td style="width: 52%;">
                    <div class="signature-space">
                        <div class="signature-line">
                            &nbsp;
                        </div>
                    </div>

                    <div class="signature-label">
                        <span lang="si">
                            අමාත්‍යාංශයේ ලේකම්
                        </span>

                        /

                        <span lang="ta">
                            அமைச்சின் செயலாளர்
                        </span>

                        <br>

                        <span class="bold">
                            Secretary to the Ministry of
                        </span>

                    <span class="field-line-short">
                        {{ data_get(
                            $document->data,
                            'ministry',
                            ''
                        ) ?: '____________' }}
                        </span>
                    </div>
                </td>
            </tr>
        </table>

        <div class="page-number">
            2
        </div>

</body>

</html>

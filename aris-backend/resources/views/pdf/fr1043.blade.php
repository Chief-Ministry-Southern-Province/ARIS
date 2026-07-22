<!DOCTYPE html>
<html lang="si">

<head>

<meta charset="utf-8">

<style>

body,
table,
td,
th,
span,
div,
p,
h1,
h2,
h3,
h4,
h5,
h6 {
    font-family: notosanssinhala, sans-serif;
}

body{
    font-size:11px;
    color:#000;
    line-height:1.35;
}

.page{
    page-break-after: always;
}

.page:last-child{
    page-break-after: auto;
}

table{
    width:100%;
    border-collapse:collapse;
}

td{
    border:1px solid #000;
    padding:6px;
    vertical-align:top;
}

.no-border td{
    border:none;
    padding:2px 6px;
}

.header-table td{
    border:none;
    padding:0;
}

.title{
    text-align:center;
    font-weight:bold;
    font-size:13px;
    margin:2px 0;
}

.subtitle{
    text-align:center;
    font-size:11px;
    margin:2px 0;
}

.small{
    font-size:10px;
}

.label{
    font-weight:bold;
}

.field-line{
    border-bottom:1px solid #000;
    display:inline-block;
    min-width:250px;
}

.section-num{
    font-weight:bold;
    width:4%;
}

.signature{
    margin-top:30px;
    text-align:center;
}

.signature img{
    width:120px;
    height:auto;
}

.page-number{
    text-align:center;
    font-size:10px;
    margin-top:10px;
}

</style>

</head>

<body>

{{-- ==================== PAGE 1 ==================== --}}
<div class="page">

<table class="header-table">
<tr>
    <td width="70%"></td>
    <td width="30%" class="small">
        Gen. 283<br>
        (F2* S., T. &amp; E.) 12/76<br>
        (A4* S., T. &amp; E. 06/2023 - Amended)
    </td>
</tr>
</table>

<p class="subtitle">මූ. රෙ. 104(3) සටහේ අලාභයන් පිළිබඳ ප්‍රාථමික වාර්තාව</p>
<p class="subtitle">நி.பி. 104 (3) இன் கீழ் இழப்புகள் பற்றிய தொடக்க அறிக்கை</p>
<p class="title">PRELIMINARY REPORT OF LOSSES UNDER F. R. 104 (3)</p>

<table class="no-border">
<tr>
    <td width="65%">Secretary to the Ministry of
        <span class="field-line">&nbsp;</span>
    </td>
    <td width="35%" class="small">
        අමාත්‍යාංශයේ ලේකම්<br>
        அமைச்சின் செயலாளர்
    </td>
</tr>
<tr>
    <td>Copy to : Auditor-General<br>
        <span class="small">පිටපත වගඇකසාධ්පති</span>
    </td>
    <td>Ref. No. {{ $document->reference_number }}</td>
</tr>
</table>

<br>

<table>
<tr>
    <td class="section-num">1.</td>
    <td width="30%" class="label">Department/Corporation</td>
    <td>{{ data_get($document->data, 'department') }}</td>
</tr>
<tr>
    <td class="section-num">2.</td>
    <td class="label">Loss</td>
    <td>
        <table class="no-border">
        <tr>
            <td width="50%"><span class="label">Date:</span> {{ data_get($document->data, 'date') }}</td>
            <td width="50%"><span class="label">Place:</span> {{ data_get($document->data, 'place') }}</td>
        </tr>
        </table>
        {{ data_get($document->data, 'loss') }}
    </td>
</tr>
<tr>
    <td class="section-num">3.</td>
    <td class="label">Nature of Loss</td>
    <td>{{ data_get($document->data, 'natureOfLoss') }}</td>
</tr>
</table>

<br>

<table>
<tr>
    <td class="label" width="40%">Description of items lost</td>
    <td class="label" width="15%">Quantity</td>
    <td class="label" width="20%">Units of Measure</td>
    <td class="label" width="25%">Value</td>
</tr>
@forelse(data_get($document->data, 'items', []) as $item)
<tr>
    <td>{{ data_get($item, 'description', '') }}</td>
    <td>{{ data_get($item, 'quantity', '') }}</td>
    <td>{{ data_get($item, 'unitOfMeasure', data_get($item, 'unit', '')) }}</td>
    <td>{{ data_get($item, 'value', '') }}</td>
</tr>
@empty
<tr>
    <td style="height:180px;">&nbsp;</td>
    <td></td>
    <td></td>
    <td></td>
</tr>
@endforelse
</table>

<br>

<table>
<tr>
    <td class="section-num">4.</td>
    <td class="label" width="30%">Cause of Loss</td>
    <td>{{ data_get($document->data, 'causeOfLoss') }}</td>
</tr>
</table>

<div class="page-number">1</div>

</div>

{{-- ==================== PAGE 2 ==================== --}}
<div class="page">

<p class="title">(2)</p>

<table>
<tr>
    <td class="section-num">5.</td>
    <td class="label" colspan="2">Officers responsible</td>
</tr>
<tr>
    <td></td>
    <td class="label" width="48%">Name</td>
    <td class="label" width="48%">Designation</td>
</tr>
@forelse(data_get($document->data, 'officers', []) as $officer)
<tr>
    <td></td>
    <td>{{ data_get($officer, 'name', '') }}</td>
    <td>{{ data_get($officer, 'designation', '') }}</td>
</tr>
@empty
<tr>
    <td></td>
    <td style="height:100px;">&nbsp;</td>
    <td></td>
</tr>
@endforelse
</table>

<br>

<table>
<tr>
    <td class="section-num">6.</td>
    <td class="label" width="30%">Name of Police Station</td>
    <td width="35%">{{ data_get($document->data, 'policeStation') }}</td>
    <td class="label" width="20%">Date of reporting to Police</td>
    <td width="15%">{{ data_get($document->data, 'policeReportDate') }}</td>
</tr>
</table>

<br>

<table>
<tr>
    <td class="section-num">7.</td>
    <td class="label" width="30%">Nature of Investigation being carried out</td>
    <td>{{ data_get($document->data, 'investigation') }}</td>
</tr>
<tr>
    <td class="section-num">8.</td>
    <td class="label">Arrangements made for the security of the books, records, etc.</td>
    <td>{{ data_get($document->data, 'securityArrangements') }}</td>
</tr>
<tr>
    <td class="section-num">9.</td>
    <td class="label">Arrangements made for the prevention of further losses</td>
    <td>{{ data_get($document->data, 'preventionArrangements') }}</td>
</tr>
</table>

<br><br>

<table class="no-border">
<tr>
    <td width="50%">
        Date : {{ data_get($headSignature, 'approved_at', '') }}
        @if($headSignature)
        <div class="signature">
            <img src="{{ data_get($headSignature, 'signature_data_uri') }}" alt="Approval signature">
        </div>
        @endif
    </td>
    <td width="50%" class="small">
        Head of Department / Chairman of Corporation<br>
        தினைக்களத் தலைவர் / கூட்டுத்தாபனத்தவரசாளர்
    </td>
</tr>
<tr>
    <td>Forwarded</td>
    <td>Ref. No. {{ $document->reference_number }}</td>
</tr>
<tr>
    <td>
        Date : {{ data_get($secretarySignature, 'approved_at', '') }}
        @if($secretarySignature)
        <div class="signature">
            <img src="{{ $secretarySignature['signature_data_uri'] }}" alt="Approval signature">
        </div>
        @endif
    </td>
    <td class="small">
        Secretary to the Ministry of <span class="field-line">&nbsp;</span><br>
        அமைச்சின் செயலாளர்
    </td>
</tr>
</table>

<div class="page-number">4</div>

</div>

</body>

</html>

<!DOCTYPE html>
<html>

<head>

<meta charset="utf-8">

<style>

body{
    font-family: DejaVu Sans,sans-serif;
    font-size:12px;
    color:#000;
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

.section-title{
    font-weight:bold;
    background:#efefef;
    padding:6px;
}

.signature{
    margin-top:40px;
    text-align:center;
}

.signature img{
    width:140px;
    height:auto;
}

</style>

</head>

<body>

<h2 style="text-align:center;">FR104(3)</h2>
<p style="text-align:center;">Preliminary Report of Loss or Damage</p>

<div class="section-title">
Part A
</div>

<table>

<tr>
<td width="35%">Reference Number</td>
<td>{{ $document->reference_number }}</td>
</tr>

<tr>
<td>Date</td>
<td>{{ data_get($document->data, 'date') ?? $document->created_at?->format('Y-m-d') }}</td>
</tr>

<tr>
<td>Case</td>
<td>{{ $case->case_number }}</td>
</tr>

</table>

<br>

<div class="section-title">Approval Signatures</div>

@forelse($signatures as $signature)
<div class="signature">
    <img src="{{ $signature['signature_data_uri'] }}" alt="Approval signature">
    <div><strong>{{ $signature['name'] }}</strong></div>
    <div>{{ $signature['role'] ?? 'Approver' }}</div>
    <div>{{ $signature['approved_at']?->format('Y-m-d H:i') }}</div>
</div>
@empty
<p>No approval signatures have been recorded for this revision.</p>
@endforelse

</body>

</html>

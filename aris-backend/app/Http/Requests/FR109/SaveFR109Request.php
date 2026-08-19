<?php

namespace App\Http\Requests\FR109;

use Illuminate\Foundation\Http\FormRequest;

class SaveFR109Request extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'data' => ['required', 'array'],
            'data.netLoss' => ['nullable', 'numeric', 'min:0'],
            'data.originalCost' => ['nullable', 'numeric', 'min:0'],
            'data.estimatedCostAtTimeOfLoss' => ['nullable', 'string', 'max:255'],
            'data.replacementValue' => ['nullable', 'string', 'max:255'],
            'data.valueUnderFr105' => ['nullable', 'string', 'max:255'],
            'data.amountRecovered' => ['nullable', 'string', 'max:255'],
            'data.department' => ['nullable', 'string', 'max:255'],
            'data.refNo' => ['nullable', 'string', 'max:255'],
            'data.preliminaryReportReferenceNo' => ['nullable', 'string', 'max:255'],
            'data.finalReportReferenceNo' => ['nullable', 'string', 'max:255'],
            'data.preliminaryDate' => ['nullable', 'date'],
            'data.finalDate' => ['nullable', 'date'],
            'data.descriptionOfProperty' => ['nullable', 'string'],
            'data.quantity' => ['nullable', 'string', 'max:255'],
            'data.properties' => ['nullable', 'array'],
            'data.properties.*.id' => ['nullable', 'string', 'max:100'],
            'data.properties.*.description' => ['nullable', 'string'],
            'data.properties.*.quantity' => ['nullable', 'string', 'max:255'],
            'data.nameOfCourt' => ['nullable', 'string', 'max:255'],
            'data.caseNo' => ['nullable', 'string', 'max:255'],
            'data.outcomeOfLegalAction' => ['nullable', 'string'],
            'data.reasonsForNonRecovery' => ['nullable', 'string'],
            'data.actionTakenDetails' => ['nullable', 'string'],
            'data.resultsOfAction' => ['nullable', 'string'],
            'data.chiefAccountingOfficerSTNo' => ['nullable', 'string', 'max:255'],
            'data.writeOffStatus' => ['nullable', 'in:AUTHORISED,NOT_APPROVED'],
            'data.surchargedOfficers' => ['nullable', 'array'],
            'data.surchargedOfficers.*.nameOfOfficer' => ['nullable', 'string', 'max:255'],
            'data.surchargedOfficers.*.designation' => ['nullable', 'string', 'max:255'],
            'data.surchargedOfficers.*.amountSurcharged' => ['nullable', 'string', 'max:255'],
            'data.surchargedOfficers.*.amountRecoveredSurcharge' => ['nullable', 'string', 'max:255'],
            'data.surchargedOfficers.*.dateOfRecovery' => ['nullable', 'date'],
            'data.surchargedOfficers.*.receiptNo' => ['nullable', 'string', 'max:255'],
            'data.surchargedOfficers.*.creditParticulars' => ['nullable', 'string'],
            'data.surchargedOfficers.*.balanceNotRecovered' => ['nullable', 'string', 'max:255'],
            'data.writeOffEntries' => ['nullable', 'array'],
            'data.writeOffEntries.*.stockBookFolio' => ['nullable', 'string', 'max:255'],
            'data.writeOffEntries.*.inventoryBookFolio' => ['nullable', 'string', 'max:255'],
            'data.writeOffEntries.*.fixedAssetsRegisterFolio' => ['nullable', 'string', 'max:255'],
            'data.writeOffEntries.*.ledgerFolio' => ['nullable', 'string', 'max:255'],
        ];
    }
}

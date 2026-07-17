<?php

namespace App\Http\Requests\FR1044;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFR1044Request extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Top-level (fr1044s table columns)
            // accident_case_id is intentionally NOT accepted here — it should
            // never change after creation. If you do allow moving a report
            // to a different case, add it back with 'sometimes|integer|exists:accident_cases,id'.
            'status' => ['sometimes', Rule::in([
                'DRAFT',
                'SUBMITTED',
                'UNDER_APPROVAL',
                'CHANGES_REQUESTED',
                'APPROVED',
            ])],

            'data' => ['sometimes', 'array'],

            // Part A - General Information (items 1-3, header)
            'data.referenceNo' => ['sometimes', 'nullable', 'string', 'max:100'],
            'data.ministry' => ['sometimes', 'required', 'string', 'max:255'],
            'data.lossDate' => ['sometimes', 'required', 'date'],
            'data.lossTime' => ['sometimes', 'nullable', 'date_format:H:i'],
            'data.location' => ['sometimes', 'required', 'string', 'max:255'],
            'data.copyToAuditorGeneral' => ['sometimes', 'required', Rule::in(['yes', 'no'])],

            'data.investigation' => ['sometimes', 'nullable', 'string'],

            // Preliminary Report
            'data.preliminaryReportRefNo' => ['sometimes', 'nullable', 'string', 'max:100'],
            'data.preliminaryReportDate' => ['sometimes', 'nullable', 'date'],

            // Part B - Loss Details (item 4)
            'data.lossDetails' => ['sometimes', 'required', 'string'],
            'data.circumstances' => ['sometimes', 'required', 'string'],

            // Part C - Cause of Loss (item 5)
            'data.causeOfLoss' => ['sometimes', 'nullable', 'string'],
            'data.isDueToFraudNegligence' => ['sometimes', 'required', Rule::in(['yes', 'no'])],

            // Part D - Police Information (item 6)
            'data.policeReportFile' => ['sometimes', 'nullable', 'string'],

            // Part G - Legal Action (item 9)
            'data.courtName' => ['sometimes', 'nullable', 'string', 'max:255'],
            'data.courtCaseNo' => ['sometimes', 'nullable', 'string', 'max:100'],
            'data.courtOrderSummary' => ['sometimes', 'nullable', 'string'],
            'data.courtOrderFile' => ['sometimes', 'nullable', 'string'],

            // Part J - Insurance (item 11)
            'data.insuranceRecoverableAmountWords' => ['sometimes', 'nullable', 'string'],
            'data.policyNo' => ['sometimes', 'nullable', 'string', 'max:100'],
            'data.amountInsured' => ['sometimes', 'nullable', 'numeric', 'min:0'],
            'data.amountRecoverable' => ['sometimes', 'nullable', 'numeric', 'min:0'],

            // Part L - Recommendations (item 13)
            'data.recommendations' => ['sometimes', 'nullable', 'string'],
            'data.boardReportFile' => ['sometimes', 'nullable', 'string'],

            // Part M - Preventive Actions (item 14)
            'data.preventiveActions' => ['sometimes', 'nullable', 'string'],

            // Part N - Approval Workflow (signature block)
            'data.preparedBy' => ['sometimes', 'nullable', 'string', 'max:255'],
            'data.preparedDesignation' => ['sometimes', 'nullable', 'string', 'max:255'],
            'data.preparedByUserId' => ['sometimes', 'nullable', 'integer', 'exists:users,id'],
            'data.preparedSignature' => ['sometimes', 'nullable', 'string'],
            'data.preparedDate' => ['sometimes', 'nullable', 'date'],

            'data.headName' => ['sometimes', 'nullable', 'string', 'max:255'],
            'data.headDesignation' => ['sometimes', 'nullable', 'string', 'max:255'],
            'data.headUserId' => ['sometimes', 'nullable', 'integer', 'exists:users,id'],
            'data.headSignature' => ['sometimes', 'nullable', 'string'],
            'data.headApprovalDate' => ['sometimes', 'nullable', 'date'],

            'data.secretaryName' => ['sometimes', 'nullable', 'string', 'max:255'],
            'data.secretaryDesignation' => ['sometimes', 'nullable', 'string', 'max:255'],
            'data.secretaryUserId' => ['sometimes', 'nullable', 'integer', 'exists:users,id'],
            'data.secretarySignature' => ['sometimes', 'nullable', 'string'],
            'data.secretaryApprovalDate' => ['sometimes', 'nullable', 'date'],

            // Part O - Forwarding (item 15)
            'data.forwardingRefNo' => ['sometimes', 'nullable', 'string', 'max:100'],
            'data.forwardingDate' => ['sometimes', 'nullable', 'date'],

            // Part E - Lost Items (item 7)
            'data.lostItems' => ['sometimes', 'array', 'min:1'],
            'data.lostItems.*.description' => ['required_with:data.lostItems', 'string', 'max:255'],
            'data.lostItems.*.unit' => ['nullable', 'string', 'max:50'],
            'data.lostItems.*.quantity' => ['required_with:data.lostItems', 'numeric', 'min:0'],
            'data.lostItems.*.estimatedCost' => ['nullable', 'numeric', 'min:0'],
            'data.lostItems.*.replacementCost' => ['nullable', 'numeric', 'min:0'],
            'data.lostItems.*.fr105Value' => ['nullable', 'numeric', 'min:0'],
            'data.lostItems.*.originalCost' => ['nullable', 'numeric', 'min:0'],

            // Part F - Officers Responsible (item 8)
            'data.officers' => ['sometimes', 'array'],
            'data.officers.*.name' => ['required_with:data.officers', 'string', 'max:255'],
            'data.officers.*.designation' => ['nullable', 'string', 'max:255'],
            'data.officers.*.responsibility' => ['nullable', 'string'],
            'data.officers.*.disciplinaryAction' => ['nullable', 'string'],
            'data.officers.*.punishment' => ['nullable', 'string'],

            // Part I - Recovery Information (item 10)
            'data.recoveries' => ['sometimes', 'array'],
            'data.recoveries.*.officer' => ['required_with:data.recoveries', 'string', 'max:255'],
            'data.recoveries.*.amount' => ['nullable', 'numeric', 'min:0'],
            'data.recoveries.*.method' => ['nullable', 'string'],

            // Part K - Board of Inquiry (item 12)
            'data.boardMembers' => ['sometimes', 'array'],
            'data.boardMembers.*.memberName' => ['required_with:data.boardMembers', 'string', 'max:255'],
            'data.boardMembers.*.designation' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'data.ministry' => 'ministry/department',
            'data.lossDate' => 'date of loss',
            'data.lossTime' => 'time of loss',
            'data.isDueToFraudNegligence' => 'fraud/negligence determination',
            'data.lostItems' => 'lost items',
            'data.lostItems.*.description' => 'item description',
            'data.lostItems.*.quantity' => 'item quantity',
        ];
    }
}
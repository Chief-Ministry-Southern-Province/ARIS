<?php

namespace App\Http\Requests\FR1044;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFR1044Request extends FormRequest
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
            'status' => ['nullable', Rule::in([
                'DRAFT',
                'SUBMITTED',
                'UNDER_APPROVAL',
                'CHANGES_REQUESTED',
                'APPROVED',
            ])],

            'data' => ['required', 'array'],

            // Part A - General Information (items 1-3, header)
            'data.referenceNo' => ['nullable', 'string', 'max:100'],
            
            'data.ministry' => ['nullable', 'string', 'max:255'],
            'data.lossDate' => ['nullable', 'date'],
            'data.lossTime' => ['nullable', 'date_format:H:i'],
            'data.location' => ['nullable', 'string', 'max:255'],
            'data.copyToAuditorGeneral' => ['nullable', Rule::in(['yes', 'no'])],

            'data.investigation' => ['nullable', 'string'],

            // Preliminary Report
            'data.preliminaryReportRefNo' => ['nullable', 'string', 'max:100'],
            'data.preliminaryReportDate' => ['nullable', 'date'],

            // Part B - Loss Details (item 4)
            'data.lossDetails' => ['nullable', 'string'],
            'data.circumstances' => ['nullable', 'string'],

            // Part C - Cause of Loss (item 5)
            'data.causeOfLoss' => ['nullable', 'string'],
            'data.isDueToFraudNegligence' => ['nullable', Rule::in(['yes', 'no'])],

            // Part D - Police Information (item 6)
            'data.policeReportFile' => ['nullable', 'string'],
            'data.policeReportEvidenceId' => ['nullable', 'integer', 'exists:accident_evidence,id'],

            // Part G - Legal Action (item 9)
            'data.courtName' => ['nullable', 'string', 'max:255'],
            'data.courtCaseNo' => ['nullable', 'string', 'max:100'],
            'data.courtOrderSummary' => ['nullable', 'string'],
            'data.courtOrderFile' => ['nullable', 'string'],
            'data.courtOrderEvidenceId' => ['nullable', 'integer', 'exists:accident_evidence,id'],

            // Part J - Insurance (item 11)
            'data.insuranceRecoverableAmountWords' => ['nullable', 'string'],
            'data.policyNo' => ['nullable', 'string', 'max:100'],
            'data.amountInsured' => ['nullable', 'numeric', 'min:0'],
            'data.amountRecoverable' => ['nullable', 'numeric', 'min:0'],

            // Part L - Recommendations (item 13)
            'data.recommendations' => ['nullable', 'string'],
            'data.boardReportFile' => ['nullable', 'string'],
            'data.boardReportEvidenceId' => ['nullable', 'integer', 'exists:accident_evidence,id'],

            // Part M - Preventive Actions (item 14)
            'data.preventiveActions' => ['nullable', 'string'],

            // Part N - Approval Workflow (signature block)
            'data.preparedBy' => ['nullable', 'string', 'max:255'],
            'data.preparedDesignation' => ['nullable', 'string', 'max:255'],
            'data.preparedByUserId' => ['nullable', 'integer', 'exists:users,id'],
            'data.preparedSignature' => ['nullable', 'string'],
            'data.preparedDate' => ['nullable', 'date'],

            'data.headName' => ['nullable', 'string', 'max:255'],
            'data.headDesignation' => ['nullable', 'string', 'max:255'],
            'data.headUserId' => ['nullable', 'integer', 'exists:users,id'],
            'data.headSignature' => ['nullable', 'string'],
            'data.headApprovalDate' => ['nullable', 'date'],

            'data.secretaryName' => ['nullable', 'string', 'max:255'],
            'data.secretaryDesignation' => ['nullable', 'string', 'max:255'],
            'data.secretaryUserId' => ['nullable', 'integer', 'exists:users,id'],
            'data.secretarySignature' => ['nullable', 'string'],
            'data.secretaryApprovalDate' => ['nullable', 'date'],

            // Part O - Forwarding (item 15)
            'data.forwardingRefNo' => ['nullable', 'string', 'max:100'],
            'data.forwardingDate' => ['nullable', 'date'],

            // Part E - Lost Items (item 7)
            'data.lostItems' => ['nullable', 'array'],
            'data.lostItems.*.description' => ['nullable', 'string', 'max:255'],
            'data.lostItems.*.unit' => ['nullable', 'string', 'max:50'],
            'data.lostItems.*.quantity' => ['nullable', 'numeric', 'min:0'],
            'data.lostItems.*.estimatedCost' => ['nullable', 'numeric', 'min:0'],
            'data.lostItems.*.replacementCost' => ['nullable', 'numeric', 'min:0'],
            'data.lostItems.*.fr105Value' => ['nullable', 'numeric', 'min:0'],
            'data.lostItems.*.originalCost' => ['nullable', 'numeric', 'min:0'],

            // Part F - Officers Responsible (item 8)
            'data.officers' => ['nullable', 'array'],
            'data.officers.*.name' => ['nullable', 'string', 'max:255'],
            'data.officers.*.designation' => ['nullable', 'string', 'max:255'],
            'data.officers.*.responsibility' => ['nullable', 'string'],
            'data.officers.*.disciplinaryAction' => ['nullable', 'string'],
            'data.officers.*.punishment' => ['nullable', 'string'],

            // Part I - Recovery Information (item 10)
            'data.recoveries' => ['nullable', 'array'],
            'data.recoveries.*.officer' => ['nullable', 'string', 'max:255'],
            'data.recoveries.*.amount' => ['nullable', 'numeric', 'min:0'],
            'data.recoveries.*.method' => ['nullable', 'string'],

            // Part K - Board of Inquiry (item 12)
            'data.boardMembers' => ['nullable', 'array'],
            'data.boardMembers.*.memberName' => ['nullable', 'string', 'max:255'],
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

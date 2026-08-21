<?php

namespace App\Services;

use Illuminate\Support\Facades\Validator;

/** Validates all creator-editable fields before an FR document enters approval. */
class FRSubmissionValidationService
{
    public function validateFR1043(array $data): void
    {
        Validator::make(['data' => $data], [
            'data.department' => ['required', 'string'], 'data.date' => ['required', 'date'],
            'data.place' => ['required', 'string'], 'data.natureOfLoss' => ['required', 'string'],
            'data.causeOfLoss' => ['required', 'string'], 'data.policeStation' => ['required', 'string'],
            'data.policeReportDate' => ['required', 'date'], 'data.investigation' => ['required', 'string'],
            'data.securityArrangements' => ['required', 'string'], 'data.preventionArrangements' => ['required', 'string'],
            'data.items' => ['required', 'array', 'min:1'], 'data.items.*.description' => ['required', 'string'],
            'data.items.*.quantity' => ['required', 'numeric', 'min:0'],
            'data.officers' => ['required', 'array', 'min:1'], 'data.officers.*.name' => ['required', 'string'],
            'data.officers.*.designation' => ['required', 'string'],
        ])->validate();
    }

    public function validateFR1044(array $data): void
    {
        Validator::make(['data' => $data], [
            'data.department' => ['required', 'string'], 'data.secretaryOfMinistry' => ['required', 'string'],
            'data.lossDate' => ['required', 'date'], 'data.lossTime' => ['required', 'date_format:H:i'],
            'data.location' => ['required', 'string'], 'data.investigation' => ['required', 'string'],
            'data.preliminaryReportRefNo' => ['required', 'string'], 'data.preliminaryReportDate' => ['required', 'date'],
            'data.lossDetails' => ['required', 'string'], 'data.circumstances' => ['required', 'string'],
            'data.causeOfLoss' => ['required', 'string'], 'data.isDueToFraudNegligence' => ['required', 'in:yes,no'],
            'data.policeReportSummary' => ['required', 'string'], 'data.policeReportEvidenceId' => ['required', 'integer'],
            'data.courtName' => ['required', 'string'], 'data.courtCaseNo' => ['required', 'string'],
            'data.courtOrderSummary' => ['required', 'string'], 'data.courtOrderEvidenceId' => ['required', 'integer'],
            'data.insuranceRecoverableAmountWords' => ['required', 'string'], 'data.policyNo' => ['required', 'string'],
            'data.amountInsured' => ['required', 'numeric', 'min:0'], 'data.amountRecoverable' => ['required', 'numeric', 'min:0'],
            'data.recommendations' => ['required', 'string'], 'data.boardReportSummary' => ['required', 'string'],
            'data.boardReportEvidenceId' => ['required', 'integer'], 'data.preventiveActions' => ['required', 'string'],
            'data.lostItems' => ['required', 'array', 'min:1'], 'data.lostItems.*.description' => ['required', 'string'],
            'data.lostItems.*.unit' => ['required', 'string'], 'data.lostItems.*.quantity' => ['required', 'numeric', 'min:0'],
            'data.lostItems.*.estimatedCost' => ['required', 'numeric', 'min:0'], 'data.lostItems.*.replacementCost' => ['required', 'numeric', 'min:0'],
            'data.lostItems.*.fr105Value' => ['required', 'numeric', 'min:0'], 'data.lostItems.*.originalCost' => ['required', 'numeric', 'min:0'],
            'data.officers' => ['required', 'array', 'min:1'], 'data.officers.*.name' => ['required', 'string'],
            'data.officers.*.designation' => ['required', 'string'], 'data.officers.*.responsibility' => ['required', 'string'],
            'data.officers.*.disciplinaryAction' => ['required', 'string'], 'data.officers.*.punishment' => ['required', 'string'],
            'data.recoveries' => ['required', 'array', 'min:1'], 'data.recoveries.*.officer' => ['required', 'string'],
            'data.recoveries.*.amount' => ['required', 'numeric', 'min:0'], 'data.recoveries.*.method' => ['required', 'string'],
            'data.boardMembers' => ['required', 'array', 'min:1'], 'data.boardMembers.*.memberName' => ['required', 'string'],
            'data.boardMembers.*.designation' => ['required', 'string'],
        ])->validate();
    }

    public function validateFR109(array $data): void
    {
        Validator::make(['data' => $data], [
            'data.department' => ['required', 'string'], 'data.preliminaryReportReferenceNo' => ['required', 'string'],
            'data.finalReportReferenceNo' => ['required', 'string'], 'data.preliminaryDate' => ['required', 'date'],
            'data.finalDate' => ['required', 'date'], 'data.properties' => ['required', 'array', 'min:1'],
            'data.properties.*.description' => ['required', 'string'], 'data.properties.*.quantity' => ['required', 'numeric', 'min:1'],
            'data.originalCost' => ['required', 'numeric', 'min:0'], 'data.estimatedCostAtTimeOfLoss' => ['required', 'numeric', 'min:0'],
            'data.replacementValue' => ['required', 'numeric', 'min:0'], 'data.valueUnderFr105' => ['required', 'numeric', 'min:0'],
            'data.amountRecovered' => ['required', 'numeric', 'min:0'], 'data.netLoss' => ['required', 'numeric', 'min:0'],
            'data.nameOfCourt' => ['required', 'string'], 'data.caseNo' => ['required', 'string'],
            'data.outcomeOfLegalAction' => ['required', 'string'], 'data.reasonsForNonRecovery' => ['required', 'string'],
            'data.actionTakenDetails' => ['required', 'string'], 'data.resultsOfAction' => ['required', 'string'],
            'data.surchargedOfficers' => ['required', 'array', 'min:1'], 'data.surchargedOfficers.*.nameOfOfficer' => ['required', 'string'],
            'data.surchargedOfficers.*.designation' => ['required', 'string'], 'data.surchargedOfficers.*.amountSurcharged' => ['required', 'numeric', 'min:0'],
            'data.surchargedOfficers.*.amountRecoveredSurcharge' => ['required', 'numeric', 'min:0'], 'data.surchargedOfficers.*.dateOfRecovery' => ['required', 'date'],
            'data.surchargedOfficers.*.receiptNo' => ['required', 'string'], 'data.surchargedOfficers.*.creditParticulars' => ['required', 'string'],
            'data.surchargedOfficers.*.balanceNotRecovered' => ['required', 'numeric', 'min:0'],
        ])->validate();
    }
}

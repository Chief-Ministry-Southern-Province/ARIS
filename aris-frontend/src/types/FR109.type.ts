export type FR109Status =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_APPROVAL"
  | "CHANGES_REQUESTED"
  | "APPROVED";

export interface SurchargedOfficer {
  nameOfOfficer: string;
  designation: string;
  amountSurcharged: string;
  amountRecoveredSurcharge: string;
  dateOfRecovery: string;
  receiptNo: string;
  creditParticulars: string;
  balanceNotRecovered: string;
}

export interface FR109FormData {
  // 1. Department
  department: string;

  // 2. Report
  finalReportReferenceNo: string;
  preliminaryReportReferenceNo: string;
  preliminaryDate: string;
  finalDate: string;

  // 3. Particulars of property
  descriptionOfProperty: string;
  quantity: string;

  // 4. Value of loss
  originalCost: string;
  estimatedCostAtTimeOfLoss: string;
  replacementValue: string;
  valueUnderFr105: string;
  amountRecovered: string;
  netLoss: string;

  // 7. Legal action / surcharges
  nameOfCourt: string;
  caseNo: string;
  outcomeOfLegalAction: string;
  surchargedOfficers: SurchargedOfficer[];

  // 8. Non-recovery reasons / action taken
  reasonsForNonRecovery: string;
  actionTakenDetails: string;
  resultsOfAction: string;
  chiefAccountantDate: string;
  chiefAccountantSignature: string;

  // 9. Head of Department order
  headOfDeptSecretaryMinistry: string;
  headOfDeptDate: string;

  // 10. Chief Accounting Officer order
  chiefAccountingSerialNo: string;
  chiefAccountingRefNo: string;
  chiefAccountingDate: string;
  chiefAccountingSecretaryMinistry: string;

  // 11. Write off decision
  writeOffSecretaryMinistry: string;
  writeOffRefNo: string;
  writeOffDate: string;
  writeOffStatus: "" | "AUTHORISED" | "NOT_APPROVED";

  // 12. Write off noted in
  stockBookFolio: string;
  inventoryBookFolio: string;
  fixedAssetsRegisterFolio: string;
  ledgerFolio: string;

  refNo?: string;
}

export interface FR109Response {
  id: number;
  reference_number: string;
  revision: number;
  status: FR109Status;
  submitted_at?: string | null;
  data: FR109FormData;
}

export interface FR109Payload {
  status: FR109Status;
  data: FR109FormData;
}
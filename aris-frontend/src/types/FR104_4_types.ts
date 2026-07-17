// NOTE: This file is reconstructed/inferred from initialFormData.ts and the
// section component props observed in FR104_4Form.tsx, since the original
// FR104_4_types.ts wasn't shared. Diff it against your actual file before
// replacing — field names should match, but double-check anything not
// listed below (e.g. any extra fields your section components already use).

export interface LostItem {
  id: string;
  description: string;
  unit: string;
  quantity: string;
  estimatedCost: string;       // 7.4 Approximate/estimated cost at time of loss
  replacementCost: string;     // 7.5 Replacement value or cost of repairs
  fr105Value: string;          // 7.6 Value in terms of F.R. 105(1)  <-- was missing
  originalCost: string;        // 7.7 Original Cost
}

export interface ResponsibleOfficer {
  id: string;
  name: string;
  designation: string;
  responsibility: string;      // 8.3 Nature of Responsibility
  disciplinaryAction: string;  // 8.4 Was disciplinary action taken
  punishment: string;          // 8.5 Details of Punishment
}

export interface BoardMember {
  id: string;
  memberName: string;
  designation: string;
}

export interface RecoveryItem {
  id: string;
  officer: string;
  amount: string;
  method: string;
}

export interface FR104_4FormData {
  // General Information (items 1-3, header block)
  referenceNo: string;
  ministry: string;
  lossDate: string;
  lossTime: string;
  location: string;
  copyToAuditorGeneral: string; // "yes" | "no" — header "Copy to: Auditor-General"  <-- was missing

  investigation: string;

  // Preliminary Report
  preliminaryReportRefNo: string;
  preliminaryReportDate: string;

  // Loss Details (item 4)
  lossDetails: string;
  circumstances: string;

  // Cause of Loss (item 5)
  causeOfLoss: string;
  isDueToFraudNegligence: string; // "yes" | "no" — item 5's direct yes/no question  <-- was missing

  // Police Information (item 6)
  policeReportFile: File | null;

  // Legal Action (item 9)
  courtName: string;
  courtCaseNo: string;
  courtOrderSummary: string;
  courtOrderFile: File | null;

  // Insurance (item 11)
  insuranceRecoverableAmountWords: string;
  policyNo: string;
  amountInsured: string;
  amountRecoverable: string;

  // Recommendations (item 13)
  recommendations: string;
  boardReportFile: File | null;

  // Preventive Actions (item 14)
  preventiveActions: string;

  lostItems: LostItem[];
  officers: ResponsibleOfficer[];
  boardMembers: BoardMember[];
  recoveries: RecoveryItem[];
}
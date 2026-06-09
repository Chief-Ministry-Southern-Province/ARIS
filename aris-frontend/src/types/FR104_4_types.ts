export interface LostItem {
  description: string;
  unit: string;
  quantity: string;
  estimatedCost: string;
  replacementCost: string;
  originalCost: string;
}

export interface Officer {
  name: string;
  designation: string;
  responsibility: string;
  disciplinaryAction: string;
  punishment: string;
}

export interface BoardMember {
  name: string;
  designation: string;
}

export interface RecoveryRecord {
  officerName: string;
  amountRecoverable: string;
  recoveryMethod: string;
}

export interface FR104_4FormData {
  // General Information
  referenceNo: string;
  ministry: string;
  lossDate: string;
  lossTime: string;
  location: string;

  // Preliminary Report
  preliminaryReportRefNo: string;
  preliminaryReportDate: string;

  // Loss Details
  lossDetails: string;
  circumstances: string;
  causeOfLoss: string;

  // Police Information
  policeReportFile: File | null;

  // Legal Action
  courtName: string;
  courtCaseNo: string;
  courtOrderSummary: string;
  courtOrderFile: File | null;

  // Insurance Information
  insuranceRecoverableAmountWords: string;
  policyNo: string;
  amountInsured: string;
  amountRecoverable: string;

  // Recommendations
  recommendations: string;
  boardReportFile: File | null;

  // Preventive Actions
  preventiveActions: string;

  // Approval Workflow
  preparedByUserId: string;
  preparedSignature: string | null;
  preparedDate: string;

  headUserId: string;
  headSignature: string | null;
  headApprovalDate: string;

  secretaryUserId: string;
  secretarySignature: string | null;
  secretaryApprovalDate: string;

  // Dynamic Collections
  lostItems: LostItem[];
  officers: Officer[];
  boardMembers: BoardMember[];
  recoveries: RecoveryRecord[];
}
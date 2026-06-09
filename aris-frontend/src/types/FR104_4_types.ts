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

export interface FR104_4FormData {
  // General Information
  referenceNo: string;
  ministry: string;
  lossDate: string;
  lossTime: string;
  location: string;

  // Loss Details
  lossDetails: string;
  circumstances: string;
  causeOfLoss: string;

  // Police Information
  policeStation: string;
  caseNumber: string;
  officerName: string;
  reportDate: string;

  // Investigation
  investigation: string;

  // Recovery
  recoveryOfficer: string;
  recoveryAmount: string;
  recoveryMethod: string;

  // Insurance
  policyNo: string;
  insuranceCompany: string;
  amountInsured: string;
  amountRecoverable: string;

  // Recommendations
  recommendations: string;
  preventiveActions: string;

  // Approval
  preparedBy: string;
  preparedDesignation: string;
  approvedBy: string;
  approvalDate: string;

  // Dynamic Tables
  lostItems: LostItem[];
  officers: Officer[];
  boardMembers: BoardMember[];
}
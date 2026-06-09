import type { FR104_4FormData } from "@/types/FR104_4_types";

export const initialFormData: FR104_4FormData = {
  referenceNo: "",
  ministry: "",
  lossDate: "",
  lossTime: "",
  location: "",

  lossDetails: "",
  circumstances: "",
  causeOfLoss: "",

  policeStation: "",
  caseNumber: "",
  officerName: "",
  reportDate: "",

  investigation: "",

  recoveryOfficer: "",
  recoveryAmount: "",
  recoveryMethod: "",

  policyNo: "",
  insuranceCompany: "",
  amountInsured: "",
  amountRecoverable: "",

  recommendations: "",
  preventiveActions: "",

  preparedBy: "",
  preparedDesignation: "",
  approvedBy: "",
  approvalDate: "",

  lostItems: [],
  officers: [],
  boardMembers: [],
};
import type { FR104_4FormData } from "@/types/FR104_4_types";

export const initialFormData: FR104_4FormData = {
  // General Information
  referenceNo: "",
  department: "",
  secretaryOfMinistry: "",
  lossDate: "",
  lossTime: "",
  location: "",
  copyToAuditorGeneral: "no",

  investigation: "",

  // Preliminary Report
  preliminaryReportRefNo: "",
  preliminaryReportDate: "",

  // Loss Details
  lossDetails: "",
  circumstances: "",
  causeOfLoss: "",
  isDueToFraudNegligence: "no",

  // Police Information
  policeReportFile: null,

  // Legal Action
  courtName: "",
  courtCaseNo: "",
  courtOrderSummary: "",
  courtOrderFile: null,

  // Insurance
  insuranceRecoverableAmountWords: "",
  policyNo: "",
  amountInsured: "",
  amountRecoverable: "",

  // Recommendations
  recommendations: "",
  boardReportFile: null,

  // Preventive Actions
  preventiveActions: "",

  // Dynamic Collections
  lostItems: [],
  officers: [],
  boardMembers: [],
  recoveries: [],
};

import type { FR104_4FormData } from "@/types/FR104_4_types";

export const initialFormData: FR104_4FormData = {
  // General Information
  referenceNo: "",
  ministry: "",
  lossDate: "",
  lossTime: "",
  location: "",

  // Preliminary Report
  preliminaryReportRefNo: "",
  preliminaryReportDate: "",

  // Loss Details
  lossDetails: "",
  circumstances: "",
  causeOfLoss: "",

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

  // Approval Workflow
  preparedByUserId: "",
  preparedSignature: null,
  preparedDate: "",

  headUserId: "",
  headSignature: null,
  headApprovalDate: "",

  secretaryUserId: "",
  secretarySignature: null,
  secretaryApprovalDate: "",

  // Dynamic Collections
  lostItems: [],

  officers: [],

  boardMembers: [],

  recoveries: [],
};
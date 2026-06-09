import type { FR104_4FormData } from "@/types/FR104_4_types";

export const initialFormData: FR104_4FormData = {
  referenceNo: "",
  ministry: "",
  lossDate: "",
  lossTime: "",
  location: "",

  preliminaryReportRefNo: "",
  preliminaryReportDate: "",

  lossDetails: "",
  circumstances: "",
  causeOfLoss: "",

  policeReportFile: null,

  // Legal Action
  courtName: "",
  courtCaseNo: "",
  courtOrderSummary: "",
  courtOrderFile: null,

  investigation: "",

  recoveries: [
    {
      officerName: "",
      amountRecoverable: "",
      recoveryMethod: "",
    },
  ],

  policyNo: "",
  insuranceRecoverableAmountWords: "",
  amountInsured: "",
  amountRecoverable: "",

  recommendations: "",
  preventiveActions: "",
  boardReportFile: null,

  preparedBy: "",
  preparedDesignation: "",
  approvedBy: "",
  approvalDate: "",

  lostItems: [],
  officers: [],
  boardMembers: [],
};
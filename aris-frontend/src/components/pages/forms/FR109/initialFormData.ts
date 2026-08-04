import type { FR109FormData } from "@/types/FR109.type";

export const initialFormData: FR109FormData = {
  department: "",

  preliminaryReportReferenceNo: "",
  finalReportReferenceNo: "",
  preliminaryDate: "",
  finalDate: "",

  descriptionOfProperty: "",
  quantity: "",

  originalCost: "",
  estimatedCostAtTimeOfLoss: "",
  replacementValue: "",
  valueUnderFr105: "",
  amountRecovered: "",
  netLoss: "",

  nameOfCourt: "",
  caseNo: "",
  outcomeOfLegalAction: "",
  surchargedOfficers: [],

  reasonsForNonRecovery: "",
  actionTakenDetails: "",
  resultsOfAction: "",
  writeOffEntries: [
    {
      stockBookFolio: "",
      inventoryBookFolio: "",
      fixedAssetsRegisterFolio: "",
      ledgerFolio: "",
    },
  ],

  refNo: "",
};

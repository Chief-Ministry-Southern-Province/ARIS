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
  chiefAccountantDate: "",
  chiefAccountantSignature: "",

  headOfDeptSecretaryMinistry: "",
  headOfDeptDate: "",

  chiefAccountingSerialNo: "",
  chiefAccountingRefNo: "",
  chiefAccountingDate: "",
  chiefAccountingSecretaryMinistry: "",

  writeOffSecretaryMinistry: "",
  writeOffRefNo: "",
  writeOffDate: "",
  writeOffStatus: "",

  stockBookFolio: "",
  inventoryBookFolio: "",
  fixedAssetsRegisterFolio: "",
  ledgerFolio: "",

  refNo: "",
};
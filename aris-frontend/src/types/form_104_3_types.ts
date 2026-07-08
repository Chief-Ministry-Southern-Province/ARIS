export interface LostItem {
  description: string;
  quantity: string;
  unit: string;
  value: string;
}

export interface Officer {
  name: string;
  designation: string;
}

export interface FR104_3Data {
  department: string;
  date: string;
  place: string;
  loss: string;

  natureOfLoss: string;
  causeOfLoss: string;

  policeStation: string;
  policeReportDate: string;

  investigation: string;
  securityArrangements: string;
  preventionArrangements: string;

   // Approval Workflow
  preparedBy: string;
  preparedDesignation: string
  preparedByUserId: "",
  preparedSignature: null,
  preparedDate: "",

  headName: string;
  headDesignation: string;
  headUserId: "",
  headSignature: null,
  headApprovalDate: "",

  secretaryName: string;
  secretaryDesignation: string;
  secretaryUserId: "",
  secretarySignature: null,
  secretaryApprovalDate: "",

  items: LostItem[];
  officers: Officer[];
}
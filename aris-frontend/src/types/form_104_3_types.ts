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

export interface FR1043FormData {
  department: string;
  secretaryOfMinistry: string;
  date: string;
  place: string;

  natureOfLoss: string;
  causeOfLoss: string;

  policeStation: string;
  policeReportDate: string;

  investigation: string;
  securityArrangements: string;
  preventionArrangements: string;

  items: LostItem[];
  officers: Officer[];

  preparedBy: string;
  preparedDesignation: string;
  preparedSignature: string | null;
  preparedDate: string;
  headName: string;
  headDesignation: string;
  headSignature: string | null;
  headApprovalDate: string;
  secretaryName: string;
  secretaryDesignation: string;
  secretarySignature: string | null;
  secretaryApprovalDate: string;
}

// Kept as an alias for the existing FR104(3) field components.
export type FR104_3Data = FR1043FormData;

export interface FR1043Workflow {
  preparedBy: string;
  preparedDesignation: string;
  preparedDate: string | null;

  headName: string | null;
  headDesignation: string | null;
  headApprovalDate: string | null;

  secretaryName: string | null;
  secretaryDesignation: string | null;
  secretaryApprovalDate: string | null;
}

export type FR1043Status =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_APPROVAL"
  | "CHANGES_REQUESTED"
  | "APPROVED";

export interface FR1043Response {
  document_type: "FR1043";
  id: number;
  reference_number: string;
  revision: number;
  status: FR1043Status;
  submitted_at: string | null;
  approved_at: string | null;
  case: { id: number; case_number: string };
  data: FR1043FormData;
  workflow: FR1043Workflow;
  created_at: string;
  updated_at: string;
}

export type FR1043Payload = {
  status: "DRAFT" | "CHANGES_REQUESTED";
  data: FR1043FormData;
};

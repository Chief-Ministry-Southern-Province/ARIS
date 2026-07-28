export interface Approval {
  id: number;
  reference_number: string | null;
  document_type: string;
  revision: number;
  step: number;
  status: "PENDING" | "WAITING" | "RECOMMENDED" | "APPROVED" | "REJECTED" | "SKIPPED";
  comments: string | null;
  acted_at: string | null;
  case: { id: number; case_number: string };
  submitted_by: { id: number; name: string };
  institution: { id: number; name: string };
  approver: { id: number; name: string; role: string | null };
  signature: { public_id: string } | null;
}

export interface PaginatedApprovals {
  data: Approval[];
  meta?: { current_page: number; last_page: number };
}

export interface ApprovalStatsCounts {
  pending: number;
  recommended: number;
  approved: number;
  rejected: number;
  total: number;
}

export interface ApprovalHistoryGroup {
  document_type: "FR1043" | "FR1044" | "FR109";
  revision: number;
  approvals: Approval[];
}

export interface Approval {
  id: number;
  document_type: string;
  revision: number;
  step: number;
  status: "PENDING" | "WAITING" | "APPROVED" | "REJECTED" | "SKIPPED";
  comments: string | null;
  acted_at: string | null;
  case: { id: number; case_number: string };
  submitted_by: { id: number; name: string };
  institution: { id: number; name: string };
  approver: { id: number; name: string; role: string | null };
}

export interface PaginatedApprovals {
  data: Approval[];
  meta?: { current_page: number; last_page: number };
}

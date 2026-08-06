export type TimelineAction =
  | "CASE_CREATED"
  | "CASE_ASSIGNED"
  | "CASE_COMPLETED"
  | "CASE_CLOSED"
  | "ACCIDENT_REPORTED"
  | "EVIDENCE_UPLOADED"
  | "STAGE_CHANGED"
  | "STATUS_CHANGED"

  // FR104(3)
  | "FR1043_DRAFT_CREATED"
  | "FR1043_DRAFT_UPDATED"
  | "FR1043_REVISION_CREATED"
  | "FR1043_RESUBMITTED"
  | "FR1043_SUBMITTED"
  | "FR1043_APPROVED"
  | "FR1043_REJECTED"
  | "FR1043_WORKFLOW_COMPLETED"

  // FR104(4)
  | "FR1044_DRAFT_CREATED"
  | "FR1044_DRAFT_UPDATED"
  | "FR1044_REVISION_CREATED"
  | "FR1044_RESUBMITTED"
  | "FR1044_ATTACHMENT_UPLOADED"
  | "FR1044_SUBMITTED"
  | "FR1044_APPROVED"
  | "FR1044_REJECTED"
  | "FR1044_WORKFLOW_COMPLETED"

  // FR109
  | "FR109_SUBMITTED"
  | "FR109_APPROVED"
  | "FR109_REJECTED"
  | "FR109_WORKFLOW_COMPLETED"
  | "FR109_WRITE_OFF_NOTED"
  | "FR109_CHIEF_ACCOUNTING_ORDER_COMPLETED"
  | "FR109_WRITE_OFF_DECISION_RECORDED"

  | (string & {}); 

export type TimelineUserRole =
  | "driver"
  | "subject_officer"
  | "administrative_officer"
  | "medical_superintendent"
  | "regional_director"
  | "provincial_director"
  | "deputy_director"
  | "secretary"
  | "assistant_secretary"
  | "senior_assistant_secretary"
  | (string & {});

export interface TimelineUser {
  id: number;
  name: string;
  role: TimelineUserRole;
}

export interface TimelineEntry {
  id: number;
  action: TimelineAction;
  description: string;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  created_at: string;
  user: TimelineUser;
}

export interface TimelineResponse {
  data: TimelineEntry[];
}

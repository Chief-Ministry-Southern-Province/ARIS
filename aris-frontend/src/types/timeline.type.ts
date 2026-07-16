export type TimelineAction =
  | "CASE_CREATED"
  | "CASE_ASSIGNED"
  | "CASE_CLOSED"
  | "ACCIDENT_REPORTED"
  | "EVIDENCE_UPLOADED"
  | "STAGE_CHANGED"
  | "STATUS_CHANGED"

  // FR104(3)
  | "FR1043_DRAFT"
  | "FR1043_REVISION_CREATED"
  | "FR1043_RESUBMITTED"
  | "FR1043_SUBMITTED"
  | "FR1043_APPROVED"
  | "FR1043_REJECTED"

  // FR104(4)
  | "FR1044_SUBMITTED"
  | "FR1044_APPROVED"
  | "FR1044_REJECTED"

  // FR109
  | "FR109_SUBMITTED"
  | "FR109_APPROVED"
  | "FR109_REJECTED"

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

import type { Accident } from "./accident.type";
import type { Institution } from "./Institution.type";
import type { User } from "./User.type";

export type CaseStage =
  | "ACCIDENT_REPORTED"
  | "FR1043"
  | "FR1044"
  | "FR109"
  | "CLOSED";

export type CaseStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "COMPLETED";

export type CasePriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";

export interface AccidentCase {
    id: number;
    case_number: string;
    status: CaseStatus;
    current_stage: CaseStage;
    priority: CasePriority;
    created_at: string;

    accident: Accident;
    creator: User;
    assignee: User | null;
    institution: Institution;
}

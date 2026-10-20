export interface OfficerDelegation {
  id: number;
  institution: { id: number; name: string };
  officer: { id: number; name: string; nic: string; role?: string };
  acting_officer: { id: number; name: string; nic: string; role?: string };
  role: string;
  start_date: string;
  end_date: string | null;
  reason: "SICK_LEAVE" | "DUTY_LEAVE" | "VACATION" | "RESIGNATION" | "OTHER";
  notes: string | null;
  is_active: boolean;
  is_currently_active: boolean;
  created_by: { id: number; name: string };
  created_at: string;
}

export interface CreateDelegationRequest {
  institution_id?: number;
  officer_id: number;
  acting_officer_id: number;
  role: string;
  start_date: string;
  end_date?: string | null;
  reason: string;
  notes?: string | null;
}

export interface HandoverWorkloadRequest {
  successor_id: number;
  reason: string;
  deactivate_departing_user?: boolean;
}

export interface HandoverWorkloadResponse {
  message: string;
  reassigned_cases: number;
  reassigned_approvals: number;
  departing_user_deactivated?: boolean;
}

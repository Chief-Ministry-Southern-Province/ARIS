import type{ InstitutionResponse } from './Institution.type';

export interface RoleResponse {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  nic: string;
  mobile: string;
  signature_path: string | null;
  institution_id: number;
  created_at: string;
  updated_at: string;
  institution: InstitutionResponse;
  roles: RoleResponse[];
}

export interface ProfileResponse {
  user: User;
  role: string[];
}

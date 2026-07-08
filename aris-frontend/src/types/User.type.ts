import type { Institution } from "./Institution.type";

export interface RolePivot {
  model_type: string;
  model_id: number;
  role_id: number;
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: RolePivot;
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
  institution: Institution;
  roles: Role[];
}

export interface createUserRequest{
  name: string;
  nic: string;
  mobile: string;
  institution_id: number;
  password: string;
  role: string;
}

export interface viewUserResponse{
  name: string;
  nic: string;
  mobile: string;
  institution_id: number;
  role: string;
}

export interface updateUserRequest{
  name: string;
  nic: string;
  mobile: string;
  institution_id: number;
  role: string;
}

export interface ProfileResponse {
  user: User;
  role: string[];
}

export interface PaginatedInstitutionsResponse {
  data: User[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
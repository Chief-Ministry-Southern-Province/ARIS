export type InstitutionType =
  | "MINISTRY"
  | "PDHS"
  | "RDHS"
  | "BASE_HOSPITAL"
  | "DIVISIONAL_HOSPITAL"
  | "MOH"
  | "PMCU"
  | "UNITS"
  | "OTHER";

export interface Institution {
  id: number;
  name: string;
  type: InstitutionType;

  address: string | null;
  contact_number: string | null;
  district: string | null;
  province: string | null;
  head_of_institution: string | null;

  parent_institution_id: number | null;
  direct_to_rdhs: boolean;

  created_at: string;
  updated_at: string;

  parent_institution?: Institution | null;
  child_institutions?: Institution[];
}

export interface createInstitutionRequest {
  name: string;
  type: InstitutionType;
  address?: string | null;
  contact_number?: string | null;
  district?: string | null;
  province?: string | null;
  head_of_institution?: string | null;
  parent_institution_id?: number | null;
  direct_to_rdhs?: boolean;
}

export interface updateInstitutionRequest {
  name: string;
  type: InstitutionType;
  address?: string | null;
  contact_number?: string | null;
  district?: string | null;
  province?: string | null;
  head_of_institution?: string | null;
  parent_institution_id?: number | null;
  direct_to_rdhs?: boolean;
}

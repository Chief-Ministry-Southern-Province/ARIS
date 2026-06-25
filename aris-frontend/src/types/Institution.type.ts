export interface InstitutionResponse {
  id: number;
  name: string;
  type: string;
  address: string | null;
  contact_number: string | null;
  district: string | null;
  province: string;
  head_of_institution: string | null;
  parent_institution_id: number | null;
  direct_to_rdhs: number;
  created_at: string;
  updated_at: string;
}
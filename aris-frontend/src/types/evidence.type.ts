export type EvidenceType =
  | "PHOTO"
  | "VIDEO"
  | "DOCUMENT"
  | "POLICE_REPORT"
  | "COURT_ORDER"
  | "OTHER";

export interface UploadedBy {
  id: number;
  name: string;
}

export interface EvidenceResponse {
  id: number;
  accident_reference_number: string;
  original_name: string;
  file_name: string;
  file_url: string;
  mime_type: string;
  file_size: number;
  file_size_kb: number;
  evidence_type: EvidenceType;
  document_type: string | null;
  document_revision: number | null;
  field_key: string | null;
  description: string | null;
  uploaded_by: UploadedBy;
  uploaded_at: string;
}

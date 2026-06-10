export type EvidenceType = "photo" | "police";

export type Evidence = {
  id: string;
  caseId: string;
  type: EvidenceType;
  name: string;
  size: string;
  uploadedBy: string;
  date: string;
  description: string;
}
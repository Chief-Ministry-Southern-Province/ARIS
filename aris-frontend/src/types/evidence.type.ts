export type EvidenceType = "photo" | "police" | "recommendation" | "courtOrder";

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

import type { EvidenceType } from "@/types/evidence.type";

export const mockEvidence = [
  { id: "E001", caseId: "ARIS-2024-001", type: "photo" as EvidenceType, name: "accident_scene_001.jpg", size: "2.4 MB", uploadedBy: "Ruwan Bandara", date: "2024-03-15", description: "Front view of accident scene" },
  { id: "E002", caseId: "ARIS-2024-001", type: "photo" as EvidenceType, name: "vehicle_damage_left.jpg", size: "1.8 MB", uploadedBy: "Ruwan Bandara", date: "2024-03-15", description: "Left side vehicle damage" },
  { id: "E006", caseId: "ARIS-2024-001", type: "police" as EvidenceType, name: "police_report_B12345.pdf", size: "1.2 MB", uploadedBy: "Saman Fernando", date: "2024-03-16", description: "Official police accident report" },
  { id: "E007", caseId: "ARIS-2024-002", type: "photo" as EvidenceType, name: "highway_accident_scene.jpg", size: "3.1 MB", uploadedBy: "Ruwan Bandara", date: "2024-03-12", description: "Accident scene on expressway" },
  { id: "E008", caseId: "ARIS-2024-002", type: "police" as EvidenceType, name: "police_report_C67890.pdf", size: "1.5 MB", uploadedBy: "Saman Fernando", date: "2024-03-13", description: "Official police accident report" },
];
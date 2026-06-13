import { Users, Building, Car, FileText } from "lucide-react";

export const adminTabs = [
  { id: "users", icon: Users, label: "Users",  i18n: "adminPanel.tabs.users" },
  { id: "institutions", icon: Building, label: "Institutions", i18n: "adminPanel.tabs.institutions" },
  { id: "vehicles", icon: Car, label: "Vehicles", i18n: "adminPanel.tabs.vehicles" },
  { id: "audit", icon: FileText, label: "Audit Logs", i18n: "adminPanel.tabs.audit" },
];


export const auditLogs = [
  { id: 1, user: "admin", action: "User Created", resource: "kamal.p (Driver)", ip: "192.168.1.45", time: "2024-03-15 10:00", status: "success" },
  { id: 2, user: "saman.f", action: "Case Updated", resource: "ARIS-2024-001", ip: "10.0.1.23", time: "2024-03-15 14:30", status: "success" },
  { id: 3, user: "ruwan.b", action: "Evidence Upload", resource: "ARIS-2024-001/evidence", ip: "10.0.1.67", time: "2024-03-15 16:00", status: "success" },
  { id: 4, user: "unknown", action: "Login Failed", resource: "Authentication", ip: "203.45.12.89", time: "2024-03-15 18:22", status: "failed" },
  { id: 5, user: "chaminda.r", action: "Case Approved", resource: "ARIS-2024-004", ip: "10.0.2.11", time: "2024-03-16 09:00", status: "success" },
  { id: 6, user: "priya.j", action: "PDF Generated", resource: "FR104-3/ARIS-2024-001", ip: "10.0.1.88", time: "2024-03-16 11:30", status: "success" },
  { id: 7, user: "admin", action: "Vehicle Added", resource: "WP-CAH-0001", ip: "192.168.1.45", time: "2024-03-16 14:00", status: "success" },
];

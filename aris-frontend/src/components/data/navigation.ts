import {LayoutDashboard,AlertTriangle,FolderOpen,BarChart2,Settings,FileSearch,Bell,FolderClock,FileSignature} from "lucide-react";

export const FULL_ACCESS_ROLES = [
  "subject_officer",
  "administrative_officer",
  "medical_superintendent",
  "regional_director",
  "provincial_director",
  "deputy_director",
  "secretary",
  "assistant_secretary",
  "senior_assistant_secretary",
  "treasury_secretary",
];

export const SIGNATURE_ACCESS_ROLE = [
  "medical_superintendent",
  "regional_director",
  "provincial_director",
  "secretary",
  "treasury_secretary",
]

export const REPORT_ROLES = [
  "subject_officer",
  "driver",
];

export const ADMIN_PANEL_SUBJECT_OFFICER_INSTITUTIONS = [
  "RDHS",
  "PDHS",
  "BASE_HOSPITAL",
];

export const canAccessAdminPanel = (
  roles: string[],
  institutionType: string | null,
) =>
  roles.includes("system_admin") ||
  (roles.includes("subject_officer") &&
    institutionType !== null &&
    ADMIN_PANEL_SUBJECT_OFFICER_INSTITUTIONS.includes(institutionType));

export const NOTIFICATION_ROLES = [
  ...FULL_ACCESS_ROLES,
  "driver",
];

export const navItems = [
  {
    id: "dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    label: "nav.dashboard",
    roles: FULL_ACCESS_ROLES,
  },

  {
    id: "report",
    path: "/report",
    icon: AlertTriangle,
    label: "nav.reportAccident",
    roles: REPORT_ROLES,
  },

  {
    id: "cases",
    path: "/cases",
    icon: FolderOpen,
    label: "nav.caseManagement",
    roles: FULL_ACCESS_ROLES,
  },

  {
    id: "evidence",
    path: "/evidence",
    icon: FileSearch,
    label: "nav.evidence",
    roles: FULL_ACCESS_ROLES,
  },

  {
    id: "analytics",
    path: "/analytics",
    icon: BarChart2,
    label: "nav.analytics",
    roles: FULL_ACCESS_ROLES,
  },

  {
    id: "notifications",
    path: "/notifications",
    icon: Bell,
    label: "nav.notifications",
    roles: NOTIFICATION_ROLES,
  },
  {
    id:"signature",
    path:"/signatures",
    icon: FileSignature,
    label: "nav.digitalSignatures",
    roles: SIGNATURE_ACCESS_ROLE,
  },
  {
    id: "approvals",
    path: "/approvals",
    icon: FolderClock,
    label: "nav.approvals",
    roles: FULL_ACCESS_ROLES,
  },

  {
    id: "admin",
    path: "/admin",
    icon: Settings,
    label: "nav.adminPanel",
    roles: ["subject_officer", "system_admin"],
  }
];

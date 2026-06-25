import {LayoutDashboard,AlertTriangle,FolderOpen,BarChart2,Settings,FileSearch,Bell,} from "lucide-react";

export const navItems = [
  {
    id: "dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    label: "nav.dashboard",
    roles: [
      "system_admin",
      "subject_officer",
      "administrative_officer",
      "medical_superintendent",
      "regional_director",
      "provincial_director",
      "deputy_director",
      "secretary",
      "assistant_secretary",
      "senior_assistant_secretary",
    ],
  },

  {
    id: "report",
    path: "/report",
    icon: AlertTriangle,
    label: "nav.reportAccident",
    roles: [
      "driver",
      "subject_officer",
    ],
  },

  {
    id: "cases",
    path: "/cases",
    icon: FolderOpen,
    label: "nav.caseManagement",
    roles: [
      "system_admin",
      "subject_officer",
      "administrative_officer",
      "medical_superintendent",
      "regional_director",
      "provincial_director",
      "deputy_director",
      "secretary",
      "assistant_secretary",
      "senior_assistant_secretary",
    ],
  },

  {
    id: "evidence",
    path: "/evidence",
    icon: FileSearch,
    label: "nav.evidence",
    roles: [
      "system_admin",
      "subject_officer",
      "administrative_officer",
    ],
  },

  {
    id: "analytics",
    path: "/analytics",
    icon: BarChart2,
    label: "nav.analytics",
    roles: [
      "system_admin",
      "provincial_director",
      "regional_director",
      "secretary",
    ],
  },

  {
    id: "notifications",
    path: "/notifications",
    icon: Bell,
    label: "nav.notifications",
    roles: [
      "system_admin",
      "driver",
      "subject_officer",
      "administrative_officer",
      "medical_superintendent",
      "regional_director",
      "provincial_director",
      "deputy_director",
      "secretary",
      "assistant_secretary",
      "senior_assistant_secretary",
    ],
  },

  {
    id: "admin",
    path: "/admin",
    icon: Settings,
    label: "nav.adminPanel",
    roles: [
      "system_admin",
      
    ],
  },
];
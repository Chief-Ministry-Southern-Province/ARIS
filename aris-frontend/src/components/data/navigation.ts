import {
  LayoutDashboard,
  AlertTriangle,
  FolderOpen,
  BarChart2,
  Settings,
  FileSearch,
  Bell
} from "lucide-react";

export const navItems = [
  {
    id: "dashboard",
    path: "/",
    icon: LayoutDashboard,
    label: "nav.dashboard",
  },
  {
    id: "report",
    path: "/report",
    icon: AlertTriangle,
    label: "nav.reportAccident",
  },
  {
    id: "cases",
    path: "/cases",
    icon: FolderOpen,
    label: "nav.caseManagement",
  },
   {
    id: "evidence",
    path: "/evidence",
    icon: FileSearch,
    label: "nav.evidence",
  },
  // {
  //   id: "investigation",
  //   path: "/investigation",
  //   icon: Briefcase,
  //   label: "nav.investigation",
  // },
  // {
  //   id: "forms",
  //   path: "/forms",
  //   icon: FileText,
  //   label: "nav.governmentForms",
  //   children: [
  //     {
  //       id: "fr104_3",
  //       label: "nav.fr104_3",
  //       path: "/forms/fr104_3",
  //     },
  //     {
  //       id: "fr104_4",
  //       label: "nav.fr104_4",
  //       path: "/forms/fr104_4",
  //     },
  //     {
  //       id: "fr109",
  //       label: "nav.fr109",
  //       path: "/forms/fr109",
  //     },
  //   ],
  // },
  // {
  //   id: "signatures",
  //   path: "/signatures",
  //   icon: PenTool,
  //   label: "nav.digitalSignatures",
  // },
  {
    id: "analytics",
    path: "/analytics",
    icon: BarChart2,
    label: "nav.analytics",
  },
  { id: "notifications",
    path: "/notifications",
    icon: Bell,
    label: "nav.notifications",
  },
  {
    id: "admin",
    path: "/admin",
    icon: Settings,
    label: "nav.adminPanel",
  },
];
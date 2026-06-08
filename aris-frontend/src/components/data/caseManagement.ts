import { User, CheckCircle, FileText, Eye,  } from "lucide-react";

export const getAction = (caseItem_id: number,t: any) => {
  return [
  {
    label: t("caseManagement.actionButtons.viewEvidence"),
    icon: Eye,
    color: "border-blue-200 text-blue-700 hover:bg-blue-50",
    path: `/cases/${caseItem_id}/evidence`,
  },
  {
    label: t("caseManagement.actionButtons.generateFR104_3"),
    icon: FileText,
    color: "border-green-200 text-green-700 hover:bg-green-50",
    path: `/cases/${caseItem_id}/fr104-3/generate`,
  },
  {
    label: t("caseManagement.actionButtons.generateFR104_4"),
    icon: FileText,
    color: "border-green-200 text-green-700 hover:bg-green-50",
    path: `/cases/${caseItem_id}/fr104-4/generate`,
  },
  {
    label: t("caseManagement.actionButtons.generateFR109"),
    icon: FileText,
    color: "border-green-200 text-green-700 hover:bg-green-50",
    path: `/cases/${caseItem_id}/fr109/generate`,
  },
  {
    label: t("caseManagement.actionButtons.viewFR104_3"),
    icon: FileText,
    color: "border-green-200 text-green-700 hover:bg-green-50",
    path: `/cases/${caseItem_id}/fr104-3/view`,
  },
  {
    label: t("caseManagement.actionButtons.viewFR104_4"),
    icon: FileText,
    color: "border-green-200 text-green-700 hover:bg-green-50",
    path: `/cases/${caseItem_id}/fr104-4/view`,
  },
  {
    label: t("caseManagement.actionButtons.viewFR109"),
    icon: FileText,
    color: "border-green-200 text-green-700 hover:bg-green-50",
    path: `/cases/${caseItem_id}/fr109/view`,
  },
  {
    label: t("caseManagement.actionButtons.assignInvestigator"),
    icon: User,
    color: "border-purple-200 text-purple-700 hover:bg-purple-50",
    path: `/cases/${caseItem_id}/assign-investigator`,
  },
  {
    label: t("caseManagement.actionButtons.forwardApproval"),
    icon: CheckCircle,
    color: "border-orange-200 text-orange-700 hover:bg-orange-50",
    path: `/cases/${caseItem_id}/forward-approval`,
  },
];
}

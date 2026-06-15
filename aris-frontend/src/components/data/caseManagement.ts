import { ClipboardCheck, FileSearch, CheckCircle, FileText,UserPlus } from "lucide-react";
import type { TFunction } from "i18next";

export const getAction = (caseItem_id: number, t: TFunction) => {
  return [

    {
      label: t("caseManagement.actionButtons.generateFR104_3"),
      icon: FileText,
      color:
        "border-green-200 text-green-700 bg-green-50/50 hover:bg-green-50",
      path: `/cases/${caseItem_id}/fr104-3/generate`,
    },

    {
      label: t("caseManagement.actionButtons.generateFR104_4"),
      icon: FileText,
      color:
        "border-green-200 text-green-700 bg-green-50/50 hover:bg-green-50",
      path: `/cases/${caseItem_id}/fr104-4/generate`,
    },

    {
      label: t("caseManagement.actionButtons.generateFR109"),
      icon: ClipboardCheck,
      color:
        "border-green-200 text-green-700 bg-green-50/50 hover:bg-green-50",
      path: `/cases/${caseItem_id}/fr109/generate`,
    },

    {
      label: t("caseManagement.actionButtons.viewFR104_3"),
      icon: FileSearch,
      color:
        "border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100",
      path: `/cases/${caseItem_id}/fr104-3/view`,
    },

    {
      label: t("caseManagement.actionButtons.viewFR104_4"),
      icon: FileSearch,
      color:
        "border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100",
      path: `/cases/${caseItem_id}/fr104-4/view`,
    },

    {
      label: t("caseManagement.actionButtons.viewFR109"),
      icon: FileSearch,
      color:
        "border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100",
      path: `/cases/${caseItem_id}/fr109/view`,
    },

    {
      label: t("caseManagement.actionButtons.assignInvestigator"),
      icon: UserPlus,
      color:
        "border-purple-200 text-purple-700 bg-purple-50/50 hover:bg-purple-50",
      path: `/cases/${caseItem_id}/assign-investigator`,
    },

    {
      label: t("caseManagement.actionButtons.forwardApproval"),
      icon: CheckCircle,
      color:
        "border-orange-200 text-orange-700 bg-orange-50/50 hover:bg-orange-50",
      path: `/cases/${caseItem_id}/forward-approval`,
    },
  ];
};

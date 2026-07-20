import { ClipboardCheck, FileText } from "lucide-react";
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
  ];
};

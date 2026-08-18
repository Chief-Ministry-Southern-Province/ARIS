import { ClipboardCheck, FileText } from "lucide-react";
import type { TFunction } from "i18next";
import type { FormActionMode } from "@/types/AccidentCase.type";

export const getAction = (
  caseItem_id: number,
  t: TFunction,
  modes: Record<"fr1043" | "fr1044" | "fr109", FormActionMode> = {
    fr1043: "create",
    fr1044: "create",
    fr109: "create",
  },
) => {
  return [

    {
      label: modes.fr1043 === "create" ? t("caseManagement.actionButtons.generateFR104_3") : "View FR104(3)",
      icon: FileText,
      color:
        "border-green-200 text-green-700 bg-green-50/50 hover:bg-green-50",
      path: `/cases/${caseItem_id}/fr104-3/${modes.fr1043 === "create" ? "generate" : "view"}`,
      mode: modes.fr1043,
    },

    {
      label: modes.fr1044 === "create" ? t("caseManagement.actionButtons.generateFR104_4") : "View FR104(4)",
      icon: FileText,
      color:
        "border-green-200 text-green-700 bg-green-50/50 hover:bg-green-50",
      path: `/cases/${caseItem_id}/fr104-4/${modes.fr1044 === "create" ? "generate" : "view"}`,
      mode: modes.fr1044,
    },

    {
      label: modes.fr109 === "create" ? t("caseManagement.actionButtons.generateFR109") : "View FR109",
      icon: ClipboardCheck,
      color:
        "border-green-200 text-green-700 bg-green-50/50 hover:bg-green-50",
      path: `/cases/${caseItem_id}/fr109/${modes.fr109 === "create" ? "generate" : "view"}`,
      mode: modes.fr109,
    },
  ].filter((action) => action.mode !== "none");
};

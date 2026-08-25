import { ClipboardCheck, Eye, FileText, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import ApprovalStatusBadge from "./ApprovalStatusBadge";
import type { Approval } from "@/types/approval.type";

interface Props {
  approvals: Approval[];
  loading?: boolean;
  onView: (approval: Approval) => void;
}

export default function DecidedApprovalsTable({
  approvals,
  loading = false,
  onView,
}: Props) {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language.startsWith("si") ? "si-LK" : "en-LK";

  if (loading)
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-72 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#0F4C81]" />
          <p className="text-slate-500">{t("approvalCenter.loadingDecidedDocuments")}</p>
        </div>
      </div>
    );
  if (!approvals.length)
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-80 flex items-center justify-center">
        <div className="text-center">
          <ClipboardCheck className="mx-auto w-16 h-16 text-slate-300" />
          <h3 className="mt-5 text-xl font-semibold text-slate-700">
            {t("approvalCenter.noDecidedDocuments")}
          </h3>
          <p className="mt-2 text-slate-500">
            {t("approvalCenter.noDecidedDocumentsDescription")}
          </p>
        </div>
      </div>
    );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-lg font-semibold text-slate-900">
          {t("approvalCenter.recommendationsDecisions")}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {t("approvalCenter.openExactRevision")}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm text-slate-600">
              <th className="px-6 py-4 font-semibold">{t("approvalCenter.referenceNumber")}</th>
              <th className="px-6 py-4 font-semibold">{t("approvalCenter.caseNumber")}</th>
              <th className="px-6 py-4 font-semibold">{t("approvalCenter.document")}</th>
              <th className="px-6 py-4 font-semibold">{t("approvalCenter.revisionLabel")}</th>
              <th className="px-6 py-4 font-semibold">{t("approvalCenter.decision")}</th>
              <th className="px-6 py-4 font-semibold">{t("approvalCenter.comments")}</th>
              <th className="px-6 py-4 font-semibold">{t("approvalCenter.decisionDate")}</th>
              <th className="px-6 py-4 font-semibold">{t("approvalCenter.action")}</th>
            </tr>
          </thead>
          <tbody>
            {approvals.map((approval) => (
              <tr
                key={approval.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0F4C81]/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#0F4C81]" />
                    </div>
                    <span className="font-medium text-slate-900">
                      {approval.reference_number || "—"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 font-medium text-slate-700">
                  {approval.case.case_number}
                </td>
                <td className="px-6 py-5">
                  <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    {approval.document_type}
                  </span>
                </td>
                <td className="px-6 py-5 font-semibold text-slate-700">
                  {t("approvalCenter.revision", { number: approval.revision })}
                </td>
                <td className="px-6 py-5">
                  <ApprovalStatusBadge status={approval.status} />
                </td>
                <td className="px-6 py-5 max-w-xs text-sm text-slate-600">
                  {approval.comments || "—"}
                </td>
                <td className="px-6 py-5 text-sm text-slate-600">
                  {approval.acted_at
                    ? new Date(approval.acted_at).toLocaleString(dateLocale)
                    : "—"}
                </td>
                <td className="px-6 py-5">
                  <button
                    onClick={() => onView(approval)}
                    disabled={approval.document_type === "FR109"}
                    title={
                      approval.document_type === "FR109"
                        ? t("approvalCenter.fr109ViewerUnavailable")
                        : t("approvalCenter.openDocument")
                    }
                    className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

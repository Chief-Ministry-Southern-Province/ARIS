import { Clock, AlertCircle, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTimeline } from "@/hooks/useTimeline";
import { useApprovalHistory } from "@/hooks/useApprovals";
import type { TimelineEntry } from "@/types/timeline.type";
import { TIMELINE_ACTIONS, DEFAULT_ACTION } from "@/utils/timelineAction";

interface ApprovalWorkflowProps {
  caseId: number | string;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString("en-LK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ApprovalWorkflow({ caseId }: ApprovalWorkflowProps) {
  const { t } = useTranslation();
  const { timeline, loading, error } = useTimeline(caseId);
  const numericCaseId = Number(caseId);
  const { data: approvals = [], isLoading: approvalsLoading } = useApprovalHistory(numericCaseId);
  const approvalsByRevision = approvals.reduce<Record<number, typeof approvals>>((groups, approval) => {
    (groups[approval.revision] ??= []).push(approval);
    return groups;
  }, {});

  const latestAction =
    timeline.length > 0
      ? TIMELINE_ACTIONS[timeline[0].action as keyof typeof TIMELINE_ACTIONS] ??
        DEFAULT_ACTION
      : DEFAULT_ACTION;

  const HeaderIcon = latestAction.icon;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {t("approvalWorkflow.approvalHistory")}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Review the progress of approvals and actions taken.
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${latestAction.badge}`}
        >
          <HeaderIcon className="w-4 h-4" />
          {latestAction.label}
        </span>
      </div>

      {/* Timeline */}
      <div className="p-6">
        <h3 className="mb-3 text-base font-semibold text-slate-900">Approval history</h3>
        {approvalsLoading ? <p className="mb-6 text-sm text-slate-500">Loading approval history…</p> : Object.entries(approvalsByRevision).map(([revision, entries]) => (
          <div key={revision} className="mb-5 overflow-x-auto rounded-xl border border-slate-200">
            <div className="bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">Revision {revision}</div>
            <table className="min-w-full text-sm"><thead className="text-left text-slate-500"><tr><th className="p-3">Approver</th><th className="p-3">Institution</th><th className="p-3">Role</th><th className="p-3">Status</th><th className="p-3">Comments</th><th className="p-3">Acted date</th></tr></thead><tbody>
              {entries.map((approval) => <tr key={approval.id} className="border-t border-slate-100"><td className="p-3">{approval.approver.name}</td><td className="p-3">{approval.institution.name}</td><td className="p-3">{approval.approver.role?.replace(/_/g, " ")}</td><td className="p-3">{approval.status}</td><td className="p-3">{approval.comments ?? "—"}</td><td className="p-3">{approval.acted_at ? formatDate(approval.acted_at) : "—"}</td></tr>)}
            </tbody></table>
          </div>
        ))}
        {!approvalsLoading && approvals.length === 0 && <p className="mb-6 text-sm text-slate-500">No approvals have been created yet.</p>}
        <h3 className="mb-3 text-base font-semibold text-slate-900">Case timeline</h3>
        {loading && (
          <div className="flex items-center justify-center py-10 text-slate-400 text-sm">
            Loading timeline…
          </div>
        )}

        {!loading && error && (
          <div className="flex items-center gap-2 py-10 justify-center text-red-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {!loading && !error && timeline.length === 0 && (
          <div className="flex items-center gap-2 py-10 justify-center text-slate-400 text-sm">
            <FileText className="w-4 h-4" />
            No activity recorded for this case yet.
          </div>
        )}

        {!loading && !error && timeline.length > 0 && (
          <div className="space-y-6">
            {timeline.map((item: TimelineEntry, index: number) => {
              const action =
                TIMELINE_ACTIONS[item.action as keyof typeof TIMELINE_ACTIONS] ??
                DEFAULT_ACTION;

              const Icon = action.icon;

              return (
                <div key={item.id} className="relative flex gap-4 group">
                  {/* Timeline Column */}
                  <div className="relative flex flex-col items-center">
                    <div
                      className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all duration-200 group-hover:scale-105 ${action.badge}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {index < timeline.length - 1 && (
                      <div className="w-0.5 flex-1 min-h-16 mt-2 bg-slate-200" />
                    )}
                  </div>

                  {/* Content Card */}
                  <div
                    className="
                      flex-1
                      border border-slate-200
                      rounded-xl
                      p-4
                      transition-all
                      duration-200
                      hover:shadow-md
                      hover:border-slate-300
                    "
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {item.user.name}
                        </h4>
                        <p className="text-sm text-slate-500 mt-1 capitalize">
                          {item.user.role.replace(/_/g, " ")}
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full border text-xs font-medium whitespace-nowrap ${action.badge}`}
                      >
                        {action.label}
                      </span>
                    </div>

                    <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="text-sm text-slate-600">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      {formatDate(item.created_at)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ApprovalWorkflow;

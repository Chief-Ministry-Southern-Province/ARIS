import { AlertCircle, ChevronDown, Clock, FileText, GitBranch, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import ApprovalStatusBadge from "@/components/approval/ApprovalStatusBadge";
import { useApprovalHistory } from "@/hooks/useApprovals";
import { useTimeline } from "@/hooks/useTimeline";
import type { TimelineEntry } from "@/types/timeline.type";
import { DEFAULT_ACTION, TIMELINE_ACTIONS } from "@/utils/timelineAction";

interface ApprovalWorkflowProps {
  caseId: number | string;
  view?: "approvals" | "timeline";
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "Not acted yet";

  return new Date(dateString).toLocaleString("en-LK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function ApprovalWorkflow({ caseId, view = "approvals" }: ApprovalWorkflowProps) {
  const { t } = useTranslation();
  const numericCaseId = Number(caseId);
  const { timeline, loading, error } = useTimeline(view === "timeline" ? caseId : 0);
  const { data: approvalGroups = [], isLoading: approvalsLoading } = useApprovalHistory(view === "approvals" ? numericCaseId : 0);

  const latestAction = timeline.length > 0
    ? TIMELINE_ACTIONS[timeline[0].action as keyof typeof TIMELINE_ACTIONS] ?? DEFAULT_ACTION
    : DEFAULT_ACTION;
  const HeaderIcon = latestAction.icon;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{view === "approvals" ? t("approvalWorkflow.approvalHistory") : "Case Timeline"}</h2>
          <p className="mt-1 text-sm text-slate-500">{view === "approvals" ? "Review approvals across every document revision." : "Review all activity recorded for this case."}</p>
        </div>
        {view === "timeline" && <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${latestAction.badge}`}><HeaderIcon className="h-4 w-4" />{latestAction.label}</span>}
      </div>

      <div className="p-6">
        {view === "approvals" && <>
        <h3 className="mb-3 text-base font-semibold text-slate-900">Approval history</h3>
        {approvalsLoading && <p className="mb-6 text-sm text-slate-500">Loading approval history...</p>}
        {!approvalsLoading && approvalGroups.length === 0 && <p className="mb-6 text-sm text-slate-500">No approvals have been created yet.</p>}

        <div className="space-y-3">
          {approvalGroups.map((group) => (
            <details key={`${group.document_type}-${group.revision}`} className="group rounded-xl border border-slate-200" open>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                <span className="flex items-center gap-3">
                  <GitBranch className="h-4 w-4 text-blue-700" />
                  <span>{group.document_type}</span>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-600">Revision {group.revision}</span>
                  <span className="text-xs font-normal text-slate-500">{group.approvals.length} step{group.approvals.length === 1 ? "" : "s"}</span>
                </span>
                <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>

              <div className="space-y-4 px-4 py-4">
                {group.approvals.map((approval, index) => (
                  <div key={approval.id} className="relative flex gap-4">
                    <div className="relative flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600">
                        <span className="text-sm font-semibold">{approval.step}</span>
                      </div>
                      {index < group.approvals.length - 1 && <div className="mt-2 min-h-12 w-0.5 flex-1 bg-slate-200" />}
                    </div>

                    <div className="flex-1 rounded-xl border border-slate-200 p-4 transition-all hover:border-slate-300 hover:shadow-md">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h4 className="font-semibold text-slate-900">{approval.approver.name}</h4>
                          <p className="mt-1 flex items-center gap-1 text-sm capitalize text-slate-500">
                            <UserRound className="h-3.5 w-3.5" />
                            {(approval.approver.role ?? "Approver").replace(/_/g, " ")} · {approval.institution.name}
                          </p>
                        </div>
                        <ApprovalStatusBadge status={approval.status} />
                      </div>

                      {approval.comments && (
                        <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600">
                          {approval.comments}
                        </div>
                      )}

                      <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                        <Clock className="h-3 w-3" />
                        {formatDate(approval.acted_at)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
        </>}

        {view === "timeline" && <>
        <h3 className="mb-3 text-base font-semibold text-slate-900">Case timeline</h3>
        {loading && <div className="flex justify-center py-10 text-sm text-slate-400">Loading timeline...</div>}
        {!loading && error && <div className="flex items-center justify-center gap-2 py-10 text-sm text-red-500"><AlertCircle className="h-4 w-4" />{error}</div>}
        {!loading && !error && timeline.length === 0 && <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-400"><FileText className="h-4 w-4" />No activity recorded for this case yet.</div>}
        {!loading && !error && timeline.length > 0 && (
          <div className="space-y-6">
            {timeline.map((item: TimelineEntry, index: number) => {
              const action = TIMELINE_ACTIONS[item.action as keyof typeof TIMELINE_ACTIONS] ?? DEFAULT_ACTION;
              const Icon = action.icon;

              return (
                <div key={item.id} className="group relative flex gap-4">
                  <div className="relative flex flex-col items-center">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all group-hover:scale-105 ${action.badge}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {index < timeline.length - 1 && <div className="mt-2 min-h-16 w-0.5 flex-1 bg-slate-200" />}
                  </div>
                  <div className="flex-1 rounded-xl border border-slate-200 p-4 transition-all hover:border-slate-300 hover:shadow-md">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-slate-900">{item.user.name}</h4>
                        <p className="mt-1 text-sm capitalize text-slate-500">{item.user.role.replace(/_/g, " ")}</p>
                      </div>
                      <span className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium ${action.badge}`}>{action.label}</span>
                    </div>
                    <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm text-slate-600">{item.description}</div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-400"><Clock className="h-3 w-3" />{formatDate(item.created_at)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </>}
      </div>
    </div>
  );
}

export default ApprovalWorkflow;

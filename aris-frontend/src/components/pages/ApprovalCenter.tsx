import { useState } from "react";
import {ClipboardCheck,RefreshCw,} from "lucide-react";
import { useNavigate } from "react-router-dom";

import ApprovalStats from "@/components/approval/ApprovalStats";
import ApprovalSearch from "@/components/approval/ApprovalSearch";
import ApprovalTable from "@/components/approval/ApprovalTable";
import DecidedApprovalsTable from "@/components/approval/DecidedApprovalsTable";
import ApprovalDecisionDialog from "@/components/approval/ApprovalDecisionDialog";

import { useApprove, useApprovalStats, useDecidedApprovals, usePendingApprovals, useReject } from "@/hooks/useApprovals";
import type{ Approval } from "@/types/approval.type";
import { toast } from "react-toastify";

type Decision = { action: "approve" | "reject"; approval: Approval } | null;
type View = "pending" | "decided";

export default function ApprovalCenter() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [decision, setDecision] = useState<Decision>(null);
  const [view, setView] = useState<View>("pending");
  const [documentType, setDocumentType] = useState("");
  const [decisionStatus, setDecisionStatus] = useState("");

  const pendingQuery = usePendingApprovals(page, search);
  const decidedQuery = useDecidedApprovals(page, search, documentType, decisionStatus);
  const { data: stats } = useApprovalStats();
  const approveMutation = useApprove();
  const rejectMutation = useReject();

  const activeQuery = view === "pending" ? pendingQuery : decidedQuery;
  const approvals = activeQuery.data?.data ?? [];
  const meta = activeQuery.data?.meta;

  const handleView = (approval: Approval) => {
    navigate(`/approvals/${approval.id}`);
  };

  const handleApprove = (approval: Approval) => {
    setDecision({ action: "approve", approval });
  };

  const handleReject = (approval: Approval) => {
    setDecision({ action: "reject", approval });
  };

  const submitDecision = async (comments: string) => {
    if (!decision) return;

    try {
      if (decision.action === "approve") {
        await approveMutation.mutateAsync({ id: decision.approval.id, comments: comments || undefined });
        toast.success("Document approved successfully.");
      } else {
        await rejectMutation.mutateAsync({ id: decision.approval.id, comments });
        toast.success("Document rejected and returned for changes.");
      }

      setDecision(null);
      navigate("/approvals");
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message || "Unable to update the approval.");
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 p-6">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-[#0F4C81]/10 flex items-center justify-center">

              <ClipboardCheck className="w-7 h-7 text-[#0F4C81]" />

            </div>

            <div>

              <h1 className="text-2xl font-bold text-slate-900">
                Approval Center
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Review, approve and manage all pending document approvals.
              </p>

            </div>

          </div>

          <button
            onClick={() => activeQuery.refetch()}
            disabled={activeQuery.isRefetching}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F4C81] px-5 py-3 text-white transition hover:bg-[#1565C0] disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                activeQuery.isRefetching ? "animate-spin" : ""
              }`}
            />

            Refresh

          </button>

        </div>

      </div>

      <div className="flex gap-2 border-b border-slate-200">
        <button onClick={() => { setView("pending"); setPage(1); }} className={`px-4 py-3 text-sm font-medium ${view === "pending" ? "border-b-2 border-[#0F4C81] text-[#0F4C81]" : "text-slate-500"}`}>Pending Approvals</button>
        <button onClick={() => { setView("decided"); setPage(1); }} className={`px-4 py-3 text-sm font-medium ${view === "decided" ? "border-b-2 border-[#0F4C81] text-[#0F4C81]" : "text-slate-500"}`}>Approved / Rejected Documents</button>
      </div>

      {/* Statistics */}

      <ApprovalStats approvals={approvals} counts={stats} />

      {/* Search */}

      <ApprovalSearch
        search={search}
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />

      {view === "decided" && (
        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">Document type<select value={documentType} onChange={(event) => { setDocumentType(event.target.value); setPage(1); }} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 font-normal"><option value="">All document types</option><option value="FR1043">FR1043</option><option value="FR1044">FR1044</option><option value="FR109">FR109</option></select></label>
          <label className="text-sm font-medium text-slate-700">Decision<select value={decisionStatus} onChange={(event) => { setDecisionStatus(event.target.value); setPage(1); }} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 font-normal"><option value="">All decisions</option><option value="APPROVED">Approved</option><option value="REJECTED">Rejected</option></select></label>
        </div>
      )}

      {/* Table */}

      {view === "pending" ? <ApprovalTable approvals={approvals} loading={activeQuery.isLoading} onView={handleView} onApprove={handleApprove} onReject={handleReject} /> : <DecidedApprovalsTable approvals={approvals} loading={activeQuery.isLoading} onView={handleView} />}

      {/* Pagination */}

      {meta && meta.last_page > 1 && (

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

          <div className="flex items-center justify-between">

            <p className="text-sm text-slate-500">
              Showing page{" "}
              <span className="font-semibold text-slate-700">
                {meta.current_page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {meta.last_page}
              </span>
            </p>

            <div className="flex gap-2">

              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>

              <button
                disabled={page === meta.last_page}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl bg-[#0F4C81] px-4 py-2 text-sm text-white hover:bg-[#1565C0] disabled:opacity-50"
              >
                Next
              </button>

            </div>

          </div>

        </div>

      )}

      {view === "pending" && decision && (
        <ApprovalDecisionDialog
          approval={decision.approval}
          action={decision.action}
          isPending={approveMutation.isPending || rejectMutation.isPending}
          onClose={() => setDecision(null)}
          onConfirm={submitDecision}
        />
      )}

    </div>
  );
}

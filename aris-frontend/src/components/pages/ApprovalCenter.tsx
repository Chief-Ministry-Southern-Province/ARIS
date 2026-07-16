import { useState } from "react";
import {ClipboardCheck,RefreshCw,} from "lucide-react";
import { useNavigate } from "react-router-dom";

import ApprovalStats from "@/components/approval/ApprovalStats";
import ApprovalSearch from "@/components/approval/ApprovalSearch";
import ApprovalTable from "@/components/approval/ApprovalTable";

import { usePendingApprovals } from "@/hooks/useApprovals";
import type{ Approval } from "@/types/approval.type";

export default function ApprovalCenter() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const {data,isLoading,refetch,isRefetching,} = usePendingApprovals(page, search);

  const approvals = data?.data ?? [];
  const meta = data?.meta;

  console.log(data)

  const handleView = (approval: Approval) => {
    navigate(`/approvals/${approval.id}`);
  };

  const handleApprove = (approval: Approval) => {
    console.log("Approve", approval);
    // TODO:
    // Open Approve Confirmation Dialog
  };

  const handleReject = (approval: Approval) => {
    console.log("Reject", approval);
    // TODO:
    // Open Reject Dialog
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
            onClick={() => refetch()}
            disabled={isRefetching}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F4C81] px-5 py-3 text-white transition hover:bg-[#1565C0] disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                isRefetching ? "animate-spin" : ""
              }`}
            />

            Refresh

          </button>

        </div>

      </div>

      {/* Statistics */}

      <ApprovalStats approvals={approvals} />

      {/* Search */}

      <ApprovalSearch
        search={search}
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />

      {/* Table */}

      <ApprovalTable
        approvals={approvals}
        loading={isLoading}
        onView={handleView}
        onApprove={handleApprove}
        onReject={handleReject}
      />

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

    </div>
  );
}

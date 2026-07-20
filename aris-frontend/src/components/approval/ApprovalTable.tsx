import {
  ClipboardCheck,
  FileText,
  Loader2,
} from "lucide-react";

import type{ Approval } from "@/types/approval.type";

import ApprovalStatusBadge from "./ApprovalStatusBadge";
import ApprovalActionButtons from "./ApprovalActionButtons";

interface Props {
  approvals: Approval[];
  loading?: boolean;

  onView?: (approval: Approval) => void;
}

export default function ApprovalTable({
  approvals,
  loading = false,
  onView,
}: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-72 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">

          <Loader2 className="w-8 h-8 animate-spin text-[#0F4C81]" />

          <p className="text-slate-500">
            Loading pending approvals...
          </p>

        </div>
      </div>
    );
  }

  if (!approvals.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-80 flex items-center justify-center">

        <div className="text-center">

          <ClipboardCheck className="mx-auto w-16 h-16 text-slate-300" />

          <h3 className="mt-5 text-xl font-semibold text-slate-700">
            No Pending Approvals
          </h3>

          <p className="mt-2 text-slate-500">
            All approval requests have been processed.
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

        <div>

          <h2 className="text-lg font-semibold text-slate-900">
            Pending Approvals
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Review and process document approvals.
          </p>

        </div>

      </div>

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-50">

            <tr className="text-left text-sm text-slate-600">

              <th className="px-6 py-4 font-semibold">
                Reference No
              </th>

              <th className="px-6 py-4 font-semibold">
                Case Number
              </th>

              <th className="px-6 py-4 font-semibold">
                Document
              </th>

              <th className="px-6 py-4 font-semibold">
                Revision
              </th>

              <th className="px-6 py-4 font-semibold">
                Institution
              </th>

              <th className="px-6 py-4 font-semibold">
                Status
              </th>

              <th className="px-6 py-4 font-semibold">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {approvals.map((approval) => (

              <tr
                key={approval.id}
                className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
              >

                {/* Reference */}

                <td className="px-6 py-5">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-lg bg-[#0F4C81]/10 flex items-center justify-center">

                      <FileText className="w-5 h-5 text-[#0F4C81]" />

                    </div>

                    <div>

                      <p className="font-medium text-slate-900">
                        {approval.reference_number}
                      </p>

                    </div>

                  </div>

                </td>

                {/* Case */}

                <td className="px-6 py-5">

                  <span className="font-medium text-slate-700">
                    {approval.case.case_number}
                  </span>

                </td>

                {/* Document */}

                <td className="px-6 py-5">

                  <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">

                    {approval.document_type}

                  </span>

                </td>

                {/* Revision */}

                <td className="px-6 py-5">

                  <span className="font-semibold text-slate-700">

                    Rev {approval.revision}

                  </span>

                </td>

                {/* Institution */}

                <td className="px-6 py-5">

                  {approval.institution.name}

                </td>

                {/* Status */}

                <td className="px-6 py-5">

                  <ApprovalStatusBadge
                    status={approval.status}
                  />

                </td>

                {/* Actions */}

                <td className="px-6 py-5">

                  <ApprovalActionButtons
                    onView={() => onView?.(approval)}
                  />

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

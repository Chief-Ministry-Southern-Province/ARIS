import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useApprove, usePendingApprovals, useReject } from "@/hooks/useApprovals";

const PendingApprovals = () => {
  const { data, isLoading, error } = usePendingApprovals();
  const approve = useApprove();
  const reject = useReject();
  const [comment, setComment] = useState<Record<number, string>>({});

  const rejectApproval = async (id: number) => {
    const comments = comment[id]?.trim();
    if (!comments) return toast.error("A rejection comment is required.");
    await reject.mutateAsync({ id, comments });
    toast.success("Approval returned for changes.");
  };

  if (isLoading) return <div className="p-6">Loading pending approvals…</div>;
  if (error) return <div className="p-6 text-red-600">Failed to load pending approvals.</div>;

  return <div className="p-6 space-y-5">
    <h1 className="text-2xl font-semibold text-slate-900">Pending Approvals</h1>
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full text-sm"><thead className="bg-slate-50 text-left text-slate-600"><tr>
        <th className="p-3">Reference Number</th><th className="p-3">Case Number</th><th className="p-3">Submitted By</th><th className="p-3">Revision</th><th className="p-3">Current Step</th><th className="p-3">Actions</th>
      </tr></thead><tbody>
        {data?.data.map((approval) => <tr key={approval.id} className="border-t border-slate-100 align-top">
          <td className="p-3">{approval.document_type}</td><td className="p-3">{approval.case.case_number}</td><td className="p-3">{approval.submitted_by.name}</td><td className="p-3">{approval.revision}</td><td className="p-3">{approval.step}</td>
          <td className="p-3 space-y-2 min-w-72"><div className="flex gap-2"><Link className="rounded bg-slate-100 px-3 py-1" to={`/cases/${approval.case.id}/FR104-3/generate`}>Open document</Link><button className="rounded bg-emerald-600 px-3 py-1 text-white" onClick={() => approve.mutateAsync({ id: approval.id }).then(() => toast.success("Approved."))}>Approve</button></div><div className="flex gap-2"><input className="w-full rounded border p-1" value={comment[approval.id] ?? ""} onChange={(e) => setComment({ ...comment, [approval.id]: e.target.value })} placeholder="Rejection comment"/><button className="rounded bg-red-600 px-3 py-1 text-white" onClick={() => rejectApproval(approval.id)}>Reject</button></div></td>
        </tr>)}
        {!data?.data.length && <tr><td className="p-6 text-center text-slate-500" colSpan={6}>No pending approvals.</td></tr>}
      </tbody></table>
    </div>
  </div>;
};

export default PendingApprovals;

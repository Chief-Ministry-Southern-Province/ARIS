import { Check, Eye, X } from "lucide-react";

interface Props {
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export default function ApprovalActionButtons({
  onView,
  onApprove,
  onReject,
}: Props) {
  return (
    <div className="flex items-center justify-center gap-2">

      <button
        onClick={onView}
        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
      >
        <Eye className="w-4 h-4" />
      </button>

      <button
        onClick={onApprove}
        className="rounded-lg bg-green-100 p-2 text-green-700 hover:bg-green-200"
      >
        <Check className="w-4 h-4" />
      </button>

      <button
        onClick={onReject}
        className="rounded-lg bg-red-100 p-2 text-red-700 hover:bg-red-200"
      >
        <X className="w-4 h-4" />
      </button>

    </div>
  );
}
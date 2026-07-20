import { Eye } from "lucide-react";

interface Props {
  onView: () => void;
}

export default function ApprovalActionButtons({
  onView,
}: Props) {
  return (
    <div className="flex items-center justify-center gap-2">

      <button
        onClick={onView}
        title="View document"
        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
      >
        <Eye className="w-4 h-4" />
      </button>

    </div>
  );
}

import {CheckCircle2,Clock3,FileText,FolderOpen,Upload,UserPlus,XCircle,ShieldCheck,RefreshCcw,ClipboardList,ThumbsUp,} from "lucide-react";

export const TIMELINE_ACTIONS = {
  CASE_CREATED: {
    label: "Case Created",
    icon: FolderOpen,
    badge: "bg-blue-100 text-blue-700 border-blue-200",
  },

  CASE_ASSIGNED: {
    label: "Case Assigned",
    icon: UserPlus,
    badge: "bg-violet-100 text-violet-700 border-violet-200",
  },

  CASE_CLOSED: {
    label: "Case Closed",
    icon: CheckCircle2,
    badge: "bg-gray-200 text-gray-800 border-gray-300",
  },

  ACCIDENT_REPORTED: {
    label: "Accident Reported",
    icon: ClipboardList,
    badge: "bg-red-100 text-red-700 border-red-200",
  },

  STAGE_CHANGED: {
    label: "Stage Changed",
    icon: RefreshCcw,
    badge: "bg-cyan-100 text-cyan-700 border-cyan-200",
  },

  STATUS_CHANGED: {
    label: "Status Changed",
    icon: Clock3,
    badge: "bg-amber-100 text-amber-700 border-amber-200",
  },

  EVIDENCE_UPLOADED: {
    label: "Evidence Uploaded",
    icon: Upload,
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },

  FR1043_DRAFT_CREATED: {
    label: "FR104(3) Draft Created",
    icon: FileText,
    badge: "bg-slate-100 text-slate-700 border-slate-200",
  },

  FR1043_DRAFT_UPDATED: {
    label: "FR104(3) Draft Updated",
    icon: FileText,
    badge: "bg-slate-100 text-slate-700 border-slate-200",
  },

  FR1043_REVISION_CREATED: {
    label: "FR104(3) Revision Created",
    icon: RefreshCcw,
    badge: "bg-violet-100 text-violet-700 border-violet-200",
  },

  FR1043_RESUBMITTED: {
    label: "FR104(3) Resubmitted",
    icon: RefreshCcw,
    badge: "bg-sky-100 text-sky-700 border-sky-200",
  },

  FR1043_SUBMITTED: {
    label: "FR104(3) Submitted",
    icon: FileText,
    badge: "bg-sky-100 text-sky-700 border-sky-200",
  },

  FR1043_APPROVED: {
    label: "FR104(3) Approved",
    icon: ShieldCheck,
    badge: "bg-green-100 text-green-700 border-green-200",
  },

  FR1043_RECOMMENDED: {
    label: "FR104(3) Recommended",
    icon: ThumbsUp,
    badge: "bg-blue-100 text-blue-700 border-blue-200",
  },

  FR1043_REJECTED: {
    label: "FR104(3) Rejected",
    icon: XCircle,
    badge: "bg-red-100 text-red-700 border-red-200",
  },

  FR1043_WORKFLOW_COMPLETED: {
    label: "FR104(3) Workflow Completed",
    icon: CheckCircle2,
    badge: "bg-green-100 text-green-700 border-green-200",
  },

  FR1044_SUBMITTED: {
    label: "FR104(4) Submitted",
    icon: FileText,
    badge: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },

  FR1044_DRAFT_CREATED: { label: "FR104(4) Draft Created", icon: FileText, badge: "bg-slate-100 text-slate-700 border-slate-200" },
  FR1044_DRAFT_UPDATED: { label: "FR104(4) Draft Updated", icon: FileText, badge: "bg-slate-100 text-slate-700 border-slate-200" },
  FR1044_REVISION_CREATED: { label: "FR104(4) Revision Created", icon: RefreshCcw, badge: "bg-violet-100 text-violet-700 border-violet-200" },
  FR1044_RESUBMITTED: { label: "FR104(4) Resubmitted", icon: RefreshCcw, badge: "bg-sky-100 text-sky-700 border-sky-200" },
  FR1044_ATTACHMENT_UPLOADED: { label: "FR104(4) Attachment Uploaded", icon: Upload, badge: "bg-emerald-100 text-emerald-700 border-emerald-200" },

  FR1044_APPROVED: {
    label: "FR104(4) Approved",
    icon: ShieldCheck,
    badge: "bg-green-100 text-green-700 border-green-200",
  },

  FR1044_RECOMMENDED: {
    label: "FR104(4) Recommended",
    icon: ThumbsUp,
    badge: "bg-blue-100 text-blue-700 border-blue-200",
  },

  FR1044_REJECTED: {
    label: "FR104(4) Rejected",
    icon: XCircle,
    badge: "bg-red-100 text-red-700 border-red-200",
  },

  FR1044_WORKFLOW_COMPLETED: {
    label: "FR104(4) Workflow Completed",
    icon: CheckCircle2,
    badge: "bg-green-100 text-green-700 border-green-200",
  },

  FR109_SUBMITTED: {
    label: "FR109 Submitted",
    icon: FileText,
    badge: "bg-purple-100 text-purple-700 border-purple-200",
  },

  FR109_APPROVED: {
    label: "FR109 Approved",
    icon: ShieldCheck,
    badge: "bg-green-100 text-green-700 border-green-200",
  },

  FR109_RECOMMENDED: {
    label: "FR109 Recommended",
    icon: ThumbsUp,
    badge: "bg-blue-100 text-blue-700 border-blue-200",
  },

  FR109_REJECTED: {
    label: "FR109 Rejected",
    icon: XCircle,
    badge: "bg-red-100 text-red-700 border-red-200",
  },

  FR109_WORKFLOW_COMPLETED: {
    label: "FR109 Workflow Completed",
    icon: CheckCircle2,
    badge: "bg-green-100 text-green-700 border-green-200",
  },
} as const;

export const DEFAULT_ACTION = {
  label: "Unknown",
  icon: Clock3,
  badge: "bg-gray-100 text-gray-700 border-gray-200",
};

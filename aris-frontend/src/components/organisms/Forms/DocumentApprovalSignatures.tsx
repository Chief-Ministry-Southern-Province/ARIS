import { useEffect, useState } from "react";
import { LoaderCircle, Signature } from "lucide-react";

import { useSignatureImage } from "@/hooks/useSignatures";
import type { Approval } from "@/types/approval.type";
import { useTranslation } from "react-i18next"; 


interface DocumentApprovalSignaturesProps {
  approvals: Approval[];
}

interface ApproverSignatureProps {
  approval: Approval;
}

function ApproverSignature({ approval }: ApproverSignatureProps) {
  const publicId = approval.signature?.public_id;
  const { data: image, isLoading, isError } = useSignatureImage(publicId);
  const [imageUrl, setImageUrl] = useState<string>();
  const institution = approval.institution?.name || "Institution not available";
  const approverName = approval.approver?.name || "Approver not assigned";
  const role = approval.approver?.role || "Approver";
  const actedAt = approval.acted_at
    ? new Date(approval.acted_at).toLocaleString()
    : "Awaiting decision";
  const status = approval.status.replaceAll("_", " ");

  useEffect(() => {
    if (!image) {
      setImageUrl(undefined);

      return;
    }

    const url = URL.createObjectURL(image);
    setImageUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [image]);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
      <div className="flex h-20 items-center justify-center">
        {isLoading ? (
          <LoaderCircle className="h-6 w-6 animate-spin text-blue-700" />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={`${approverName}'s approval signature`}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <span className="text-xs text-slate-500">
            {isError ? "Unable to load signature" : "No signature recorded"}
          </span>
        )}
      </div>

      <p className="mt-2 font-semibold text-slate-900">{institution}</p>
      <p className="text-sm text-slate-700">{approverName}</p>
      <p className="text-sm text-slate-700">{role}</p>
      <p className="mt-2 text-xs font-medium uppercase tracking-wide text-blue-800">
        Stage {approval.step} · {status}
      </p>
      <p className="mt-1 text-sm text-slate-700">{actedAt}</p>
    </article>
  );
}

export default function DocumentApprovalSignatures({ approvals }: DocumentApprovalSignaturesProps) {
  const { t } = useTranslation();
  const signedApprovals = approvals.filter((approval) => Boolean(approval.signature?.public_id));

  if (signedApprovals.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Signature className="h-5 w-5 text-blue-800" />
        <h2 className="font-semibold text-slate-900">{t("common.approverSignatures")}</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {signedApprovals.map((approval) => (
          <ApproverSignature key={approval.id} approval={approval} />
        ))}
      </div>
    </section>
  );
}

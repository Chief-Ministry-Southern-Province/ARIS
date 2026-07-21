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
  const { data: image, isLoading } = useSignatureImage(publicId);
  const [imageUrl, setImageUrl] = useState<string>();

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
    <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3">
        <p className="font-semibold text-slate-900">{approval.approver.name}</p>
        <p className="text-sm text-slate-500">{approval.approver.role ?? "Approver"}</p>
        <p className="mt-1 text-xs text-slate-500">
          Approved {approval.acted_at ? new Date(approval.acted_at).toLocaleString() : ""}
        </p>
      </div>

      <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white p-2">
        {isLoading ? (
          <LoaderCircle className="h-6 w-6 animate-spin text-blue-700" />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={`${approval.approver.name}'s approval signature`}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <span className="text-xs text-slate-500">Signature unavailable</span>
        )}
      </div>
    </article>
  );
}

export default function DocumentApprovalSignatures({ approvals }: DocumentApprovalSignaturesProps) {
  const { t } = useTranslation();
  const signedApprovals = approvals.filter(
    (approval) => approval.status === "APPROVED" && approval.signature?.public_id,
  );

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

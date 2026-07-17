import { useNavigate, useParams } from "react-router-dom";
import FR104_3Form from "@/components/pages/forms/FR103_3/FR104_3Form";
import FR104_4Form from "@/components/pages/forms/FR104_4/FR104_4Form";
import Loader from "@/components/atoms/Loader";
import { useApprovalDocument, useApprovalHistory } from "@/hooks/useApprovals";

export default function ApprovalDocumentViewer() {
  const { approvalId } = useParams();
  const navigate = useNavigate();
  const numericApprovalId = Number(approvalId);
  const { data: document, isLoading, error } = useApprovalDocument(numericApprovalId);
  const { data: approvalGroups = [] } = useApprovalHistory(
    document?.case?.id ?? 0,
    document?.document_type,
    document?.revision,
  );
  const timeline = approvalGroups.flatMap((group) => group.approvals);

  if (isLoading) return <Loader text="Loading approval document..." />;

  if (error || !document) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        Unable to load the approval document.
      </div>
    );
  }

  if (document.document_type === "FR1044") {
    return <FR104_4Form
      readOnly
      document={document}
      approvalTimeline={timeline}
      onBack={() => navigate("/approvals")}
    />;
  }

  return (
    <FR104_3Form
      readOnly
      document={document}
      approvalTimeline={timeline}
      onBack={() => navigate("/approvals")}
    />
  );
}

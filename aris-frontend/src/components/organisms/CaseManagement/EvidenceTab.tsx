import { useState } from "react";
import {Image,Shield,Eye, Download,FileText,FileCheck,Gavel,Video,} from "lucide-react";
import { useTranslation } from "react-i18next";

import EvidencePreviewModal from "@/components/organisms/Evidence/EvidencePreviewModal";
import type {EvidenceResponse,EvidenceType,} from "@/types/evidence.type";
import EvidenceSummaryCard from "@/components/organisms/Evidence/EvidenceSummaryCard";
import { useEvidenceDownloadMutation } from "@/hooks/mutations/useEvidenceDownloadMutation";
import Loader from "@/components/atoms/Loader";
import { useCase } from "@/hooks/queries/useCaseQueries";
import { useEvidence } from "@/hooks/queries/useEvidenceQueries";

type FilterType = EvidenceType | "ALL";

const EvidenceTab = ({ id }: { id: number }) => {
  const { t } = useTranslation();

  const [selectedType, setSelectedType] = useState<FilterType>("ALL");
  const [previewItem, setPreviewItem] = useState<EvidenceResponse | null>(null);
  const { data: accidentCase, isLoading: loadingAccidentCase, error: accidentCaseError } = useCase(id);
  const accidentId = accidentCase?.accident.id;
  const { data: evidence = [], isLoading: loadingEvidence, error: evidenceError } = useEvidence(accidentId);
  const { mutate: downloadEvidence, isPending: downloadLoading } = useEvidenceDownloadMutation();

  const loading = loadingAccidentCase || loadingEvidence;
  const error = accidentCaseError instanceof Error ? accidentCaseError.message : evidenceError instanceof Error ? evidenceError.message : "";

  const filteredEvidence =
    selectedType === "ALL"
      ? evidence
      : evidence.filter((e) => e.evidence_type === selectedType);

  const photos = evidence.filter((e) => e.evidence_type === "PHOTO");
  const videos = evidence.filter((e) => e.evidence_type === "VIDEO");
  const documents = evidence.filter((e) => e.evidence_type === "DOCUMENT");
  const policeReports = evidence.filter(
    (e) => e.evidence_type === "POLICE_REPORT"
  );
  const courtOrders = evidence.filter(
    (e) => e.evidence_type === "COURT_ORDER"
  );

  const handleDownload = (evidenceItem: EvidenceResponse) => {
    if (accidentId === undefined) return;

    downloadEvidence({ accidentId, evidenceId: evidenceItem.id!, accidentReferenceNumber: evidenceItem.accident_reference_number });
  };

  const getBadgeStyle = (type: EvidenceType) => {
    switch (type) {
      case "PHOTO":
        return "bg-blue-100 text-blue-700";
      case "VIDEO":
        return "bg-amber-100 text-amber-700";
      case "DOCUMENT":
        return "bg-slate-100 text-slate-700";
      case "POLICE_REPORT":
        return "bg-red-100 text-red-700";
      case "COURT_ORDER":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getTypeLabel = (type: EvidenceType) => {
    switch (type) {
      case "PHOTO":
        return "Photo";
      case "VIDEO":
        return "Video";
      case "DOCUMENT":
        return "Document";
      case "POLICE_REPORT":
        return "Police Report";
      case "COURT_ORDER":
        return "Court Order";
      default:
        return "Other";
    }
  };

  const renderPreviewIcon = (type: EvidenceType,file_url:string) => {
    switch (type) {
      case "PHOTO":
        return <img className="w-full h-full object-cover" src={file_url} alt="preview" />;

      case "VIDEO":
        return <Video className="w-14 h-14 text-amber-50" />;

      case "POLICE_REPORT":
        return <Shield className="w-14 h-14 text-red-50" />;

      case "COURT_ORDER":
        return <Gavel className="w-14 h-14 text-purple-50" />;

      case "DOCUMENT":
        return <FileCheck className="w-14 h-14 text-slate-50" />;

      default:
        return <FileText className="w-14 h-14 text-slate-50" />;
    }
  };

  const formatFileSize = (sizeKb: number) => {
    if (sizeKb >= 1024) {
      return `${(sizeKb / 1024).toFixed(1)} MB`;
    }
    return `${sizeKb.toFixed(0)} KB`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return Number.isNaN(date.getTime())
      ? dateString
      : date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-500 text-sm">
        <Loader text={t("common.loading")} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16 text-red-500 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
        <EvidenceSummaryCard
          title="Photos"
          count={photos.length}
          icon={Image}
          color="blue"
          active={selectedType === "PHOTO"}
          onClick={() => setSelectedType("PHOTO")}
        />

        <EvidenceSummaryCard
          title="Videos"
          count={videos.length}
          icon={Video}
          color="purple"
          active={selectedType === "VIDEO"}
          onClick={() => setSelectedType("VIDEO")}
        />

        <EvidenceSummaryCard
          title="Documents"
          count={documents.length}
          icon={FileText}
          color="slate"
          active={selectedType === "DOCUMENT"}
          onClick={() => setSelectedType("DOCUMENT")}
        />

        <EvidenceSummaryCard
          title="Police Reports"
          count={policeReports.length}
          icon={Shield}
          color="red"
          active={selectedType === "POLICE_REPORT"}
          onClick={() => setSelectedType("POLICE_REPORT")}
        />

        <EvidenceSummaryCard
          title="Court Orders"
          count={courtOrders.length}
          icon={Gavel}
          color="purple"
          active={selectedType === "COURT_ORDER"}
          onClick={() => setSelectedType("COURT_ORDER")}
        />

        <EvidenceSummaryCard
          title="All Evidence"
          count={evidence.length}
          icon={Eye}
          color="slate"
          active={selectedType === "ALL"}
          onClick={() => setSelectedType("ALL")}
        />
      </div>

      {/* Evidence List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">Recent Evidence</h3>
        </div>

        {filteredEvidence.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">
            No evidence found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
            {filteredEvidence.map((ev) => (
              <div
                key={ev.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all"
              >
                <div className="h-40 bg-slate-100 flex flex-col items-center justify-center">
                  {renderPreviewIcon(ev.evidence_type, ev.file_url)}

                </div>

                <div className="p-4">
                  <h4 className="font-medium text-slate-900 truncate">
                    {ev.original_name}
                  </h4>

                  <div className="mt-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeStyle(
                        ev.evidence_type
                      )}`}
                    >
                      {getTypeLabel(ev.evidence_type)}
                    </span>
                  </div>

                  {ev.description && (
                    <p className="text-xs text-slate-500 mt-3 line-clamp-2">
                      {ev.description}
                    </p>
                  )}

                  <div className="flex justify-between mt-3 text-xs text-slate-400">
                    <span>{formatDate(ev.uploaded_at)}</span>
                    <span>{formatFileSize(ev.file_size_kb)}</span>
                  </div>

                  <div className="mt-1 text-xs text-slate-500">
                    Uploaded by: {ev.uploaded_by?.name ?? "Unknown"}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => window.open(ev.file_url, "_blank")}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      {t("common.preview")}
                    </button>

                    <button
                      onClick={() => handleDownload(ev)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      {downloadLoading ? "Downloading..." : t("common.download")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {previewItem && (
        <EvidencePreviewModal
          evidence={previewItem}
          onClose={() => setPreviewItem(null)}
        />
      )}
    </div>
  );
};

export default EvidenceTab;

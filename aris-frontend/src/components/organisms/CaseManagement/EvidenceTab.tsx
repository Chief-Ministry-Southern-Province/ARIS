import { useState } from "react";
import {Image,Shield,Eye,Download,FileText,FileCheck,Gavel,} from "lucide-react";
import { useTranslation } from "react-i18next";

import { mockEvidence } from "../../data/mockEvidence";
import EvidencePreviewModal from "@/components/organisms/Evidence/EvidencePreviewModal";
import type { Evidence } from "@/types/evidence.type";
import EvidenceSummaryCard from "@/components/organisms/Evidence/EvidenceSummaryCard";

const EvidenceTab = () => {
  const { t } = useTranslation();
  
  const [selectedType, setSelectedType] = useState<string>("all");
  const filteredEvidence =
  selectedType === "all"
    ? mockEvidence
    : mockEvidence.filter((e) => e.type === selectedType);

  const [previewItem, setPreviewItem] =
    useState<Evidence | null>(null);

  const photos = mockEvidence.filter(
    (e) => e.type === "photo"
  );

  const policeReports = mockEvidence.filter(
    (e) => e.type === "police"
  );

  const recommendations = mockEvidence.filter(
    (e) => e.type === "recommendation"
  );

  const courtOrders = mockEvidence.filter(
    (e) => e.type === "courtOrder"
  );

  const handleDownload = (fileName: string) => {
    console.log("Downloading:", fileName);
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "photo":
        return "bg-blue-100 text-blue-700";
      case "police":
        return "bg-red-100 text-red-700";
      case "recommendation":
        return "bg-green-100 text-green-700";
      case "courtOrder":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "photo":
        return "Photo";
      case "police":
        return "Police Report";
      case "recommendation":
        return "Board Recommendation";
      case "courtOrder":
        return "Court Order";
      default:
        return type;
    }
  };

  const renderPreviewIcon = (type: string) => {
    switch (type) {
      case "photo":
        return (
          <Image className="w-14 h-14 text-blue-50" />
        );

      case "police":
        return (
          <Shield className="w-14 h-14 text-red-50" />
        );

      case "recommendation":
        return (
          <FileCheck className="w-14 h-14 text-green-50" />
        );

      case "courtOrder":
        return (
          <Gavel className="w-14 h-14 text-purple-50" />
        );

      default:
        return (
          <FileText className="w-14 h-14 text-slate-50" />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <EvidenceSummaryCard
          title="Photos"
          count={photos.length}
          icon={Image}
          color="blue"
          active={selectedType === "photo"}
          onClick={() => setSelectedType("photo")}
        />

        <EvidenceSummaryCard
          title="Police Reports"
          count={policeReports.length}
          icon={Shield}
          color="red"
          active={selectedType === "police"}
          onClick={() => setSelectedType("police")}
        />

        <EvidenceSummaryCard
          title="Recommendations"
          count={recommendations.length}
          icon={FileCheck}
          color="green"
          active={selectedType === "recommendation"}
          onClick={() => setSelectedType("recommendation")}
        />

        <EvidenceSummaryCard
          title="Court Orders"
          count={courtOrders.length}
          icon={Gavel}
          color="purple"
          active={selectedType === "courtOrder"}
          onClick={() => setSelectedType("courtOrder")}
        />

        <EvidenceSummaryCard
          title="All Evidence"
          count={mockEvidence.length}
          icon={Eye}
          color="slate"
          active={selectedType === "all"}
          onClick={() => setSelectedType("all")}
        />
      </div>

      {/* Evidence List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">
            Recent Evidence
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
          {filteredEvidence.map((ev) => (
            <div
              key={ev.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-all"
            >
              <div className="h-40 bg-slate-100 flex flex-col items-center justify-center">
                {renderPreviewIcon(ev.type)}

                <span className="mt-2 text-xs text-slate-500">
                  {getTypeLabel(ev.type)}
                </span>
              </div>

              <div className="p-4">
                <h4 className="font-medium text-slate-900 truncate">
                  {ev.name}
                </h4>

                <div className="mt-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeStyle(
                      ev.type
                    )}`}
                  >
                    {getTypeLabel(ev.type)}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-3 line-clamp-2">
                  {ev.description}
                </p>

                <div className="flex justify-between mt-3 text-xs text-slate-400">
                  <span>{ev.date}</span>
                  <span>{ev.size}</span>
                </div>

                <div className="mt-1 text-xs text-blue-600 font-mono">
                  {ev.caseId}
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  Uploaded by: {ev.uploadedBy}
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setPreviewItem(ev)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-sm transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    {t("common.preview")}
                  </button>

                  <button
                    onClick={() =>
                      handleDownload(ev.name)
                    }
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    {t("common.download")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
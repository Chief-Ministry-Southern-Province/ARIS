import { useState } from "react";
import {
  Image,
  Shield,
  Eye,
  Download,
  FileText,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { mockEvidence } from "../../data/mockEvidence";
import EvidencePreviewModal from "@/components/organisms/Evidence/EvidencePreviewModal";
import type { Evidence } from "@/types/evidence.type";

const EvidenceTab = () => {
  const { t } = useTranslation();

  const [previewItem, setPreviewItem] = useState<Evidence | null>(null);

  const photos = mockEvidence.filter(
    (e) => e.type === "photo"
  );

  const reports = mockEvidence.filter(
    (e) => e.type === "police"
  );

  const recentEvidence = mockEvidence.slice(0, 6);

  const handleDownload = (
    url: string,
    fileName: string
  ) => {
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <Image className="w-8 h-8 text-blue-600" />

            <span className="text-2xl font-bold text-blue-700">
              {photos.length}
            </span>
          </div>

          <p className="mt-3 text-sm font-medium text-gray-600">
            {t("evidenceManagement.photo")}
          </p>
        </div>

        <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <Shield className="w-8 h-8 text-red-600" />

            <span className="text-2xl font-bold text-red-700">
              {reports.length}
            </span>
          </div>

          <p className="mt-3 text-sm font-medium text-gray-600">
            {t("evidenceManagement.police")}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <Eye className="w-8 h-8 text-slate-600" />

            <span className="text-2xl font-bold text-slate-700">
              {mockEvidence.length}
            </span>
          </div>

          <p className="mt-3 text-sm font-medium text-gray-600">
            {t("evidenceManagement.allEvidence")}
          </p>
        </div>
      </div>

      {/* Evidence List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">
            Recent Evidence
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
          {recentEvidence.map((ev) => (
            <div
              key={ev.id}
              className="
                bg-white
                border
                border-slate-200
                rounded-xl
                overflow-hidden
                hover:shadow-md
                transition-all
              "
            >
              {/* Preview Area */}
              <div className="h-40 bg-slate-100 flex items-center justify-center overflow-hidden">
                {ev.type === "photo" ? (
                    <img
                      src={
                        (ev as Evidence & { thumbnailUrl?: string; fileUrl?: string }).thumbnailUrl ||
                        (ev as Evidence & { thumbnailUrl?: string; fileUrl?: string }).fileUrl ||
                        ""
                      }
                      alt={ev.name}
                      className="w-full h-full object-cover"
                    />
                ) : (
                  <div className="flex flex-col items-center">
                    <FileText className="w-14 h-14 text-red-500" />

                    <span className="mt-2 text-xs text-slate-500">
                      PDF Document
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h4 className="font-medium text-slate-900 truncate">
                  {ev.name}
                </h4>

                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {ev.description}
                </p>

                <div className="flex justify-between mt-3 text-xs text-slate-400">
                  <span>{ev.date}</span>
                  <span>{ev.size}</span>
                </div>

                <div className="mt-1 text-xs text-blue-600 font-mono">
                  {ev.caseId}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setPreviewItem(ev)}
                    className="
                      flex-1
                      flex
                      items-center
                      justify-center
                      gap-2
                      py-2
                      rounded-lg
                      border
                      border-slate-200
                      hover:bg-slate-50
                      text-sm
                      transition-colors
                    "
                  >
                    <Eye className="w-4 h-4" />
                    {t("common.preview")}
                  </button>

                  <button
                    onClick={() =>
                      handleDownload(
                        (ev as Evidence & { fileUrl?: string }).fileUrl ?? "",
                        ev.name
                      )
                    }
                    className="
                      flex-1
                      flex
                      items-center
                      justify-center
                      gap-2
                      py-2
                      rounded-lg
                      border
                      border-blue-200
                      bg-blue-50
                      text-blue-700
                      hover:bg-blue-100
                      text-sm
                      transition-colors
                    "
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

      {/* Preview Modal */}
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
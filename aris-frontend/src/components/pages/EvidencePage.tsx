import React, { useState } from "react";
import { Upload, Image, Shield, Download, Eye, Trash, Search } from "lucide-react";
import { mockEvidence } from "../../components/data/mockEvidence";
import type { EvidenceType } from "@/types/evidence.type";
import { useTranslation } from "react-i18next";
import EvidencePreviewModal from "@/components/organisms/Evidence/EvidencePreviewModal";

const typeConfig: Record<EvidenceType, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  photo: { icon: Image, color: "text-blue-600", bg: "bg-blue-50", label: "Photos" },
  police: { icon: Shield, color: "text-red-600", bg: "bg-red-50", label: "Police Reports" },
};

function EvidencePage() {

  const { t }= useTranslation();

  const [previewItem, setPreviewItem] = useState<any>(null);

  const [activeType, setActiveType] = useState<EvidenceType | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = mockEvidence.filter(e => {
    const matchType = activeType === "all" || e.type === activeType;
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const typeCounts = Object.keys(typeConfig).reduce((acc, t) => ({
    ...acc, [t]: mockEvidence.filter(e => e.type === t).length
  }), {} as Record<string, number>);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">{t("evidenceManagement.title")}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t("evidenceManagement.subtitle")}</p>
        </div>
      </div>

      {/* Type filter cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveType("all")}
          className={`p-4 rounded-2xl border transition-all text-left ${
            activeType === "all"
              ? "border-blue-500 bg-blue-50 shadow-sm"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <p className="text-2xl font-bold text-gray-900">
            {mockEvidence.length}
          </p>
          <p className="text-sm font-medium text-gray-600 mt-1">
            {t("evidenceManagement.allEvidence")}
          </p>
        </button>

        {(Object.entries(typeConfig) as [
          EvidenceType,
          typeof typeConfig[EvidenceType]
        ][]).map(([type, config]) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`p-4 rounded-2xl border transition-all text-left ${
              activeType === type
                ? `border-blue-500 ${config.bg}`
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <config.icon
                className={`w-8 h-8 ${
                  activeType === type
                    ? config.color
                    : "text-gray-400"
                }`}
              />

              <span
                className={`text-2xl font-bold ${
                  activeType === type
                    ? config.color
                    : "text-gray-900"
                }`}
              >
                {typeCounts[type] || 0}
              </span>
            </div>

            <p
              className={`mt-3 text-sm font-medium ${
                activeType === type
                  ? config.color
                  : "text-gray-600"
              }`}
            >
              {t(`evidenceManagement.${type}`)}
            </p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder={t("evidenceManagement.search") + "..."}
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Evidence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((ev) => {
          const config = typeConfig[ev.type];
          return (
            <div key={ev.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              {/* Preview area */}
              <div className={`h-32 flex items-center justify-center ${config.bg}`}>
                {ev.type === "photo" ? (
                  <div className="relative w-full h-full overflow-hidden bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <Image className="w-12 h-12 text-blue-300" />
                    <div className="absolute top-2 right-2 bg-white/80 rounded-full px-2 py-0.5 text-xs text-gray-600">{ev.size}</div>
                  </div>
                ) : (
                  <config.icon className={`w-12 h-12 ${config.color} opacity-40`} />
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-800 truncate">{ev.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{ev.description}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.color} shrink-0`}>
                    {config.label.replace("s", "").slice(0, -1) || config.label}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 mt-3">
                  <span>{ev.uploadedBy} · {ev.date}</span>
                  <span className="font-medium">{ev.size}</span>
                </div>
                <div className="text-xs text-blue-600 font-mono mt-1">{ev.caseId}</div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                  <button
                    onClick={() => setPreviewItem(ev)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Preview
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
                    <Download className="w-3.5 h-3.5" />Download
                  </button>
                  <button className="px-2.5 py-1.5 text-xs border border-red-100 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center bg-white rounded-xl border border-gray-100">
          <Upload className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">{t("evidenceManagement.noEvidenceFound")}</p>
        </div>
      )}

      <EvidencePreviewModal
        evidence={previewItem}
        onClose={() => setPreviewItem(null)}
      />

    </div>
  );
}

export default EvidencePage;

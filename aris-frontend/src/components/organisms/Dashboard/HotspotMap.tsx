import { hotspotLocations } from "../../data/mockData";
import { MapPin } from "lucide-react";

import { useTranslation } from "react-i18next";

const HotspotMap = () => {
  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden border border-blue-100" style={{ background: "linear-gradient(160deg, #EFF6FF 0%, #DBEAFE 100%)" }}>
      {/* Stylized SL map silhouette */}
      <svg viewBox="0 0 200 380" className="absolute inset-0 h-full opacity-8" fill="none" preserveAspectRatio="xMidYMid meet">
        <path d="M100 8 C128 12 158 38 163 68 C168 98 148 118 143 148 C138 178 153 198 148 228 C143 258 118 290 108 322 C98 352 92 372 100 390 C88 372 78 352 72 322 C62 292 42 262 38 228 C34 198 48 178 44 148 C40 118 24 98 28 68 C32 38 68 12 100 8Z" fill="#1E40AF" />
      </svg>

      {hotspotLocations.map((loc) => {
        const x = ((loc.lng - 79.6) / (81.0 - 79.6)) * 75 + 10;
        const y = ((8.0 - loc.lat) / (8.0 - 5.9)) * 82 + 5;
        const r = Math.min(24, loc.count * 3.5 + 10);
        const color = loc.severity === "High" ? "#EF4444" : loc.severity === "Medium" ? "#F59E0B" : "#22C55E";
        return (
          <div key={loc.id} className="absolute group cursor-pointer"
            style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)" }}>
            {/* Pulse ring */}
            <div className="absolute inset-0 rounded-full animate-ping opacity-30"
              style={{ background: color, width: r + 8, height: r + 8, top: -4, left: -4 }} />
            <div className="relative rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 border-white"
              style={{ width: r, height: r, background: color, fontSize: Math.max(9, r * 0.42) }}>
              {loc.count}
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-xl">
              <strong>{loc.name}</strong><br />{loc.count} incidents · {loc.severity} risk
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur rounded-xl px-3 py-2 shadow-sm border border-blue-100">
        <div className="text-xs font-bold text-gray-600 mb-1.5">Risk Level</div>
        {[["High", "#EF4444"], ["Medium", "#F59E0B"], ["Low", "#22C55E"]].map(([l, c]) => (
          <div key={l} className="flex items-center gap-1.5 text-xs text-gray-600 mb-0.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />{l}
          </div>
        ))}
      </div>
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-lg px-2.5 py-1.5 shadow-sm border border-blue-100">
        <div className="text-xs font-bold text-blue-800">Sri Lanka</div>
        <div className="text-xs text-gray-500">{hotspotLocations.length} hotspots</div>
      </div>
    </div>
  );
}

export const HotspotMapCard = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800">{t("hotspotMap")}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5" />
              {hotspotLocations.reduce((s, l) => s + l.count, 0)} incidents
            </div>
          </div>
          <HotspotMap />
        </div>
  )
}
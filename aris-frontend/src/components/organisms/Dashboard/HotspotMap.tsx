import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useDashboardStatistics } from "@/hooks/useDashboard";

const riskStyles = {
  HIGH: { color: "#EF4444", label: "High" },
  MEDIUM: { color: "#F59E0B", label: "Medium" },
  LOW: { color: "#22C55E", label: "Low" },
} as const;

function hotspotIcon(count: number, color: string) {
  const size = Math.min(48, 26 + count * 3);

  return L.divIcon({
    className: "",
    html: `<div style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border:2px solid #ffffff;border-radius:9999px;background:${color};color:#ffffff;font-size:13px;font-weight:700;box-shadow:0 4px 12px rgba(15,23,42,.28)">${count}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

const HotspotMap = () => {
  const { data: statistics } = useDashboardStatistics();
  const hotspots = statistics?.hotspots ?? [];

  return (
    <div className="relative h-64 overflow-hidden rounded-xl border border-blue-100">
      <MapContainer
        center={[7.8731, 80.7718]}
        zoom={7}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {hotspots.map((hotspot) => {
          const style = riskStyles[hotspot.risk];

          return (
            <Marker
              key={hotspot.id}
              position={[hotspot.latitude, hotspot.longitude]}
              icon={hotspotIcon(hotspot.count, style.color)}
            >
              <Popup>
                <strong>{hotspot.name}</strong><br />
                {hotspot.count} incident{hotspot.count === 1 ? "" : "s"} · {style.label} risk
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <div className="pointer-events-none absolute bottom-3 left-3 z-[500] rounded-xl border border-blue-100 bg-white/95 px-3 py-2 shadow-sm backdrop-blur">
        <div className="mb-1.5 text-xs font-bold text-slate-600">Risk Level</div>
        {(Object.keys(riskStyles) as Array<keyof typeof riskStyles>).map((risk) => (
          <div key={risk} className="mb-0.5 flex items-center gap-1.5 text-xs text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: riskStyles[risk].color }} />
            {riskStyles[risk].label}
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute right-3 top-3 z-[500] rounded-lg border border-blue-100 bg-white/95 px-2.5 py-1.5 shadow-sm backdrop-blur">
        <div className="text-xs font-bold text-blue-800">Sri Lanka</div>
        <div className="text-xs text-slate-500">{hotspots.length} hotspots</div>
      </div>
    </div>
  );
};

export const HotspotMapCard = () => {
  const { t } = useTranslation();
  const { data: statistics } = useDashboardStatistics();
  const locatedIncidents = (statistics?.hotspots ?? []).reduce((total, hotspot) => total + hotspot.count, 0);

  return (
    <div className="min-h-[365px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">{t("dashboard.accidentHotspotMp")}</h3>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5" />
          {locatedIncidents} located incidents
        </div>
      </div>
      <HotspotMap />
    </div>
  );
};

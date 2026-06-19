import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { hotspotLocations } from "../../data/mockData";
import { Card, SectionTitle } from "./shared";

export default function GISHotspotsTable() {
  const { t } = useTranslation();

  return (
    <Card>
      <SectionTitle>{t("analytics.charts.gisHotspots")}</SectionTitle>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ borderBottom: "1px solid #D1D9E0" }}>
              {["Location", "Incidents", "Severity", "Coordinates"].map((col) => (
                <th
                  key={col}
                  className="text-left py-2 px-3 font-semibold uppercase tracking-wider"
                  style={{ color: "#4B5D6E" }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hotspotLocations.map((spot, i) => (
              <tr
                key={i}
                style={{ borderBottom: "1px solid #F0F3F7" }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: "#1B3A6B" }} />
                    <span style={{ color: "#1B3A6B" }} className="font-medium">
                      {spot.name}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-3 font-semibold" style={{ color: "#1B3A6B" }}>
                  {spot.count}
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className="px-2 py-0.5 rounded-sm text-xs font-semibold uppercase tracking-wide"
                    style={
                      spot.severity === "High"
                        ? { background: "#FDECEA", color: "#922B21" }
                        : spot.severity === "Medium"
                        ? { background: "#FEF3CD", color: "#B7791F" }
                        : { background: "#E6F4EC", color: "#1D6A3A" }
                    }
                  >
                    {spot.severity}
                  </span>
                </td>
                <td className="py-2.5 px-3" style={{ color: "#7A8F9E", fontFamily: "monospace" }}>
                  {spot.lat?.toFixed(4)}, {spot.lng?.toFixed(4)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

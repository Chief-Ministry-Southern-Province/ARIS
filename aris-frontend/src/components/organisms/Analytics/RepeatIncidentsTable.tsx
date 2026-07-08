import { useTranslation } from "react-i18next";
import { Card, SectionTitle } from "./shared";

const repeatIncidents = [
  { driver: "Kamal Perera",   incidents: 4, institution: "CGH" },
  { driver: "Suresh Jayasena", incidents: 3, institution: "KDH" },
  { driver: "Dilan Mendis",   incidents: 3, institution: "KTH" },
  { driver: "Sampath Herath", incidents: 2, institution: "WBH" },
  { driver: "Pradeep Kumara", incidents: 2, institution: "NHC" },
];

export default function RepeatIncidentsTable() {
  const { t } = useTranslation();

  return (
    <Card>
      <SectionTitle>{t("analytics.charts.repeatIncidentsDriverAnalysis")}</SectionTitle>
      <div className="space-y-4">
        {repeatIncidents.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-sm flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{
                background:
                  item.incidents >= 4 ? "#922B21"
                  : item.incidents >= 3 ? "#B7791F"
                  : "#1B3A6B",
              }}
            >
              {item.incidents}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium" style={{ color: "#1B3A6B" }}>
                  {item.driver}
                </span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-sm uppercase tracking-wide"
                  style={{ background: "#E8EFF7", color: "#2563A8" }}
                >
                  {item.institution}
                </span>
              </div>
              <div className="h-1.5 rounded-sm overflow-hidden" style={{ background: "#E4EAF0" }}>
                <div
                  className="h-full rounded-sm"
                  style={{
                    width: `${(item.incidents / 5) * 100}%`,
                    background:
                      item.incidents >= 4 ? "#922B21"
                      : item.incidents >= 3 ? "#B7791F"
                      : "#1B3A6B",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

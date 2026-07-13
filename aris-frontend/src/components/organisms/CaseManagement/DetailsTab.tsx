import { Calendar, MapPin, Car, User, Building2, FileText, Hash, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGetAccident } from "@/hooks/useAccident";
import { useEffect } from "react";
import { useAccidentCase } from "@/hooks/useAccidentCase";

const DetailsTab = ({ id }: { id: number }) => {
  const { t } = useTranslation();
  const { fetchAccident, accident, loading: loadingAccident, error: errorAccident } = useGetAccident();
  const { fetchAccidentCase, accidentCase,loading: loadingAccidentCase, error: errorAccidentCase } = useAccidentCase();

  const loading = loadingAccident || loadingAccidentCase;
  const error = errorAccident || errorAccidentCase;

  useEffect(() => {
    if (id) {
      fetchAccidentCase(id);
    }
  }, [id]);

  const accidentId = accidentCase?.accident.id;

  useEffect(() => {
    if (accidentId) {
      fetchAccident(accidentId);
    }
  }, [accidentId]);

  if (loading) {
    return (
      <div className="py-12 text-center flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
        <p className="text-gray-400 text-sm">Loading accident details...</p>
      </div>
    );
  }

  if (error || !accident) {
    return (
      <div className="py-12 text-center text-red-500 font-medium">
        {error || "Failed to load accident details"}
      </div>
    );
  }

  const details = [
    {
      icon: Hash,
      label: t("caseManagement.details.caseId"),
      value: accident.reference_number,
      highlight: true,
    },
    {
      icon: Calendar,
      label: t("caseManagement.details.dateTime"),
      value: `${new Date(accident.accident_date).toLocaleDateString()} ${accident.accident_time}`,
    },
    {
      icon: MapPin,
      label: t("caseManagement.details.location"),
      value: `${accident.location}, ${accident.district}, ${accident.province}`,
    },
    {
      icon: Car,
      label: t("caseManagement.details.vehicle"),
      value: accident.vehicle
        ? `${accident.vehicle.vehicle_number} (${accident.vehicle.brand} ${accident.vehicle.model})`
        : "N/A",
    },
    {
      icon: User,
      label: t("caseManagement.details.driver"),
      value: accident.driver?.name || "N/A",
    },
    {
      icon: Building2,
      label: t("caseManagement.details.institution"),
      value: accident.institution?.name || "N/A",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Banner */}
      <div className="bg-linear-to-r from-blue-900 to-blue-800 rounded-2xl p-5 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-blue-100 text-sm">
              {t("caseManagement.details.caseId")}
            </p>

            <h2 className="text-xl font-bold font-mono">
              {accident.reference_number}
            </h2>

            <p className="mt-2 text-blue-100 font-semibold">
              {t(`report.VehicleCollision`)} — {t(`report.severityOptions.${accident.severity}`)}
            </p>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {details.map(({ icon: Icon, label, value, highlight }) => (
          <div
            key={label}
            className="
              group
              bg-white
              border border-slate-200
              rounded-xl
              p-4
              shadow-sm
              hover:shadow-md
              hover:border-blue-200
              transition-all
            "
          >
            <div className="flex items-start gap-3">
              <div
                className="
                  w-11 h-11
                  rounded-xl
                  bg-blue-50
                  flex items-center justify-center
                  shrink-0
                  group-hover:bg-blue-100
                  transition-colors
                "
              >
                <Icon className="w-5 h-5 text-blue-600" />
              </div>

              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide font-medium text-slate-500">
                  {label}
                </p>

                <p
                  className={`mt-1 wrap-break-word ${
                    highlight
                      ? "font-mono text-blue-700 font-bold"
                      : "text-slate-900 font-semibold"
                  }`}
                >
                  {value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Extra Conditions & Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Road & Weather Conditions */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-2">
            {t("report.EnvironmentalConditions")}
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 block">{t("report.roadCondition")}</span>
              <span className="font-semibold text-slate-800">
                {t(`report.roadConditionOptions.${accident.road_condition}`)}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block">{t("report.weatherCondition")}</span>
              <span className="font-semibold text-slate-800">
                {t(`report.weatherConditionOptions.${accident.weather_condition}`)}
              </span>
            </div>
          </div>
        </div>

        {/* Casualties & Stats */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-slate-900 border-b border-slate-100 pb-2">
            {t("report.casualties")} & {t("report.injuries")}
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500 block">{t("report.casualties")}</span>
              <span className="font-semibold text-red-600 text-lg">
                {accident.fatality_count}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block">{t("report.injuries")}</span>
              <span className="font-semibold text-orange-600 text-lg">
                {accident.injury_count}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {accident.description && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 bg-slate-50">
            <FileText className="w-5 h-5 text-blue-600" />

          <h3 className="font-semibold text-slate-900">
            {t("caseManagement.details.description")}
          </h3>
        </div>

        <div className="p-5">
          <p className="text-sm leading-7 text-slate-700 whitespace-pre-line">
            {accident.description || "No description provided."}
          </p>
        </div>
      </div>)}

      {/* Vehicle Damage Details */}
      {accident.vehicle_damage && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 bg-slate-50">
            <Car className="w-5 h-5 text-blue-600" />

            <h3 className="font-semibold text-slate-900">
              Vehicle Damage Details
            </h3>
          </div>

          <div className="p-5">
            <p className="text-sm leading-7 text-slate-700 whitespace-pre-line">
              {accident.vehicle_damage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsTab;
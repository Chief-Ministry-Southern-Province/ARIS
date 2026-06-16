import {Calendar,MapPin,Car,User,Building2,FileText,Hash,} from "lucide-react";
import { useTranslation } from "react-i18next";

import { mockCases } from "../../data/mockData";

const DetailsTab = ({ id }: { id: number }) => {
  const { t } = useTranslation();

  const caseItem = mockCases.find((c) => c.id === id);

  if (!caseItem) return null;

  const details = [
    {
      icon: Hash,
      label: t("caseManagement.details.caseId"),
      value: caseItem.case_id,
      highlight: true,
    },
    {
      icon: Calendar,
      label: t("caseManagement.details.dateTime"),
      value: `${caseItem.date} ${caseItem.time}`,
    },
    {
      icon: MapPin,
      label: t("caseManagement.details.location"),
      value: caseItem.location,
    },
    {
      icon: Car,
      label: t("caseManagement.details.vehicle"),
      value: caseItem.vehicle,
    },
    {
      icon: User,
      label: t("caseManagement.details.driver"),
      value: caseItem.driver,
    },
    {
      icon: Building2,
      label: t("caseManagement.details.institution"),
      value: caseItem.institution,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary Banner */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-2xl p-5 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-blue-100 text-sm">
              {t("caseManagement.details.caseId")}
            </p>

            <h2 className="text-xl font-bold font-mono">
              {caseItem.case_id}
            </h2>

            <p className="mt-2 text-blue-100">
              {caseItem.title}
            </p>
          </div>

        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {details.map(
          ({
            icon: Icon,
            label,
            value,
            highlight,
          }) => (
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
          )
        )}
      </div>

      {/* Description */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100 bg-slate-50">
          <FileText className="w-5 h-5 text-blue-600" />

          <h3 className="font-semibold text-slate-900">
            {t("caseManagement.details.description")}
          </h3>
        </div>

        <div className="p-5">
          <p className="text-sm leading-7 text-slate-700">
            {caseItem.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailsTab;
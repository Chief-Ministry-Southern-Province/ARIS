import {Calendar,MapPin,Car,User,Building2,FileText} from "lucide-react";
import { useTranslation } from "react-i18next";

import { mockCases } from "../../data/mockData";

const DetailsTab = ({ id }: { id: number }) => {

  const { t } = useTranslation();

  const caseItem = mockCases.find(c => c.id === id);
  if (!caseItem) return null;

  const details = [
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
      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {details.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="
              group
              bg-white
              border border-gray-200
              rounded-xl
              p-4
              transition-all
              duration-200
              hover:border-blue-200
              hover:shadow-md
            "
          >
            <div className="flex items-start gap-3">
              <div
                className="
                  shrink-0
                  w-10 h-10
                  rounded-lg
                  bg-blue-50
                  flex items-center justify-center
                  group-hover:bg-blue-100
                  transition-colors
                "
              >
                <Icon className="w-5 h-5 text-blue-600" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {label}
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900 wrap-break-word">
                  {value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Description Card */}
      <div
        className="
          bg-white
          border border-gray-200
          rounded-xl
          overflow-hidden
          shadow-sm
        "
      >
        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
          <FileText className="w-5 h-5 text-blue-600" />

          <h3 className="text-sm font-semibold text-gray-900">
            {t("caseManagement.details.description")}
          </h3>
        </div>

        <div className="p-5">
          <p className="text-sm leading-7 text-gray-700">
            {caseItem.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailsTab;
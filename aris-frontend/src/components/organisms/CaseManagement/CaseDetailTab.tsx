import { mockCases } from "../../data/mockData";
import { Calendar, MapPin, Car, User, CheckCircle, AlertCircle, FileText, Clock, Eye, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getAction } from "@/components/data/caseManagement";

const CaseDetailTab = ({ id, onClose }: { id: number; onClose: () => void }) => {

  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("details");
  const caseItem = mockCases.find(c => c.id === id)!;

  const timelineEvents = [
  { date: "2024-03-15 10:00", user: "Kamal Perera", role: "Driver", action: "Accident reported", type: "report" },
  { date: "2024-03-15 14:30", user: "Nimal Silva", role: "Development Officer", action: "Report reviewed and approved", type: "approve" },
  { date: "2024-03-16 09:00", user: "Saman Fernando", role: "Administrative Officer", action: "Investigation initiated. Police report obtained.", type: "investigate" },
  { date: "2024-03-17 11:00", user: "Ruwan Bandara", role: "Investigation Officer", action: "Field investigation started", type: "investigate" },
  { date: "2024-03-18 15:00", user: "Ruwan Bandara", role: "Investigation Officer", action: "Evidence collected and uploaded", type: "evidence" },
];

const actions = getAction(caseItem.id,t);


  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end">
      <div className="w-full max-w-2xl h-full bg-white shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between border-b border-gray-100"
          style={{ background: "#1E40AF" }}
        >
          <div>
            <div className="text-white font-bold">
              {caseItem.case_id}
            </div>
            <div className="text-blue-200 text-sm">
              {caseItem.title}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-blue-700 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-white">
          {[
            {
              key: "details",
              label: t("caseManagement.tabs.details"),
            },
            {
              key: "timeline",
              label: t("caseManagement.tabs.timeline"),
            },
            {
              key: "actions",
              label: t("caseManagement.tabs.actions"),
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-blue-600 text-blue-700"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">

          {/* Details Tab */}
          {activeTab === "details" && (
            <div className="space-y-4">
              {[
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
                  icon: User,
                  label: t("caseManagement.details.institution"),
                  value: caseItem.institution,
                },
                {
                  icon: User,
                  label: t("caseManagement.details.investigator"),
                  value: caseItem.investigator,
                },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <Icon className="w-4 h-4 text-gray-400 mt-0.5" />

                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">
                      {label}
                    </div>

                    <div className="text-sm font-medium text-gray-800">
                      {value}
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">
                  {t("caseManagement.details.description")}
                </div>

                <div className="text-sm text-gray-700">
                  {caseItem.description}
                </div>
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === "timeline" && (
            <div className="space-y-1">
              {timelineEvents.map((ev, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        ev.type === "approve"
                          ? "bg-green-100"
                          : ev.type === "report"
                          ? "bg-blue-100"
                          : ev.type === "evidence"
                          ? "bg-purple-100"
                          : "bg-yellow-100"
                      }`}
                    >
                      {ev.type === "approve" ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : ev.type === "report" ? (
                        <AlertCircle className="w-4 h-4 text-blue-600" />
                      ) : ev.type === "evidence" ? (
                        <FileText className="w-4 h-4 text-purple-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-600" />
                      )}
                    </div>

                    {i < timelineEvents.length - 1 && (
                      <div className="w-0.5 bg-gray-200 flex-1 my-1" />
                    )}
                  </div>

                  <div className="pb-4 flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {ev.action}
                    </p>

                    <p className="text-xs text-gray-500">
                      {ev.user} · {ev.role}
                    </p>

                    <p className="text-xs text-gray-400 mt-0.5">
                      {ev.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Actions Tab */}
          {activeTab === "actions" && (
            <div className="space-y-3">
              {actions.map(({ label, icon: Icon, color, path }) => (
                <Link
                  key={label}
                  to={path}
                  className={`w-full flex items-center gap-3 px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${color}`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CaseDetailTab;

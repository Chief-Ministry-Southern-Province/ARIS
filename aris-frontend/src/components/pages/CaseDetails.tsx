import { useState } from "react";
import ApprovalWorkflow from "@/components/pages/ApprovalWorkflow";
import DetailsTab from "@/components/organisms/CaseManagement/DetailsTab";
import CaseActionTab from "@/components/organisms/CaseManagement/CaseActionTab";
import EvidenceTab from "@/components/organisms/CaseManagement/EvidenceTab";
import InvestigationTeamTab from "@/components/organisms/CaseManagement/InvestigationTeamTab";
import { useTranslation } from "react-i18next";

import { useParams } from "react-router-dom";
import {FileText,ClipboardCheck,GitBranch, Files,ShieldCheck} from "lucide-react";
 
const caseDetailsTabs = [
    {id: "Details",icon: FileText,label: "Details",i18n: "caseDetails.tabs.details"},
    {id: "Action",icon: ClipboardCheck,label: "Actions",i18n: "caseDetails.tabs.actions"},
    {id: "Workflow",icon: GitBranch,label: "Workflow",i18n: "caseDetails.tabs.workflow"},
    {id: "Evidence",icon: Files,label: "Evidence",i18n: "caseDetails.tabs.evidence"},
    {id: "InvestigationTeam",icon: ShieldCheck,label: "Investigation Team",i18n: "caseDetails.tabs.investigationTeam"},
];

function CaseDetails() {

  const { t } = useTranslation();
  const { caseId } = useParams<{ caseId: string }>();
  const numericId = Number(caseId);

  const [activeTab, setActiveTab] = useState("Details");

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-gray-900">{t("caseDetails.title")}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{t("caseDetails.subtitle")}</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex overflow-x-auto border-b border-gray-100">
          {caseDetailsTabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? "border-blue-600 text-blue-700 bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              <tab.icon className="w-4 h-4" />
              {t(tab.i18n)}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* case details */}
          {activeTab === "Details" && (
            <DetailsTab id={numericId} />
          )}

          {/* case actions */}
          {activeTab === "Action" && (
            <CaseActionTab id={numericId} />
          )}

          {/* case workflow */}
          {activeTab === "Workflow" && (
            <ApprovalWorkflow />
          )}

          {/* case evidence */}
          {activeTab === "Evidence" && (
            <EvidenceTab/>
          )}

          {/* investigation team */}
          {activeTab === "InvestigationTeam" && (
            <InvestigationTeamTab />
          )}

        </div>
      </div>
    </div>
  );
}

export default CaseDetails;

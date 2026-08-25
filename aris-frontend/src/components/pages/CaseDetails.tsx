import ApprovalWorkflow from "@/components/pages/ApprovalWorkflow";
import DetailsTab from "@/components/organisms/CaseManagement/DetailsTab";
import CaseActionTab from "@/components/organisms/CaseManagement/CaseActionTab";
import EvidenceTab from "@/components/organisms/CaseManagement/EvidenceTab";
import { useTranslation } from "react-i18next";
import { useCase } from "@/hooks/queries/useCaseQueries";

import { useParams, useSearchParams } from "react-router-dom";
import {FileText,ClipboardCheck,GitBranch, Files, Clock3} from "lucide-react";


const caseDetailsTabs = [
    {id: "Details",icon: FileText,label: "Details",i18n: "caseDetails.tabs.details"},
    {id: "Action",icon: ClipboardCheck,label: "Actions",i18n: "caseDetails.tabs.actions"},
    {id: "Workflow",icon: GitBranch,label: "Workflow",i18n: "caseDetails.tabs.workflow"},
    {id: "Timeline",icon: Clock3,label: "Timeline",i18n: "caseDetails.tabs.timeline"},
    {id: "Evidence",icon: Files,label: "Evidence",i18n: "caseDetails.tabs.evidence"},
];

const caseDetailsTabIds = new Set(caseDetailsTabs.map((tab) => tab.id));

function CaseDetails() {

  const { t } = useTranslation();
  const { caseId } = useParams<{ caseId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const numericId = Number(caseId);
  const { data: accidentCase } = useCase(numericId);
  const requestedTab = searchParams.get("tab");
  const activeTab = requestedTab && caseDetailsTabIds.has(requestedTab)
    ? requestedTab
    : "Details";

  const selectTab = (tabId: string) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set("tab", tabId);
      return next;
    });
  };

  return (
    (<div className="p-6 space-y-5">
      <div>
        <h1 className="text-gray-900">{t("caseDetails.title")}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{t("caseDetails.subtitle")}</p>
      </div>

      {/* Tab Navigation */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex overflow-x-auto border-b border-border bg-muted/40">
          {caseDetailsTabs.map(tab => (
            <button key={tab.id} onClick={() => selectTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? "border-primary bg-primary/15 text-primary" : "border-transparent text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
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
            accidentCase && <CaseActionTab id={numericId} modes={accidentCase.form_actions} />
          )}

          {/* case workflow */}
          {activeTab === "Workflow" && (
            <ApprovalWorkflow caseId={numericId} view="approvals" />
          )}

          {activeTab === "Timeline" && (
            <ApprovalWorkflow caseId={numericId} view="timeline" />
          )}

          {/* case evidence */}
          {activeTab === "Evidence" && (
            <EvidenceTab id={numericId} />
          )}

        </div>
      </div>
    </div>)
  );
}

export default CaseDetails;

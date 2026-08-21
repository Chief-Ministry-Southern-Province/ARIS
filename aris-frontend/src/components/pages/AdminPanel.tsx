import { useSearchParams } from "react-router-dom";
import { adminTabs } from "../data/admin";
import UserTab from "@/components/organisms/AdminPanel/UserTab";
import InstitutionTab from "@/components/organisms/AdminPanel/InstitutionTab";
import VehicleTab from "@/components/organisms/AdminPanel/VehicleTab";
import AuditLogTab from "@/components/organisms/AdminPanel/AuditLogTab";
import WorkflowSettingTab from "@/components/organisms/AdminPanel/WorkflowSettingTab";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/auth/AuthContext";

function AdminPanel() {

  const {t} = useTranslation();
  const { role } = useAuth();

  const visibleTabs = adminTabs.filter((tab) =>
    !tab.roles || tab.roles.some((allowedRole) => role.includes(allowedRole)),
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const activeTab = visibleTabs.some((tab) => tab.id === requestedTab)
    ? requestedTab
    : "users";

  const selectTab = (tabId: string) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set("tab", tabId);
      return next;
    });
  };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-gray-900">{t("adminPanel.title")}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{t("adminPanel.subtitle")}</p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex overflow-x-auto border-b border-gray-100">
          {visibleTabs.map(tab => (
            <button key={tab.id} onClick={() => selectTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? "border-blue-600 text-blue-700 bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              <tab.icon className="w-4 h-4" />
              {t(tab.i18n)}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* Users */}
          {activeTab === "users" && (
            <UserTab />
          )}

          {/* Institutions */}
          {activeTab === "institutions" && (
            <InstitutionTab />
          )}

          {/* Vehicles */}
          {activeTab === "vehicles" && (
            <VehicleTab />
          )}

          {/* Workflow Settings */}
          {role.includes("system_admin") && activeTab === "workflow" && (
            <WorkflowSettingTab />
          )}

          {/* Audit Logs */}
          {role.includes("system_admin") && activeTab === "audit" && (
            <AuditLogTab />
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;

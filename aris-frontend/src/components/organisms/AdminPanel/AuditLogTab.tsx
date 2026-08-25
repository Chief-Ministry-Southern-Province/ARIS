import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuditLogs } from "@/hooks/useAuditLogs";

const modules = ["Authentication", "Users", "Institutions", "Vehicles", "Approval", "Workflow"];
const actions = ["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGIN_FAILED", "LOGOUT", "RECOMMEND", "APPROVE", "REJECT"];

const auditDescriptionKeys: Record<string, string> = {
  "Logged in.": "loggedIn",
  "Failed login attempt.": "failedLoginAttempt",
  "Logged out.": "loggedOut",
};

const AuditLogTab = () => {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState("");
  const [module, setModule] = useState("");
  const [action, setAction] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const filters = useMemo(() => ({ page, search: search || undefined, module: module || undefined, action: action || undefined, from: from || undefined, to: to || undefined }), [page, search, module, action, from, to]);
  const { data, isLoading, isError } = useAuditLogs(filters);
  const logs = data?.data ?? [];
  const meta = data?.meta;
  const dateLocale = i18n.language.startsWith("si") ? "si-LK" : "en-LK";
  const translateAuditLabel = (group: "modules" | "actions" | "entities", value: string) =>
    t(`adminPanel.audit.${group}.${value}`, { defaultValue: value });
  const translateDescription = (description: string | null) =>
    description
      ? t(`adminPanel.audit.descriptions.${auditDescriptionKeys[description]}`, {
          defaultValue: description,
        })
      : "—";

  const resetPage = () => setPage(1);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(event) => { setSearch(event.target.value); resetPage(); }} type="search" placeholder={t("adminPanel.audit.searchPlaceholder")} className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={module} onChange={(event) => { setModule(event.target.value); resetPage(); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="">{t("adminPanel.audit.allModules")}</option>{modules.map((item) => <option key={item} value={item}>{translateAuditLabel("modules", item)}</option>)}
        </select>
        <select value={action} onChange={(event) => { setAction(event.target.value); resetPage(); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="">{t("adminPanel.audit.allActions")}</option>{actions.map((item) => <option key={item} value={item}>{translateAuditLabel("actions", item)}</option>)}
        </select>
        <input value={from} onChange={(event) => { setFrom(event.target.value); resetPage(); }} type="date" aria-label={t("adminPanel.audit.fromDate")} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
        <input value={to} onChange={(event) => { setTo(event.target.value); resetPage(); }} type="date" aria-label={t("adminPanel.audit.toDate")} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
      </div>
      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="w-full text-xs"><thead className="bg-gray-50 border-b border-gray-100"><tr>
          {["time", "user", "action", "resource", "ipAddress", "details"].map((heading) => <th key={heading} className="text-left px-4 py-3 font-semibold text-gray-500 uppercase tracking-wider">{t(`adminPanel.audit.${heading}`)}</th>)}
        </tr></thead><tbody className="divide-y divide-gray-50">
          {isLoading && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">{t("adminPanel.audit.loading")}</td></tr>}
          {isError && <tr><td colSpan={6} className="px-4 py-8 text-center text-red-600">{t("adminPanel.audit.loadError")}</td></tr>}
          {!isLoading && !isError && logs.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">{t("adminPanel.audit.noEvents")}</td></tr>}
          {logs.map((log) => <tr key={log.id} className="hover:bg-blue-50/20 transition-colors">
            <td className="px-4 py-3 font-mono text-gray-500 whitespace-nowrap">{new Date(log.created_at).toLocaleString(dateLocale)}</td>
            <td className="px-4 py-3 font-medium text-gray-700">{log.user?.name ?? t("adminPanel.audit.system")}</td>
            <td className="px-4 py-3"><span className="font-medium text-blue-700">{translateAuditLabel("actions", log.action)}</span><span className="block text-gray-400">{translateAuditLabel("modules", log.module)}</span></td>
            <td className="px-4 py-3 text-gray-600">{log.entity_type ? translateAuditLabel("entities", log.entity_type) : "—"}{log.entity_public_id ? ` · ${log.entity_public_id}` : ""}</td>
            <td className="px-4 py-3 font-mono text-gray-400">{log.ip_address ?? "—"}</td>
            <td className="px-4 py-3 text-gray-500 max-w-64 truncate" title={translateDescription(log.description)}>{translateDescription(log.description)}</td>
          </tr>)}
        </tbody></table>
      </div>
      {meta && <div className="flex items-center justify-between text-sm text-gray-500"><span>{t("adminPanel.audit.events", { count: meta.total })}</span><div className="flex items-center gap-2"><button disabled={page <= 1} onClick={() => setPage((current) => current - 1)} aria-label={t("adminPanel.audit.previousPage")} className="p-1 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button><span>{t("adminPanel.audit.pageInfo", { current: meta.current_page, total: meta.last_page })}</span><button disabled={page >= meta.last_page} onClick={() => setPage((current) => current + 1)} aria-label={t("adminPanel.audit.nextPage")} className="p-1 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button></div></div>}
    </div>
  );
};

export default AuditLogTab;

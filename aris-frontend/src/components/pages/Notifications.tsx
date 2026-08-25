import { Bell, AlertTriangle, CheckCircle, ClipboardCheck, Clock, Eye, UserPlus, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Loader from "@/components/atoms/Loader";
import { useMarkAllNotificationsAsRead, useMarkNotificationAsRead, useNotifications, useUnreadNotificationCount } from "@/hooks/useNotifications";
import type { AppNotification } from "@/types/notification.type";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "ACCIDENT_REPORTED": return { icon: AlertTriangle, bg: "bg-orange-100 dark:bg-orange-950/70", color: "text-orange-600 dark:text-orange-300" };
    case "ASSIGNED": return { icon: UserPlus, bg: "bg-blue-100 dark:bg-blue-950/70", color: "text-blue-600 dark:text-blue-300" };
    case "RECOMMENDATION_REQUIRED": return { icon: ClipboardCheck, bg: "bg-blue-100 dark:bg-blue-950/70", color: "text-blue-600 dark:text-blue-300" };
    case "APPROVAL_REQUIRED": return { icon: Clock, bg: "bg-yellow-100 dark:bg-yellow-950/70", color: "text-yellow-600 dark:text-yellow-300" };
    case "APPROVED": return { icon: CheckCircle, bg: "bg-emerald-100 dark:bg-emerald-950/70", color: "text-emerald-600 dark:text-emerald-300" };
    case "WORKFLOW_COMPLETED": return { icon: CheckCircle, bg: "bg-emerald-100 dark:bg-emerald-950/70", color: "text-emerald-600 dark:text-emerald-300" };
    case "REJECTED": return { icon: XCircle, bg: "bg-red-100 dark:bg-red-950/70", color: "text-red-600 dark:text-red-300" };
    case "DOCUMENT_REJECTED": return { icon: XCircle, bg: "bg-red-100 dark:bg-red-950/70", color: "text-red-600 dark:text-red-300" };
    default: return { icon: Bell, bg: "bg-slate-100 dark:bg-slate-800", color: "text-slate-600 dark:text-slate-300" };
  }
};

const formatTime = (value: string, locale: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString(locale === "si" ? "si-LK" : "en-LK");
};

const Notifications = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { data: notificationPage, isLoading, isError } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const notifications = notificationPage?.data ?? [];

  const openNotification = async (notification: AppNotification) => {
    if (!notification.read_at) {
      await markAsRead.mutateAsync(notification.id);
    }

    const destination = notification.data.url ?? notification.action_url;

    if (destination) {
      navigate(destination);
    }
  };

  const getNotificationContent = (notification: AppNotification) => {
    const data = notification.data;
    const type = data.type ?? notification.type;
    const document = [data.document_type, data.reference_number].filter(Boolean).join(" ") || t("notifications.thisDocument");
    const caseNumber = data.case_number ?? t("notifications.thisCase");

    switch (type) {
      case "ACCIDENT_REPORTED":
        return {
          title: t("notifications.messages.accidentReportedTitle"),
          message: t("notifications.messages.accidentReported", {
            caseNumber,
            institutionName: data.institution_name ?? t("notifications.unknownInstitution"),
          }),
        };
      case "APPROVAL_REQUIRED":
        return {
          title: t("notifications.messages.approvalRequiredTitle"),
          message: t("notifications.messages.approvalRequired", { document, caseNumber }),
        };
      case "RECOMMENDATION_REQUIRED":
        return {
          title: t("notifications.messages.recommendationRequiredTitle"),
          message: t("notifications.messages.recommendationRequired", { document, caseNumber }),
        };
      case "DOCUMENT_REJECTED":
        return {
          title: t("notifications.messages.documentRejectedTitle"),
          message: t("notifications.messages.documentRejected", {
            document,
            reason: data.comments ?? t("notifications.noReason"),
          }),
        };
      case "WORKFLOW_COMPLETED":
        return {
          title: t("notifications.messages.workflowCompletedTitle"),
          message: t("notifications.messages.workflowCompleted", { document }),
        };
      case "FR1043_CHANGES_REQUESTED":
        return {
          title: t("notifications.messages.fr1043ChangesRequestedTitle"),
          message: data.comments ?? notification.data.message ?? notification.message ?? t("notifications.fallbackMessage"),
        };
      default:
        return {
          title: data.title ?? notification.title ?? t("notifications.fallbackTitle"),
          message: data.message ?? notification.message ?? t("notifications.fallbackMessage"),
        };
    }
  };

  if (isLoading) return <Loader text={t("notifications.loading")} />;
  if (isError) return <p className="p-6 text-center text-sm text-red-600">{t("notifications.loadError")}</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("notifications.title")}</h1>
          <p className="mt-1 text-slate-500">{t("notifications.subtitle")}</p>
        </div>
        <button type="button" onClick={() => markAllAsRead.mutate()} disabled={unreadCount === 0 || markAllAsRead.isPending} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">
          {markAllAsRead.isPending ? t("notifications.marking") : t("notifications.markAllRead")}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard label={t("notifications.total")} value={notificationPage?.total ?? 0} color="slate" />
        <SummaryCard label={t("notifications.unread")} value={unreadCount} color="blue" />
        <SummaryCard label={t("notifications.read")} value={Math.max((notificationPage?.total ?? 0) - unreadCount, 0)} color="green" />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        {notifications.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-500">{t("notifications.empty")}</p>
        ) : notifications.map((notification) => {
          const config = getNotificationIcon(notification.data.type ?? notification.type);
          const content = getNotificationContent(notification);
          const Icon = config.icon;
          const unread = !notification.read_at;

          return (
            <div key={notification.id} className={`border-b border-slate-100 p-5 transition-colors dark:border-slate-700 ${unread ? "bg-blue-50/40 dark:bg-blue-950/35 dark:hover:bg-blue-950/55" : "bg-white dark:bg-slate-900 dark:hover:bg-slate-800"}`}>
              <div className="flex gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${config.bg}`}><Icon className={`h-6 w-6 ${config.color}`} /></div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div><h3 className="font-semibold text-slate-900 dark:text-slate-100">{content.title}</h3><p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{content.message}</p></div>
                    {unread && <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-blue-600" />}
                  </div>
                  <div className="mt-3 flex items-center justify-between"><span className="text-xs text-slate-400 dark:text-slate-400">{formatTime(notification.created_at, i18n.language)}</span>{(notification.data.url ?? notification.action_url) && <button type="button" onClick={() => openNotification(notification)} disabled={markAsRead.isPending} className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"><Eye className="h-4 w-4" />{t("notifications.view")}</button>}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function SummaryCard({ label, value, color }: { label: string; value: number; color: "slate" | "blue" | "green" }) {
  const colorClasses = { slate: "border-slate-200 text-slate-900", blue: "border-blue-200 text-blue-700", green: "border-green-200 text-green-700" };
  return <div className={`rounded-xl border bg-white p-5 shadow-sm ${colorClasses[color]}`}><p className="text-sm text-slate-500">{label}</p><h2 className="mt-2 text-3xl font-bold">{value}</h2></div>;
}

export default Notifications;

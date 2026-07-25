import { Bell, AlertTriangle, CheckCircle, Clock, Eye, UserPlus, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/atoms/Loader";
import { useMarkAllNotificationsAsRead, useMarkNotificationAsRead, useNotifications, useUnreadNotificationCount } from "@/hooks/useNotifications";
import type { AppNotification } from "@/types/notification.type";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "ACCIDENT_REPORTED": return { icon: AlertTriangle, bg: "bg-orange-100", color: "text-orange-600" };
    case "ASSIGNED": return { icon: UserPlus, bg: "bg-blue-100", color: "text-blue-600" };
    case "APPROVAL_REQUIRED": return { icon: Clock, bg: "bg-yellow-100", color: "text-yellow-600" };
    case "APPROVED": return { icon: CheckCircle, bg: "bg-green-100", color: "text-green-600" };
    case "REJECTED": return { icon: XCircle, bg: "bg-red-100", color: "text-red-600" };
    default: return { icon: Bell, bg: "bg-slate-100", color: "text-slate-600" };
  }
};

const formatTime = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

const Notifications = () => {
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

  if (isLoading) return <Loader text="Loading notifications..." />;
  if (isError) return <p className="p-6 text-center text-sm text-red-600">Unable to load notifications.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="mt-1 text-slate-500">View system alerts and updates</p>
        </div>
        <button type="button" onClick={() => markAllAsRead.mutate()} disabled={unreadCount === 0 || markAllAsRead.isPending} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">
          {markAllAsRead.isPending ? "Marking..." : "Mark all as read"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard label="Total Notifications" value={notificationPage?.total ?? 0} color="slate" />
        <SummaryCard label="Unread" value={unreadCount} color="blue" />
        <SummaryCard label="Read" value={Math.max((notificationPage?.total ?? 0) - unreadCount, 0)} color="green" />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {notifications.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-500">No notifications yet.</p>
        ) : notifications.map((notification) => {
          const config = getNotificationIcon(notification.data.type ?? notification.type);
          const Icon = config.icon;
          const unread = !notification.read_at;

          return (
            <div key={notification.id} className={`border-b border-slate-100 p-5 transition-colors hover:bg-slate-50 ${unread ? "bg-blue-50/40" : ""}`}>
              <div className="flex gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${config.bg}`}><Icon className={`h-6 w-6 ${config.color}`} /></div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div><h3 className="font-semibold text-slate-900">{notification.data.title ?? notification.title ?? "Notification"}</h3><p className="mt-1 text-sm text-slate-600">{notification.data.message ?? notification.message ?? "You have a new notification."}</p></div>
                    {unread && <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-blue-600" />}
                  </div>
                  <div className="mt-3 flex items-center justify-between"><span className="text-xs text-slate-400">{formatTime(notification.created_at)}</span>{(notification.data.url ?? notification.action_url) && <button type="button" onClick={() => openNotification(notification)} disabled={markAsRead.isPending} className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"><Eye className="h-4 w-4" />View</button>}</div>
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

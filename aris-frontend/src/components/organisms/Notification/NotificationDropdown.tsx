import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationItem from "./NotificationItem";
import { useNotifications, useUnreadNotificationCount } from "@/hooks/useNotifications";
import type { AppNotification } from "@/types/notification.type";
import { disableWebPush, enableWebPush, isWebPushEnabled, supportsWebPush } from "@/services/webPush.service";

const formatTime = (value: string) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const { data: notificationPage, isLoading } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const [desktopPermission, setDesktopPermission] = useState<NotificationPermission | "unsupported">(
    () => ("Notification" in window ? window.Notification.permission : "unsupported"),
  );
  const [webPushEnabled, setWebPushEnabled] = useState(false);
  const [webPushBusy, setWebPushBusy] = useState(false);
  const [webPushError, setWebPushError] = useState<string | null>(null);
  const notifications = notificationPage?.data.slice(0, 5) ?? [];

  const openNotification = (notification: AppNotification) => {
    navigate(notification.data.url ?? notification.action_url ?? "/notifications");
  };

  const enableDesktopNotifications = async () => {
    if (!("Notification" in window)) return;

    setDesktopPermission(await window.Notification.requestPermission());
  };

  const enableBackgroundAlerts = async () => {
    setWebPushBusy(true);
    setWebPushError(null);

    try {
      await enableWebPush();
      setDesktopPermission("granted");
      setWebPushEnabled(true);
    } catch (error) {
      setWebPushError(error instanceof Error ? error.message : "Unable to enable background alerts.");
    } finally {
      setWebPushBusy(false);
    }
  };

  const disableBackgroundAlerts = async () => {
    setWebPushBusy(true);
    setWebPushError(null);

    try {
      await disableWebPush();
      setWebPushEnabled(false);
    } catch {
      setWebPushError("Unable to disable background alerts. Please try again.");
    } finally {
      setWebPushBusy(false);
    }
  };

  useEffect(() => {
    void isWebPushEnabled().then(setWebPushEnabled).catch(() => undefined);
  }, []);

  return (
    <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold">Notifications</h3>
          <p className="text-xs text-muted-foreground">{unreadCount} unread notifications</p>
        </div>
        {unreadCount > 0 && <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">{unreadCount} New</span>}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {isLoading ? <p className="px-4 py-6 text-center text-sm text-muted-foreground">Loading notifications...</p> :
          notifications.length === 0 ? <p className="px-4 py-6 text-center text-sm text-muted-foreground">No notifications yet.</p> :
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                title={notification.data.title ?? notification.title ?? "Notification"}
                description={notification.data.message ?? notification.message ?? "You have a new notification."}
                time={formatTime(notification.created_at)}
                color={!notification.read_at ? "bg-blue-500" : "bg-slate-300"}
                unread={!notification.read_at}
                onClick={() => openNotification(notification)}
              />
            ))}
      </div>

      <div className="border-t border-border p-2">
        <button className="w-full rounded-lg py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50" onClick={() => navigate("/notifications")}>View All Notifications</button>
        {desktopPermission === "default" && <button className="w-full rounded-lg py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50" onClick={enableDesktopNotifications}>Enable in-app alerts</button>}
        {supportsWebPush() && desktopPermission !== "denied" && (
          <button className="w-full rounded-lg py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-60" disabled={webPushBusy} onClick={webPushEnabled ? disableBackgroundAlerts : enableBackgroundAlerts}>
            {webPushBusy ? "Saving..." : webPushEnabled ? "Disable background alerts" : "Enable background alerts"}
          </button>
        )}
        {desktopPermission === "denied" && <p className="px-2 py-1 text-center text-xs text-slate-500">Desktop alerts are blocked in browser settings.</p>}
        {webPushError && <p className="px-2 py-1 text-center text-xs text-red-600">{webPushError}</p>}
      </div>
    </div>
  );
};

export default NotificationDropdown;

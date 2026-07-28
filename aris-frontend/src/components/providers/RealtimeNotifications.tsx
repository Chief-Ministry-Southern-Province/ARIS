import { useEffect } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/auth/AuthContext";
import api from "@/services/api";
import { queryKeys } from "@/hooks/queryKeys";

type NotificationBroadcast = {
  id: string | number;
  title?: string;
  message?: string;
  action_url?: string | null;
  data?: {
    title?: string;
    message?: string;
    url?: string;
  };
};

const numberEnv = (value: string | undefined, fallback: number) =>
  Number(value ?? fallback);

const showDesktopNotification = (notification: NotificationBroadcast) => {
  if (
    !document.hidden ||
    !("Notification" in window) ||
    window.Notification.permission !== "granted"
  ) {
    return;
  }

  const url = notification.data?.url ?? notification.action_url ?? "/notifications";
  const desktopNotification = new window.Notification(
    notification.data?.title ?? notification.title ?? "ARIS notification",
    {
      body: notification.data?.message ?? notification.message ?? "You have a new notification.",
      icon: "/pwa-192x192-icon.png",
      badge: "/pwa-192x192-icon.png",
      tag: `aris-notification-${notification.id}`,
    },
  );

  desktopNotification.onclick = () => {
    window.focus();
    window.location.assign(url);
    desktopNotification.close();
  };
};

/** Keeps notification queries current when Reverb publishes to the signed-in user. */
const RealtimeNotifications = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const userId = localStorage.getItem("id");

  useEffect(() => {
    if (!token || !userId || !import.meta.env.VITE_REVERB_APP_KEY) {
      return;
    }

    const scheme = import.meta.env.VITE_REVERB_SCHEME ?? "http";
    const echo = new Echo({
      broadcaster: "reverb",
      Pusher,
      key: import.meta.env.VITE_REVERB_APP_KEY,
      wsHost: import.meta.env.VITE_REVERB_HOST ?? window.location.hostname,
      wsPort: numberEnv(import.meta.env.VITE_REVERB_PORT, 8080),
      wssPort: numberEnv(import.meta.env.VITE_REVERB_PORT, 443),
      forceTLS: scheme === "https",
      enabledTransports: ["ws", "wss"],
      authorizer: (channel) => ({
        authorize: (socketId, callback) => {
          api.post("/broadcasting/auth", {
            socket_id: socketId,
            channel_name: channel.name,
          })
            .then(({ data }) => callback(null, data))
            .catch((error: unknown) => callback(error as Error, null));
        },
      }),
    });

    echo.private(`users.${userId}`).listen(".notification.created", (notification: NotificationBroadcast) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      showDesktopNotification(notification);
    });

    return () => {
      echo.leave(`users.${userId}`);
      echo.disconnect();
    };
  }, [queryClient, token, userId]);

  return null;
};

export default RealtimeNotifications;

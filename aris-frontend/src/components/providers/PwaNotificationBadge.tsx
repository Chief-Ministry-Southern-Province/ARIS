import { useEffect } from "react";
import { useUnreadNotificationCount } from "@/hooks/useNotifications";

type BadgingNavigator = Navigator & {
  setAppBadge?: (contents?: number) => Promise<void>;
  clearAppBadge?: () => Promise<void>;
};

/** Mirrors the unread count on supported installed-PWA application icons. */
const PwaNotificationBadge = () => {
  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  useEffect(() => {
    const badgingNavigator = navigator as BadgingNavigator;

    if (unreadCount > 0 && badgingNavigator.setAppBadge) {
      void badgingNavigator.setAppBadge(unreadCount).catch(() => undefined);
      return;
    }

    if (unreadCount === 0 && badgingNavigator.clearAppBadge) {
      void badgingNavigator.clearAppBadge().catch(() => undefined);
    }
  }, [unreadCount]);

  return null;
};

export default PwaNotificationBadge;

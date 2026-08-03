import { useEffect } from "react";
import { useUnreadNotificationCount } from "@/hooks/useNotifications";

type BadgingNavigator = Navigator & {
  setAppBadge?: (contents?: number) => Promise<void>;
  clearAppBadge?: () => Promise<void>;
};

const FAVICON_PATH = "/pwa-192x192-icon.png";

const updateFavicon = (href: string) => {
  let icon = document.querySelector<HTMLLinkElement>("link[rel~='icon']");

  if (!icon) {
    icon = document.createElement("link");
    icon.rel = "icon";
    document.head.appendChild(icon);
  }

  icon.type = "image/png";
  icon.href = href;
};

const createBadgedFavicon = (unreadCount: number): Promise<string> =>
  new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth || 192;
      canvas.height = image.naturalHeight || 192;

      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Canvas is unavailable."));
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const badgeRadius = Math.round(canvas.width * 0.24);
      const badgeX = canvas.width - badgeRadius;
      const badgeY = badgeRadius;
      const label = unreadCount > 99 ? "99+" : String(unreadCount);

      context.fillStyle = "#dc2626";
      context.beginPath();
      context.arc(badgeX, badgeY, badgeRadius, 0, Math.PI * 2);
      context.fill();

      context.strokeStyle = "#ffffff";
      context.lineWidth = Math.max(2, Math.round(canvas.width * 0.018));
      context.stroke();

      context.fillStyle = "#ffffff";
      context.font = `700 ${Math.round(canvas.width * (label.length > 2 ? 0.17 : 0.22))}px sans-serif`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(label, badgeX, badgeY + 1);

      resolve(canvas.toDataURL("image/png"));
    };

    image.onerror = () => reject(new Error("Unable to load the PWA icon."));
    image.src = FAVICON_PATH;
  });

/** Mirrors unread notifications on installed-PWA icons and browser-tab favicons. */
const PwaNotificationBadge = () => {
  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  useEffect(() => {
    const badgingNavigator = navigator as BadgingNavigator;
    const supportsAppBadge = Boolean(badgingNavigator.setAppBadge);

    if (unreadCount === 0) {
      updateFavicon(FAVICON_PATH);

      if (!badgingNavigator.clearAppBadge) {
        return;
      }

      void badgingNavigator.clearAppBadge().catch(() => undefined);
      return;
    }

    if (supportsAppBadge) {
      void badgingNavigator.setAppBadge(unreadCount).catch(() => undefined);
    }

    let active = true;

    void createBadgedFavicon(unreadCount)
      .then((favicon) => {
        if (active) updateFavicon(favicon);
      })
      .catch(() => updateFavicon(FAVICON_PATH));

    return () => {
      active = false;
    };
  }, [unreadCount]);

  return null;
};

export default PwaNotificationBadge;

import { useState, useEffect, useRef } from "react";
import {
  Bell,
  Home,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { LanguageSwitcher } from "@/components/molecules/LanguageSwitcher";
import { navItems } from "@/components/data/navigation";
import NotificationDropdown from "@/components/organisms/Notification/NotificationDropdown";
import UserMenu from "@/components/organisms/TopNavbar/UserMenu";
import { useUnreadNotificationCount } from "@/hooks/useNotifications";

interface TopNavbarProps {
  userName: string;
  userRole: string;
  userAvatar: string;
  onMenuClick: () => void;
}

export function TopNavbar({
  userName,
  userRole,
  userAvatar,
  onMenuClick,
}: TopNavbarProps) {
  const { t } = useTranslation();

  const [notifOpen, setNotifOpen] =
    useState(false);

  const location = useLocation();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  const notificationRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target as Node
        )
      ) {
        setNotifOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const currentPage = navItems
    .filter((item) =>
      location.pathname.startsWith(item.path)
    )
    .sort(
      (a, b) =>
        b.path.length - a.path.length
    )[0];

  return (
    <header className="bg-card border-b border-border shadow-sm z-20 overflow-visible">
      {/* Top Row */}
      <div className="flex items-center justify-between px-3 sm:px-5 min-h-14 py-2">
        {/* Left Side */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden h-9 w-9 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <h2 className="text-sm font-bold text-foreground truncate">
              {t("app.title")}
            </h2>

            <p className="hidden sm:block text-xs text-muted-foreground truncate">
              {t("app.subtitle")}
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-1 sm:gap-3">
          <LanguageSwitcher />

          {/* Notifications */}
          <div
            ref={notificationRef}
            className="relative z-50"
          >
            <button
              onClick={() =>
                setNotifOpen((prev) => !prev)
              }
              className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors"
            >
              <Bell size={18} />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-destructive px-1 text-center text-[10px] font-semibold leading-5 text-destructive-foreground">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <NotificationDropdown />
            )}
          </div>

          {/* User Info */}
          <UserMenu 
            userName={userName}
            userRole={userRole}
            userAvatar={userAvatar}
          />
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 px-3 sm:px-5 py-2 bg-secondary border-t border-border overflow-x-auto">
        <Home
          size={14}
          className="text-muted-foreground shrink-0"
        />

        <ChevronRight
          size={14}
          className="text-muted-foreground shrink-0"
        />

        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {currentPage?.label
            ? t(currentPage.label)
            : t("nav.dashboard")}
        </span>
      </div>
    </header>
  );
}

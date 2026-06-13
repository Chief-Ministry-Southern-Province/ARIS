import { useState } from "react";
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

  const currentPage = navItems
    .filter((item) =>
      location.pathname.startsWith(item.path)
    )
    .sort(
      (a, b) =>
        b.path.length - a.path.length
    )[0];

  return (
    <header className="bg-card border-b border-border shadow-sm z-20 overflow-hidden">
      {/* Top Row */}

      <div className="flex items-center justify-between px-3 sm:px-5 min-h-14 py-2">
        {/* Left Side */}

        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Menu Button */}

          <button
            onClick={onMenuClick}
            className="lg:hidden h-9 w-9 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors"
          >
            <Menu size={20} />
          </button>

          {/* Title */}

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
          {/* Language Switcher */}

          <LanguageSwitcher />

          {/* Notifications */}

          <div className="relative">
            <button
              onClick={() =>
                setNotifOpen(!notifOpen)
              }
              className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors"
            >
              <Bell size={18} />

              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive" />
            </button>

            {/* Notification Dropdown */}

            {/* {notifOpen && (
              <div className="absolute right-0 top-12 w-72 sm:w-80 bg-card border border-border rounded-xl shadow-xl z-50">
                <div className="flex justify-between items-center p-4 border-b border-border">
                  <span className="font-semibold text-sm">
                    {t(
                      "notifications.title",
                      "Notifications"
                    )}
                  </span>

                  <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-600">
                    3 New
                  </span>
                </div>

                <div className="p-2">
                  <div className="p-3 rounded-lg bg-red-50 mb-2">
                    <p className="text-xs">
                      New accident case
                      requires attention
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-yellow-50">
                    <p className="text-xs">
                      FR104(3) approval pending
                    </p>
                  </div>
                </div>
              </div>
            )} */}
          </div>

          {/* User Info */}

          <div className="flex items-center gap-2 border-l border-border pl-2 sm:pl-3">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs sm:text-sm">
              {userAvatar}
            </div>

            <div className="hidden md:block">
              <p className="text-xs font-semibold">
                {userName}
              </p>

              <p className="text-xs text-muted-foreground">
                {userRole}
              </p>
            </div>
          </div>
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
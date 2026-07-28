import {
  Bell,
  User,
  LogOut,
  Menu,
  Sun,
  Moon,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useTheme } from "../../hooks/useTheme";
import { useUnreadNotificationCount } from "@/hooks/useNotifications";

interface TopNavProps {
  onMenuClick: () => void;
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { data: unreadNotificationCount = 0 } = useUnreadNotificationCount();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <header className="h-16 bg-card border-b border-border shadow-sm flex items-center justify-between px-4 md:px-6">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="Open Menu"
        >
          <Menu className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="hidden sm:block">
          <h2 className="font-semibold text-foreground text-sm md:text-base">
            Accident Reporting & Investigation System
          </h2>
          <p className="hidden md:block text-xs md:text-sm text-muted-foreground">
            Provincial Department of Health Services - Southern Province
          </p>
        </div>

        <div className="sm:hidden">
          <h2 className="font-semibold text-foreground text-sm">
            ARIS
          </h2>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          title={
            theme === "dark"
              ? "Switch to Light Mode"
              : "Switch to Dark Mode"
          }
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Moon className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate("/notifications")}
          className="relative p-2 rounded-lg hover:bg-muted transition-colors"
          title="Notifications"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unreadNotificationCount > 0 && (
            <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-destructive px-1 text-center text-[10px] font-semibold leading-5 text-destructive-foreground">
              {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
            </span>
          )}
        </button>

        {/* User Section */}
        <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-border">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-foreground">
              Admin User
            </p>
            <p className="text-xs text-muted-foreground">
              System Administrator
            </p>
          </div>

          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-sm">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}

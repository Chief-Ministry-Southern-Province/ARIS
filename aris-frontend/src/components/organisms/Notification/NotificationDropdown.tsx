import NotificationItem from "./NotificationItem";
import { notifications } from "../../data/mockData";
import { useNavigate } from "react-router-dom";

const NotificationDropdown = () => {
  const unreadCount = notifications.length;
  const navigate = useNavigate();

  return (
    <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <h3 className="font-semibold text-sm">
            Notifications
          </h3>

          <p className="text-xs text-muted-foreground">
            {unreadCount} unread notifications
          </p>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
          {unreadCount} New
        </span>
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            {...notification}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-border p-2">
        <button
          className="
            w-full
            py-2
            text-sm
            font-medium
            rounded-lg
            text-blue-600
            hover:bg-blue-50
            transition-colors
            "

          onClick={() => navigate("/notifications")}
        >
          View All Notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
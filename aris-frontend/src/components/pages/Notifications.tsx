import {Bell,AlertTriangle,CheckCircle,XCircle,UserPlus,Clock,Eye,} from "lucide-react";
import { useNavigate } from "react-router-dom";

const notifications = [
  {
    id: 1,
    case_id: "ARIS-2025-001",
    type: "new_case",
    title: "New accident case reported",
    description: "Case ARIS-2025-001 has been submitted.",
    time: "5 minutes ago",
    unread: true,
  },
  {
    id: 2,
    case_id: "ARIS-2025-002",
    type: "assigned",
    title: "Investigator assigned",
    description: "You have been assigned to Case ARIS-2025-002.",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    case_id: "ARIS-2025-003",
    type: "approval",
    title: "Approval request received",
    description: "Case ARIS-2025-003 is awaiting your approval.",
    time: "3 hours ago",
    unread: false,
  },
  {
    id: 4,
    case_id: "ARIS-2025-004",
    type: "approved",
    title: "Case approved",
    description: "Case ARIS-2025-004 has been approved.",
    time: "Yesterday",
    unread: false,
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "new_case":
      return {
        icon: AlertTriangle,
        bg: "bg-orange-100",
        color: "text-orange-600",
      };

    case "assigned":
      return {
        icon: UserPlus,
        bg: "bg-blue-100",
        color: "text-blue-600",
      };

    case "approval":
      return {
        icon: Clock,
        bg: "bg-yellow-100",
        color: "text-yellow-600",
      };

    case "approved":
      return {
        icon: CheckCircle,
        bg: "bg-green-100",
        color: "text-green-600",
      };

    case "rejected":
      return {
        icon: XCircle,
        bg: "bg-red-100",
        color: "text-red-600",
      };

    default:
      return {
        icon: Bell,
        bg: "bg-slate-100",
        color: "text-slate-600",
      };
  }
};

const Notifications = () => {

  const navigate = useNavigate();

  const unreadCount = notifications.filter(
    (n) => n.unread
  ).length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Notifications
          </h1>

          <p className="text-slate-500 mt-1">
            View system alerts and updates
          </p>
        </div>

        <button
          className="
            px-4 py-2
            rounded-lg
            border border-slate-200
            bg-white
            hover:bg-slate-50
            text-sm
            font-medium
            text-blue-600
            hover:opacity-90
            transition-all
            cursor-pointer
          "
        >
          Mark All as Read
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Notifications
          </p>

          <h2 className="text-3xl font-bold text-slate-900 mt-2">
            {notifications.length}
          </h2>
        </div>

        <div className="bg-white border border-blue-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-blue-600">
            Unread
          </p>

          <h2 className="text-3xl font-bold text-blue-700 mt-2">
            {unreadCount}
          </h2>
        </div>

        <div className="bg-white border border-green-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-green-600">
            Read
          </p>

          <h2 className="text-3xl font-bold text-green-700 mt-2">
            {notifications.length - unreadCount}
          </h2>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {notifications.map((notification) => {
          const config = getNotificationIcon(
            notification.type
          );

          const Icon = config.icon;

          return (
            <div
              key={notification.id}
              className={`
                p-5
                border-b border-slate-100
                hover:bg-slate-50
                transition-colors
                ${
                  notification.unread
                    ? "bg-blue-50/40"
                    : ""
                }
              `}
            >
              <div className="flex gap-4">
                <div
                  className={`
                    w-12 h-12
                    rounded-xl
                    flex items-center justify-center
                    ${config.bg}
                  `}
                >
                  <Icon
                    className={`w-6 h-6 ${config.color}`}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {notification.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-600">
                        {notification.description}
                      </p>
                    </div>

                    {notification.unread && (
                      <span className="w-3 h-3 rounded-full bg-blue-600" />
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-slate-400">
                      {notification.time}
                    </span>

                    <button
                      className="
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        text-blue-600
                        hover:text-blue-700
                        font-medium
                      "
                      onClick={() => navigate(`/cases/${notification.case_id}/details`)}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notifications;
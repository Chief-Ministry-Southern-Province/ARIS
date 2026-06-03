import { Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  AlertTriangle,
  FileText,
  Search,
  CheckCircle,
  GitBranch,
  BarChart3,
  Users,
  FileSearch,
  X,
} from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/accidents", label: "Accidents", icon: AlertTriangle },
  { path: "/investigations", label: "Investigations", icon: Search },
  { path: "/approvals", label: "Approvals", icon: CheckCircle },
  { path: "/workflow", label: "Workflow", icon: GitBranch },
  { path: "/reports", label: "Reports", icon: BarChart3 },
  { path: "/users", label: "Users", icon: Users },
  { path: "/audit", label: "Audit Trail", icon: FileSearch },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-64 flex flex-col
          bg-sidebar text-sidebar-foreground
          border-r border-sidebar-border
          transform transition-transform duration-300 ease-in-out
          lg:static
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="border-b border-sidebar-border p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sidebar-primary shadow-sm">
                <FileText className="h-6 w-6 text-sidebar-primary-foreground" />
              </div>

              <div>
                <h1 className="text-lg font-semibold tracking-tight">
                  ARIS
                </h1>
                <p className="text-xs text-sidebar-foreground/70">
                  Southern Province
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-2 transition-colors hover:bg-sidebar-accent lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => onClose()}
                    className={`
                      flex items-center gap-3 rounded-xl px-4 py-3
                      text-sm font-medium transition-all duration-200
                      ${
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }
                    `}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="text-xs text-sidebar-foreground/50">
            <p>Version 1.0.0</p>
            <p>© 2026 SPDHD</p>
          </div>
        </div>
      </aside>
    </>
  );
}
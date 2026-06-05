import { Shield } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { navItems } from "../../data/navigation";

export function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside
      className="
        w-64
        bg-sidebar
        text-sidebar-foreground
        border-r
        border-sidebar-border
        flex
        flex-col
      "
    >
      {/* Logo */}
      <div
        className="
          h-16
          border-b
          border-sidebar-border
          flex
          items-center
          px-4
        "
      >
        <Shield
          className="
            text-sidebar-primary
          "
        />

        <span
          className="
            ml-3
            font-bold
            text-lg
          "
        >
          ARIS
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-lg
              transition-all
              
              ${
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }
            `
            }
          >
            <item.icon size={18} />

            <span>{t(item.label)}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
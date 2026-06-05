import { Bell } from "lucide-react";
import { LanguageSwitcher } from "../../molecules/LanguageSwitcher";

interface TopNavbarProps {
  userName: string;
}

export function TopNavbar({
  userName,
}: TopNavbarProps) {
  return (
    <header
      className="
        bg-card
        border-b
        border-border
        h-16
        px-6
        flex
        items-center
        justify-between
      "
    >
      {/* Title */}

      <div>
        <h1 className="text-lg font-semibold">
          ARIS Dashboard
        </h1>
      </div>

      {/* Right Side */}

      <div
        className="
          flex
          items-center
          gap-4
        "
      >
        <LanguageSwitcher />

        {/* Notifications */}

        <button
          className="
            h-10
            w-10
            rounded-lg
            hover:bg-secondary
            flex
            items-center
            justify-center
          "
        >
          <Bell size={18} />
        </button>

        {/* User */}

        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <div
            className="
              h-9
              w-9
              rounded-full
              bg-primary
              text-primary-foreground
              flex
              items-center
              justify-center
              font-semibold
            "
          >
            {userName.charAt(0)}
          </div>

          <span
            className="
              text-sm
              font-medium
            "
          >
            {userName}
          </span>
        </div>
      </div>
    </header>
  );
}
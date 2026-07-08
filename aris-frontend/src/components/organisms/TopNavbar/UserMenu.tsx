import { useEffect, useRef, useState } from "react";
import { ChevronDown, KeyRound, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "@/hooks/useAuth";

interface UserMenuProps {
  userName: string;
  userRole: string;
  userAvatar: string;
}

export default function UserMenu({
  userName,
  userRole,
  userAvatar,
}: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const { logoutUser } = useLogout();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <div
      ref={menuRef}
      className="relative flex items-center"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 border-l border-border pl-2 sm:pl-3 hover:bg-muted/50 rounded-lg py-1 transition-colors"
      >
        <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs sm:text-sm">
          {userAvatar}
        </div>

        <div className="hidden md:block text-left">
          <p className="text-xs font-semibold">
            {userName}
          </p>

          <p className="text-xs text-muted-foreground">
            {userRole}
          </p>
        </div>

        <ChevronDown
          size={16}
          className={`transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-background shadow-lg z-50 overflow-hidden">
          <button
            onClick={() => {
              navigate("/profile");
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-blue-100 dark:hover:bg-blue-950/20 transition-colors cursor-pointer"
          >
            <User size={18} />
            My Profile
          </button>

          <button
            onClick={() => {
              navigate("/change-password");
              setOpen(false);
            }}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-blue-100 dark:hover:bg-blue-950/20 transition-colors cursor-pointer"
          >
            <KeyRound size={18} />
            Change Password
          </button>

          <div className="border-t border-border" />

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
import { Outlet } from "react-router-dom";
import { useState } from "react";

import { Sidebar } from "@/components/organisms/Sidebar/Sidebar";
import { TopNavbar } from "@/components/organisms/TopNavbar/TopNavbar";
import { useAuth } from "@/context/auth/AuthContext";
import {getUserRole} from "@/utils/getUserRole";

export default function RootLayout() {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { role, name } = useAuth();
  const userName = name || "User";
  const userAvatar = userName.charAt(0).toUpperCase();

  return (
    <div
      className="flex h-screen overflow-hidden bg-background text-foreground"
    >
      <Sidebar
        mobileOpen={sidebarOpen}
        setMobileOpen={setSidebarOpen}
      />

      <div
        className=" flex-1 flex flex-col min-w-0
        "
      >
        <TopNavbar
          userName={userName}
          userRole={getUserRole(role[0] || "")}
          userAvatar={userAvatar}
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <main
          className=" flex-1 overflow-auto p-4 md:p-6
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

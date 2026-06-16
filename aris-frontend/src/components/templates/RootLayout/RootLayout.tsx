import { Outlet } from "react-router-dom";
import { useState } from "react";

import { Sidebar } from "@/components/organisms/Sidebar/Sidebar";
import { TopNavbar } from "@/components/organisms/TopNavbar/TopNavbar";

export default function RootLayout() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className="flex h-screen overflow-hidden bg-background"
      style={{ background: "#F0F3F7" }}
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
          userName="Admin User"
          userRole="System Administrator"
          userAvatar="A"
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
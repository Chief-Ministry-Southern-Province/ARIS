import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/organisms/Sidebar/Sidebar";
import { TopNavbar } from "@/components/organisms/TopNavbar/TopNavbar";

export default function DashboardLayout() {
  return (
    <div className="bg-background min-h-screen flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TopNavbar userName="Admin User" />

        <main className="flex-1 p-6 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
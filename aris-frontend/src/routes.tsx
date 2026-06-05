import { createBrowserRouter } from "react-router-dom";

import DashboardLayout from "@/components/templates/DashboardLayout/DashboardLayout";

import Home from "@/components/pages/Home";
import Login from "@/components/pages/Login";
import ReportPage from "@/components/pages/ReportPage";
import InvestigationPage from "@/components/pages/InvestigationPage";
import EvidencePage from "@/components/pages/EvidencePage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },

      {
        path: "report",
        element: <ReportPage />,
      },

      {
        path: "investigation",
        element: <InvestigationPage />,
      },

      {
        path: "evidence",
        element: <EvidencePage />,
      },
    ],
  },
]);
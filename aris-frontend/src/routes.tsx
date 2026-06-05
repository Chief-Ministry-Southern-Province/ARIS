import { createBrowserRouter } from "react-router-dom";

import RootLayout from "@/components/templates/RootLayout/RootLayout";

import Login from "@/components/pages/Login";
import ReportPage from "@/components/pages/ReportPage";
import InvestigationPage from "@/components/pages/InvestigationPage";
import EvidencePage from "@/components/pages/EvidencePage";
import DashboardPage from "@/components/pages/DashboardPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
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
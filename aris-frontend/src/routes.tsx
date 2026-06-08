import { createBrowserRouter } from "react-router-dom";

import RootLayout from "@/components/templates/RootLayout/RootLayout";

import Login from "@/components/pages/Login";
import ReportPage from "@/components/pages/ReportPage";
import InvestigationPage from "@/components/pages/InvestigationPage";
import EvidencePage from "@/components/pages/EvidencePage";
import { CaseManagement } from "@/components/pages/CaseManagement";
import DashboardPage from "@/components/pages/DashboardPage";

// New pages
import FR104_3Form from "./components/pages/forms/FR104_3Form";
// import FR104_4GeneratePage from "@/components/pages/FR104_4GeneratePage";
// import FR109GeneratePage from "@/components/pages/FR109GeneratePage";

// import FR104_3ViewPage from "@/components/pages/FR104_3ViewPage";
// import FR104_4ViewPage from "@/components/pages/FR104_4ViewPage";
// import FR109ViewPage from "@/components/pages/FR109ViewPage";

// import AssignInvestigatorPage from "@/components/pages/AssignInvestigatorPage";
// import ForwardApprovalPage from "@/components/pages/ForwardApprovalPage";

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

      {
        path: "cases",
        element: <CaseManagement  />,
      },

      // View Evidence
      {
        path: "cases/:caseId/evidence",
        element: <EvidencePage />,
      },

      // Generate Forms
      {
        path: "cases/:caseId/fr104-3/generate",
        element: <FR104_3Form />,
      },

      // {
      //   path: "cases/:caseId/fr104-4/generate",
      //   element: <FR104_4GeneratePage />,
      // },

      // {
      //   path: "cases/:caseId/fr109/generate",
      //   element: <FR109GeneratePage />,
      // },

      // // View Forms
      // {
      //   path: "cases/:caseId/fr104-3/view",
      //   element: <FR104_3ViewPage />,
      // },

      // {
      //   path: "cases/:caseId/fr104-4/view",
      //   element: <FR104_4ViewPage />,
      // },

      // {
      //   path: "cases/:caseId/fr109/view",
      //   element: <FR109ViewPage />,
      // },

      // // Workflow
      // {
      //   path: "cases/:caseId/assign-investigator",
      //   element: <AssignInvestigatorPage />,
      // },

      // {
      //   path: "cases/:caseId/forward-approval",
      //   element: <ForwardApprovalPage />,
      // },
    ],
  },
]);
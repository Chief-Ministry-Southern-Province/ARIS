/* eslint-disable react-refresh/only-export-components */

import { createBrowserRouter } from "react-router-dom";

import RootLayout from "@/components/templates/RootLayout/RootLayout";

import Login from "@/components/pages/auth/Login";
import ForgotPassword from "@/components/pages/auth/ForgotPassword";
import ChangePassword from "@/components/pages/auth/ChangePassword";
import MyProfile from "@/components/pages/auth/MyProfile";

import DashboardPage from "@/components/pages/DashboardPage";
import ReportPage from "@/components/pages/ReportPage";
import InvestigationPage from "@/components/pages/InvestigationPage";
import EvidencePage from "@/components/pages/EvidencePage";
import { CaseManagement } from "@/components/pages/CaseManagement";
import AdminPanel from "@/components/pages/AdminPanel";
import Notifications from "@/components/pages/Notifications";
import DigitalSignatures from "@/components/pages/DigitalSignatures";
import ApprovalWorkflow from "@/components/pages/ApprovalWorkflow";
import CaseDetails from "@/components/pages/CaseDetails";
import VehicleDetails from "@/components/pages/VehicleDetails";

import FR104_3Form from "./components/pages/forms/FR103_3/FR104_3Form";
import FR104_4Form from "./components/pages/forms/FR104_4/FR104_4Form";

import { lazy, Suspense } from "react";
import LazyChart from "@/utils/LazyChart";
import { AnalyticsSkeleton } from "@/components/pages/Analytics";

const Analytics = lazy(() => import("@/components/pages/Analytics"));

export const router = createBrowserRouter([
  
  {
    path: "/",
    element: <Login />,
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },

  {
    path: "/dashboard",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
    ],
  },

  {
    path: "/report",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <ReportPage />,
      },
    ],
  },

  {
    path: "/investigation",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <InvestigationPage />,
      },
    ],
  },

  {
    path: "/evidence",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <EvidencePage />,
      },
    ],
  },

  {
    path: "/admin",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <AdminPanel />,
      },
    ],
  },

  {
    path: "/cases",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <CaseManagement />,
      },
    ],
  },

  {
    path: "/cases/:caseId/evidence",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <EvidencePage />,
      },
    ],
  },

  {
    path: "/cases/:caseId/details",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <CaseDetails />,
      },
    ],
  },

  {
    path: "/cases/:caseId/fr104-3/generate",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <FR104_3Form />,
      },
    ],
  },

  {
    path: "/cases/:caseId/fr104-4/generate",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <FR104_4Form />,
      },
    ],
  },

  {
    path: "/cases/:caseId/approval-workflow",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <ApprovalWorkflow />,
      },
    ],
  },

  {
    path: "/notifications",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Notifications />,
      },
    ],
  },

  {
    path: "/profile",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <MyProfile />,
      },
    ],
  },

  {
    path: "/change-password",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <ChangePassword />,
      },
    ],
  },

  {
    path: "/signatures",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <DigitalSignatures />,
      },
    ],
  },
  {
    path: "/vehicles/:vehicleId/details",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <VehicleDetails />,
      },
    ],
  },

  {
    path: "/analytics",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<AnalyticsSkeleton />}>
            <LazyChart>
              <Analytics />
            </LazyChart>
          </Suspense>
        ),
      },
    ],
  },
]);
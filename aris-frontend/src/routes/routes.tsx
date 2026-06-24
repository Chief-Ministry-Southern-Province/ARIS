/* eslint-disable react-refresh/only-export-components */

import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

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

import FR104_3Form from "@/components/pages/forms/FR103_3/FR104_3Form";
import FR104_4Form from "@/components/pages/forms/FR104_4/FR104_4Form";

import LazyChart from "@/utils/LazyChart";
import { AnalyticsSkeleton } from "@/components/pages/Analytics";

import ProtectedRoute from "@/routes/ProtectedRoute";

const Analytics = lazy(() => import("@/components/pages/Analytics"));

export const router = createBrowserRouter([
  // Public Routes
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

  // Protected Routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RootLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },

          {
            path: "/report",
            element: <ReportPage />,
          },

          {
            path: "/investigation",
            element: <InvestigationPage />,
          },

          {
            path: "/evidence",
            element: <EvidencePage />,
          },

          {
            path: "/admin",
            element: <AdminPanel />,
          },

          {
            path: "/cases",
            element: <CaseManagement />,
          },

          {
            path: "/cases/:caseId/evidence",
            element: <EvidencePage />,
          },

          {
            path: "/cases/:caseId/details",
            element: <CaseDetails />,
          },

          {
            path: "/cases/:caseId/fr104-3/generate",
            element: <FR104_3Form />,
          },

          {
            path: "/cases/:caseId/fr104-4/generate",
            element: <FR104_4Form />,
          },

          {
            path: "/cases/:caseId/approval-workflow",
            element: <ApprovalWorkflow />,
          },

          {
            path: "/notifications",
            element: <Notifications />,
          },

          {
            path: "/profile",
            element: <MyProfile />,
          },

          {
            path: "/change-password",
            element: <ChangePassword />,
          },

          {
            path: "/signatures",
            element: <DigitalSignatures />,
          },

          {
            path: "/vehicles/:vehicleId/details",
            element: <VehicleDetails />,
          },

          {
            path: "/analytics",
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
    ],
  },
]);
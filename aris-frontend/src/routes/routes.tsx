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

import UnauthorizedPage from "@/components/pages/UnauthorizedPage";

import LazyChart from "@/utils/LazyChart";
import { AnalyticsSkeleton } from "@/components/pages/Analytics";

import {protectedPage} from "@/routes/protectedPage";
import {FULL_ACCESS_ROLES, REPORT_ROLES, NOTIFICATION_ROLES} from "@/components/data/navigation";

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
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },

  {
    element: <RootLayout />,
    children: [

      protectedPage(
        "/dashboard",
        <DashboardPage />,
        FULL_ACCESS_ROLES
      ),

      protectedPage(
        "/report",
        <ReportPage />,
        REPORT_ROLES
      ),

      protectedPage(
        "/cases",
        <CaseManagement />,
        FULL_ACCESS_ROLES
      ),

      protectedPage(
        "/evidence",
        <EvidencePage />,
        FULL_ACCESS_ROLES
      ),

      protectedPage(
        "/analytics",
        <Suspense fallback={<AnalyticsSkeleton />}>
          <LazyChart>
            <Analytics />
          </LazyChart>
        </Suspense>,
        FULL_ACCESS_ROLES
      ),

      protectedPage(
        "/notifications",
        <Notifications />,
        NOTIFICATION_ROLES
      ),

      protectedPage(
        "/admin",
        <AdminPanel />,
        [...FULL_ACCESS_ROLES, "system_admin"],
      ),

      protectedPage(
        "/profile",
        <MyProfile />,
        [...FULL_ACCESS_ROLES, "driver"],
      ),

      protectedPage(
        "/change-password",
        <ChangePassword />,
        FULL_ACCESS_ROLES
      ),

      protectedPage(
        "/digital-signatures",
        <DigitalSignatures />,
        FULL_ACCESS_ROLES
      ),

      protectedPage(
        "/approval-workflow",
        <ApprovalWorkflow />,
        FULL_ACCESS_ROLES
      ),
      protectedPage(
        "/cases/:caseId/details",
        <CaseDetails />,  
        FULL_ACCESS_ROLES
      ),
      protectedPage(
        "/vehicles/:vehicleId",
        <VehicleDetails />,  
        FULL_ACCESS_ROLES
      ),
      protectedPage(
        "/cases/:caseId/FR104-3/generate",
        <FR104_3Form />,  
        FULL_ACCESS_ROLES
      ),
      protectedPage(
        "/cases/:caseId/FR104-4/generate",
        <FR104_4Form />,  
        FULL_ACCESS_ROLES
      ),

    ],
  }
]);
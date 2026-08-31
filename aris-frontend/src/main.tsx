import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext'
import '@/i18n'
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "./lib/leaflet";
import {AuthProvider} from '@/context/auth/AuthContext'
import { QueryProvider } from "@/providers/QueryProvider";
import RealtimeNotifications from "@/components/providers/RealtimeNotifications";
import PwaNotificationBadge from "@/components/providers/PwaNotificationBadge";
import GlobalErrorBoundary from "@/components/GlobalErrorBoundary";
// Dynamically import the PWA register to avoid TypeScript errors when the
// virtual module "virtual:pwa-register" has no type declarations.
(async () => {
  try {
    // @ts-expect-error: temporary fix for build compatibility
    const { registerSW } = await import('virtual:pwa-register');
    registerSW({ immediate: true });
  } catch (e) {
    console.error(e);
  }
})();

const application = (
  <QueryProvider>
    <AuthProvider>
      <RealtimeNotifications />
      <PwaNotificationBadge />
      <ThemeProvider><App /></ThemeProvider>
    </AuthProvider>
  </QueryProvider>
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {import.meta.env.PROD ? (
      <GlobalErrorBoundary>{application}</GlobalErrorBoundary>
    ) : application}
  </StrictMode>,
)

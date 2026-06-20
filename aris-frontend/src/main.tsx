import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext'
import '@/i18n'

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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)

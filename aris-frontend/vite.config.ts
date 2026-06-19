import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from "node:url";
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from "vite-plugin-pwa";

console.log("PWA CONFIG LOADED");
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    
    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'masked-icon.svg'
      ],

      manifest: {
        id: "/",
        name: 'ARIS',
        short_name: 'ARIS',
        description:
          "Accident Reporting & Investigation System",
        
        theme_color: "#0F4C81",
        background_color: "#ffffff",
        
        display: "standalone",
        display_override: ["standalone", "window-controls-overlay"],
        
        orientation: "portrait",
        start_url: "/",

        icons: [
          {
            src: 'pwa-192x192-icon.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512-icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'maskable-512x512-icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable any',
          }
        ],
      },
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
})

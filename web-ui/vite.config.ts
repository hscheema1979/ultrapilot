import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3020,
    host: true, // Listen on all interfaces
    strictPort: true,
    // Allow access via Tailscale hostnames and any network hostname
    allowedHosts: [
      'vps5',
      'vps5.local',
      '.local',  // Bonjour/mDNS local hostnames
      '.tailscale',  // Tailscale hostnames
      'all'  // Fallback for testing
    ],
    // Watch settings for development
    watch: {
      usePolling: true,
    },
  },
})

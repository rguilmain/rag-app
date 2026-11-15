import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'VITE_')
  const apiTarget = env.VITE_API_PROXY || 'http://localhost:8000'

  return {
    plugins: [react()],
    server: {
      host: true, // bind 0.0.0.0 so the published port reaches the dev server
      port: 5173,
      strictPort: true, // fail loudly instead of silently switching ports
      watch: {
        usePolling: true, // reliable file watching across the Docker bind mount
      },
      proxy: {
        '/search': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import brevoApiPlugin from './vite-plugins/brevo-api.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), brevoApiPlugin()],
})

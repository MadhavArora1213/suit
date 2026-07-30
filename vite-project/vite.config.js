import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import brevoApiPlugin from './vite-plugins/brevo-api.js'
import uploadApiPlugin from './vite-plugins/upload-api.js'
import razorpayApiPlugin from './vite-plugins/razorpay-api.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), brevoApiPlugin(), uploadApiPlugin(), razorpayApiPlugin()],
})

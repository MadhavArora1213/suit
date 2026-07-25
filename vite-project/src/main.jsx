import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AdminApp from './admin/AdminApp.jsx'

// Route to admin panel if URL has ?admin query param, #admin hash, or starts with /admin
const isAdmin =
  window.location.pathname.startsWith('/admin') ||
  window.location.hash === '#admin' ||
  new URLSearchParams(window.location.search).has('admin')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAdmin ? <AdminApp /> : <App />}
  </StrictMode>,
)

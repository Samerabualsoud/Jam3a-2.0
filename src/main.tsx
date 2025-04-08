import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize performance monitoring if available
import performanceMonitoring from './utils/performanceMonitoring'
if (typeof window !== 'undefined') {
  performanceMonitoring.initPerformanceMonitoring();
}

// Initialize service worker if available
import serviceWorker from './utils/serviceWorker'
if (typeof window !== 'undefined') {
  serviceWorker.initServiceWorker();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

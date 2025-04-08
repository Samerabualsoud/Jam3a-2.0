import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure React is defined globally for any components that might use it
window.React = React;

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

// Initialize error reporting if available
import errorReporting from './utils/errorReporting'
if (typeof window !== 'undefined') {
  errorReporting.init();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

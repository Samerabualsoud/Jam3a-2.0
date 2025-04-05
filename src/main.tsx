import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure the root element exists
const rootElement = document.getElementById('root');
if (!rootElement) {
  const newRoot = document.createElement('div');
  newRoot.id = 'root';
  document.body.appendChild(newRoot);
  console.log('Created new root element');
}

// Add a delay to ensure DOM is fully loaded
setTimeout(() => {
  try {
    // Create root and render app
    const root = createRoot(document.getElementById("root")!);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Mark application as loaded for the fallback system
    if (typeof window.markAppAsLoaded === 'function') {
      window.markAppAsLoaded();
    }
    
    console.log('Application rendered successfully');
  } catch (error) {
    console.error('Failed to render application:', error);
    
    // Show error message to user
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');
    const appLoading = document.getElementById('app-loading');
    
    if (errorContainer && errorMessage) {
      if (appLoading) {
        appLoading.style.display = 'none';
      }
      errorContainer.style.display = 'block';
      errorMessage.textContent = error instanceof Error 
        ? `Error rendering application: ${error.message}` 
        : 'An unknown error occurred while rendering the application.';
    }
  }
}, 100); // Small delay to ensure DOM is ready

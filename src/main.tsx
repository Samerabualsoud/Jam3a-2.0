import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Check if React is defined globally
if (typeof window.React === 'undefined') {
  console.error('React is not defined globally. This may cause rendering issues.');
  // Try to notify the user about the error
  const errorContainer = document.getElementById('error-container');
  const errorMessage = document.getElementById('error-message');
  const appLoading = document.getElementById('app-loading');
  
  if (errorContainer && errorMessage) {
    if (appLoading) {
      appLoading.style.display = 'none';
    }
    errorContainer.style.display = 'block';
    errorMessage.textContent = 'React library failed to load properly. Please refresh the page or try again later.';
  }
  
  // Don't proceed with rendering if React is not available
  throw new Error('React is not defined globally');
}

// Ensure the root element exists
const rootElement = document.getElementById('root');
if (!rootElement) {
  const newRoot = document.createElement('div');
  newRoot.id = 'root';
  document.body.appendChild(newRoot);
}

try {
  // Create root and render app
  const root = createRoot(document.getElementById("root")!);
  root.render(<App />);
  
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

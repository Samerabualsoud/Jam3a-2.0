import React from 'react';
import ReactDOM from 'react-dom/client';
import StaticApp from './StaticApp';
import './index.css';

// Ensure React is defined globally for any components that might use it
window.React = React;
// Explicitly define ReactDOM globally as well
window.ReactDOM = ReactDOM;

// Wrap the app rendering in a try-catch to prevent blank screen on errors
try {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <StaticApp />
      </React.StrictMode>
    );
  } else {
    console.error('Root element not found');
  }
} catch (error) {
  console.error('Error rendering application:', error);
  // Create fallback UI if rendering fails
  const rootElement = document.getElementById('root') || document.body;
  const errorElement = document.createElement('div');
  errorElement.style.padding = '20px';
  errorElement.style.margin = '20px';
  errorElement.style.backgroundColor = '#fee2e2';
  errorElement.style.color = '#b91c1c';
  errorElement.style.borderRadius = '4px';
  errorElement.innerHTML = `
    <h2>Application Error</h2>
    <p>Sorry, there was an error loading the application.</p>
    <p>Error: ${error?.message || 'Unknown error'}</p>
    <button onclick="window.location.reload()" style="padding: 8px 16px; background: #b91c1c; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">Reload Page</button>
  `;
  rootElement.appendChild(errorElement);
}

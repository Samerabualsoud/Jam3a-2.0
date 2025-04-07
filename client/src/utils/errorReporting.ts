// Client-side error reporting utility
// This file provides comprehensive error tracking and reporting

// Configuration
const ERROR_REPORTING_CONFIG = {
  // Whether to enable error reporting
  enabled: true,
  // Maximum number of errors to report
  maxErrors: 10,
  // Whether to include stack traces
  includeStack: true,
  // Whether to log to console
  logToConsole: true,
  // Whether to show UI error notifications
  showUINotifications: true
};

// Error storage
let errorCount = 0;
const errorLog = [];

// Initialize error reporting
export function initErrorReporting() {
  if (!ERROR_REPORTING_CONFIG.enabled) return;
  
  // Set up global error handler
  window.addEventListener('error', handleGlobalError);
  
  // Set up unhandled promise rejection handler
  window.addEventListener('unhandledrejection', handlePromiseRejection);
  
  // Set up React error boundary fallback
  setupReactErrorFallback();
  
  // Mark application as loaded for fallback system
  if (typeof window.markAppAsLoaded === 'function') {
    window.markAppAsLoaded();
  }
  
  console.log('Error reporting initialized');
}

// Handle global errors
function handleGlobalError(event) {
  const error = {
    type: 'global',
    message: event.message || 'Unknown error',
    source: event.filename || 'unknown',
    line: event.lineno,
    column: event.colno,
    stack: event.error?.stack,
    timestamp: new Date().toISOString()
  };
  
  logError(error);
  
  // Prevent default browser error handling if we're showing our own UI
  if (ERROR_REPORTING_CONFIG.showUINotifications) {
    event.preventDefault();
  }
}

// Handle unhandled promise rejections
function handlePromiseRejection(event) {
  const error = {
    type: 'promise',
    message: event.reason?.message || 'Unhandled promise rejection',
    stack: event.reason?.stack,
    timestamp: new Date().toISOString()
  };
  
  logError(error);
}

// Log errors to our system
function logError(error) {
  if (errorCount >= ERROR_REPORTING_CONFIG.maxErrors) return;
  
  errorCount++;
  
  // Clean up error object for storage
  const cleanError = { ...error };
  if (!ERROR_REPORTING_CONFIG.includeStack) {
    delete cleanError.stack;
  }
  
  // Add to error log
  errorLog.push(cleanError);
  
  // Log to console if enabled
  if (ERROR_REPORTING_CONFIG.logToConsole) {
    console.error('Error logged:', cleanError);
  }
  
  // Show UI notification if enabled
  if (ERROR_REPORTING_CONFIG.showUINotifications) {
    showErrorNotification(cleanError);
  }
  
  // Store in session storage for debugging
  try {
    sessionStorage.setItem('jam3a_error_log', JSON.stringify(errorLog));
  } catch (e) {
    // Ignore storage errors
  }
}

// Show error notification in UI
function showErrorNotification(error) {
  // Check if we have a notification container
  let container = document.getElementById('error-notification-container');
  
  if (!container) {
    // Create container if it doesn't exist
    container = document.createElement('div');
    container.id = 'error-notification-container';
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'error-notification';
  notification.style.backgroundColor = '#fee2e2';
  notification.style.color = '#b91c1c';
  notification.style.padding = '12px 16px';
  notification.style.borderRadius = '4px';
  notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
  notification.style.marginTop = '10px';
  notification.style.width = '300px';
  notification.style.fontSize = '14px';
  notification.style.position = 'relative';
  
  // Add error message
  const message = document.createElement('div');
  message.style.marginBottom = '8px';
  message.style.fontWeight = 'bold';
  message.textContent = error.message || 'An error occurred';
  notification.appendChild(message);
  
  // Add error details if available
  if (error.source) {
    const details = document.createElement('div');
    details.style.fontSize = '12px';
    details.style.opacity = '0.8';
    details.textContent = `${error.source}${error.line ? `:${error.line}` : ''}`;
    notification.appendChild(details);
  }
  
  // Add close button
  const closeButton = document.createElement('button');
  closeButton.textContent = '×';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '8px';
  closeButton.style.right = '8px';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.color = '#b91c1c';
  closeButton.style.fontSize = '16px';
  closeButton.style.cursor = 'pointer';
  closeButton.onclick = () => {
    notification.remove();
  };
  notification.appendChild(closeButton);
  
  // Add to container
  container.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Set up React error boundary fallback
function setupReactErrorFallback() {
  // This will be used by our React error boundary component
  window.reportReactError = (error, info) => {
    logError({
      type: 'react',
      message: error?.message || 'React component error',
      stack: error?.stack,
      componentStack: info?.componentStack,
      timestamp: new Date().toISOString()
    });
  };
}

// Get all logged errors
export function getErrorLog() {
  return [...errorLog];
}

// Clear error log
export function clearErrorLog() {
  errorLog.length = 0;
  errorCount = 0;
  
  try {
    sessionStorage.removeItem('jam3a_error_log');
  } catch (e) {
    // Ignore storage errors
  }
  
  console.log('Error log cleared');
}

// Export default for easy importing
export default {
  init: initErrorReporting,
  getLog: getErrorLog,
  clear: clearErrorLog
};

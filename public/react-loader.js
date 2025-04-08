// Script loader utility for ensuring React is available
// This file should be included before any other application scripts

(function() {
  // Check if React is already defined
  if (typeof window.React === 'undefined') {
    console.warn('React not found, attempting to load from CDN');
    
    // Create script elements for React and ReactDOM
    var reactScript = document.createElement('script');
    reactScript.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
    reactScript.async = false; // Load synchronously
    
    var reactDOMScript = document.createElement('script');
    reactDOMScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
    reactDOMScript.async = false; // Load synchronously
    
    // Add to document
    document.head.insertBefore(reactScript, document.head.firstChild);
    document.head.insertBefore(reactDOMScript, document.head.childNodes[1]);
    
    // Define a global React variable that will be used if the CDN version fails to load
    window.React = {
      createElement: function() {
        console.error('Using fallback React implementation. This is not ideal.');
        return document.createElement('div');
      },
      Fragment: {},
      StrictMode: { $$typeof: Symbol('react.strict_mode') }
    };
    
    window.ReactDOM = {
      createRoot: function() {
        console.error('Using fallback ReactDOM implementation. This is not ideal.');
        return {
          render: function() {}
        };
      }
    };
  }
  
  // Create a global error handler specifically for React errors
  window.addEventListener('error', function(event) {
    if (event.message && event.message.includes('React is not defined')) {
      console.error('Caught React not defined error, attempting recovery...');
      
      // Try to reload the page with a cache-busting parameter
      if (!window.location.search.includes('nocache')) {
        window.location.href = window.location.href + 
          (window.location.search ? '&' : '?') + 'nocache=' + Date.now();
      }
    }
  });
})();

// Runtime dependency checker for Jam3a application
// This script ensures all required dependencies are loaded before the application starts

// Create a global dependency checker
window.DependencyChecker = {
  dependencies: {
    react: false,
    reactDOM: false,
    router: false
  },
  
  // Register a dependency as loaded
  register: function(name) {
    if (this.dependencies.hasOwnProperty(name)) {
      this.dependencies[name] = true;
      console.log(`Dependency registered: ${name}`);
      this.checkAllDependencies();
    }
  },
  
  // Check if all dependencies are loaded
  checkAllDependencies: function() {
    const allLoaded = Object.values(this.dependencies).every(Boolean);
    
    if (allLoaded) {
      console.log('All dependencies loaded successfully!');
      this.startApplication();
    }
  },
  
  // Start the application when all dependencies are loaded
  startApplication: function() {
    // Remove loading screen
    const loadingElement = document.getElementById('app-loading');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
    
    // Mark app as loaded to prevent fallback content
    if (window.markAppAsLoaded) {
      window.markAppAsLoaded();
    }
    
    // Dispatch event that dependencies are ready
    window.dispatchEvent(new CustomEvent('dependencies-ready'));
  },
  
  // Initialize dependency checking
  init: function() {
    // Check for React
    if (typeof React !== 'undefined') {
      this.register('react');
    } else {
      this.loadScript('https://unpkg.com/react@18/umd/react.production.min.js', () => {
        this.register('react');
      });
    }
    
    // Check for ReactDOM
    if (typeof ReactDOM !== 'undefined') {
      this.register('reactDOM');
    } else {
      this.loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', () => {
        this.register('reactDOM');
      });
    }
    
    // Register router as loaded since it's bundled with the app
    this.register('router');
    
    // Set timeout to show error if dependencies don't load
    setTimeout(() => {
      if (!Object.values(this.dependencies).every(Boolean)) {
        console.error('Failed to load all dependencies within timeout');
        this.showError('Failed to load all required dependencies. Please check your internet connection and try again.');
      }
    }, 10000);
  },
  
  // Helper to load a script
  loadScript: function(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.crossOrigin = 'anonymous';
    script.onload = callback;
    script.onerror = () => {
      console.error(`Failed to load script: ${src}`);
      this.showError(`Failed to load required script: ${src}`);
    };
    document.head.appendChild(script);
  },
  
  // Show error message
  showError: function(message) {
    // Hide loading screen
    const loadingElement = document.getElementById('app-loading');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }
    
    // Show error container
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');
    
    if (errorContainer) {
      errorContainer.style.display = 'block';
    }
    
    if (errorMessage && message) {
      errorMessage.textContent = message;
    }
  }
};

// Initialize dependency checker
document.addEventListener('DOMContentLoaded', function() {
  window.DependencyChecker.init();
});

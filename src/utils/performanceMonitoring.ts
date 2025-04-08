/**
 * Performance monitoring utility for Jam3a-2.0
 * Implements performance metrics tracking and reporting
 */

// Performance metrics interface
interface PerformanceMetrics {
  // Navigation timing metrics
  navigationStart?: number;
  loadTime?: number;
  domContentLoaded?: number;
  firstPaint?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  
  // Interaction metrics
  firstInputDelay?: number;
  cumulativeLayoutShift?: number;
  
  // Custom metrics
  timeToInteractive?: number;
  resourceLoadTime?: Record<string, number>;
  apiResponseTime?: Record<string, number>;
}

// Initialize performance monitoring
export const initPerformanceMonitoring = (): void => {
  if (typeof window === 'undefined' || !window.performance) {
    return;
  }
  
  // Register performance observers
  registerPerformanceObservers();
  
  // Track initial page load metrics
  window.addEventListener('load', () => {
    setTimeout(() => {
      const metrics = collectPerformanceMetrics();
      logPerformanceMetrics(metrics);
      
      // Send metrics to analytics if Google Analytics is available
      if (typeof window.gtag === 'function') {
        sendMetricsToAnalytics(metrics);
      }
    }, 0);
  });
};

// Register performance observers for modern metrics
const registerPerformanceObservers = (): void => {
  try {
    // Largest Contentful Paint
    if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes.includes('largest-contentful-paint')) {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        window.__jamPerf = window.__jamPerf || {};
        window.__jamPerf.largestContentfulPaint = lastEntry.startTime;
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    }
    
    // First Input Delay
    if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes.includes('first-input')) {
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const firstInput = entries[0];
        window.__jamPerf = window.__jamPerf || {};
        window.__jamPerf.firstInputDelay = firstInput.processingStart - firstInput.startTime;
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
    }
    
    // Cumulative Layout Shift
    if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes.includes('layout-shift')) {
      let cumulativeLayoutShift = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            cumulativeLayoutShift += entry.value;
          }
        }
        window.__jamPerf = window.__jamPerf || {};
        window.__jamPerf.cumulativeLayoutShift = cumulativeLayoutShift;
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
    }
    
    // Resource timing for API calls and assets
    if ('PerformanceObserver' in window && PerformanceObserver.supportedEntryTypes.includes('resource')) {
      const resourceObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        window.__jamPerf = window.__jamPerf || {};
        window.__jamPerf.resources = window.__jamPerf.resources || [];
        window.__jamPerf.resources.push(...entries);
      });
      resourceObserver.observe({ type: 'resource', buffered: true });
    }
  } catch (error) {
    console.error('Error setting up performance observers:', error);
  }
};

// Collect performance metrics
export const collectPerformanceMetrics = (): PerformanceMetrics => {
  if (typeof window === 'undefined' || !window.performance) {
    return {};
  }
  
  const metrics: PerformanceMetrics = {};
  
  try {
    // Navigation timing metrics
    const navTiming = performance.timing;
    if (navTiming) {
      metrics.navigationStart = navTiming.navigationStart;
      metrics.loadTime = navTiming.loadEventEnd - navTiming.navigationStart;
      metrics.domContentLoaded = navTiming.domContentLoadedEventEnd - navTiming.navigationStart;
    }
    
    // Paint timing
    const paintEntries = performance.getEntriesByType('paint');
    for (const entry of paintEntries) {
      if (entry.name === 'first-paint') {
        metrics.firstPaint = entry.startTime;
      } else if (entry.name === 'first-contentful-paint') {
        metrics.firstContentfulPaint = entry.startTime;
      }
    }
    
    // Custom metrics from observers
    if (window.__jamPerf) {
      metrics.largestContentfulPaint = window.__jamPerf.largestContentfulPaint;
      metrics.firstInputDelay = window.__jamPerf.firstInputDelay;
      metrics.cumulativeLayoutShift = window.__jamPerf.cumulativeLayoutShift;
      
      // Process resource timing
      if (window.__jamPerf.resources) {
        metrics.resourceLoadTime = {};
        metrics.apiResponseTime = {};
        
        for (const resource of window.__jamPerf.resources) {
          const duration = resource.duration;
          const url = resource.name;
          
          // Categorize resources
          if (url.includes('/api/')) {
            // API calls
            const apiEndpoint = url.split('/api/')[1].split('?')[0];
            metrics.apiResponseTime[apiEndpoint] = duration;
          } else if (url.includes('.js')) {
            // JavaScript files
            const fileName = url.split('/').pop() || '';
            metrics.resourceLoadTime[fileName] = duration;
          } else if (url.includes('.css')) {
            // CSS files
            const fileName = url.split('/').pop() || '';
            metrics.resourceLoadTime[fileName] = duration;
          } else if (url.includes('.jpg') || url.includes('.png') || url.includes('.webp')) {
            // Image files
            const fileName = url.split('/').pop() || '';
            metrics.resourceLoadTime[fileName] = duration;
          }
        }
      }
    }
  } catch (error) {
    console.error('Error collecting performance metrics:', error);
  }
  
  return metrics;
};

// Log performance metrics to console
export const logPerformanceMetrics = (metrics: PerformanceMetrics): void => {
  console.group('Performance Metrics');
  console.log('Load Time:', metrics.loadTime ? `${metrics.loadTime.toFixed(0)}ms` : 'N/A');
  console.log('DOM Content Loaded:', metrics.domContentLoaded ? `${metrics.domContentLoaded.toFixed(0)}ms` : 'N/A');
  console.log('First Paint:', metrics.firstPaint ? `${metrics.firstPaint.toFixed(0)}ms` : 'N/A');
  console.log('First Contentful Paint:', metrics.firstContentfulPaint ? `${metrics.firstContentfulPaint.toFixed(0)}ms` : 'N/A');
  console.log('Largest Contentful Paint:', metrics.largestContentfulPaint ? `${metrics.largestContentfulPaint.toFixed(0)}ms` : 'N/A');
  console.log('First Input Delay:', metrics.firstInputDelay ? `${metrics.firstInputDelay.toFixed(1)}ms` : 'N/A');
  console.log('Cumulative Layout Shift:', metrics.cumulativeLayoutShift ? metrics.cumulativeLayoutShift.toFixed(3) : 'N/A');
  
  if (metrics.apiResponseTime && Object.keys(metrics.apiResponseTime).length > 0) {
    console.group('API Response Times');
    for (const [endpoint, time] of Object.entries(metrics.apiResponseTime)) {
      console.log(`${endpoint}: ${time.toFixed(0)}ms`);
    }
    console.groupEnd();
  }
  
  if (metrics.resourceLoadTime && Object.keys(metrics.resourceLoadTime).length > 0) {
    console.group('Resource Load Times');
    for (const [resource, time] of Object.entries(metrics.resourceLoadTime)) {
      console.log(`${resource}: ${time.toFixed(0)}ms`);
    }
    console.groupEnd();
  }
  
  console.groupEnd();
};

// Send metrics to Google Analytics
export const sendMetricsToAnalytics = (metrics: PerformanceMetrics): void => {
  if (typeof window.gtag !== 'function') {
    return;
  }
  
  try {
    // Send core web vitals
    if (metrics.largestContentfulPaint) {
      window.gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: 'LCP',
        value: Math.round(metrics.largestContentfulPaint),
        non_interaction: true,
      });
    }
    
    if (metrics.firstInputDelay) {
      window.gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: 'FID',
        value: Math.round(metrics.firstInputDelay),
        non_interaction: true,
      });
    }
    
    if (metrics.cumulativeLayoutShift) {
      window.gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: 'CLS',
        value: Math.round(metrics.cumulativeLayoutShift * 1000),
        non_interaction: true,
      });
    }
    
    // Send page load time
    if (metrics.loadTime) {
      window.gtag('event', 'timing_complete', {
        name: 'load',
        value: Math.round(metrics.loadTime),
        event_category: 'Page Timing',
      });
    }
  } catch (error) {
    console.error('Error sending metrics to analytics:', error);
  }
};

// Track API call performance
export const trackApiCall = (endpoint: string, startTime: number): void => {
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  window.__jamPerf = window.__jamPerf || {};
  window.__jamPerf.apiCalls = window.__jamPerf.apiCalls || {};
  window.__jamPerf.apiCalls[endpoint] = duration;
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`API call to ${endpoint} took ${duration.toFixed(0)}ms`);
  }
};

// Export default object with all functions
const performanceMonitoring = {
  initPerformanceMonitoring,
  collectPerformanceMetrics,
  logPerformanceMetrics,
  sendMetricsToAnalytics,
  trackApiCall
};

// Add type definitions for window object
declare global {
  interface Window {
    gtag: (command: string, action: string, params: any) => void;
    __jamPerf: {
      largestContentfulPaint?: number;
      firstInputDelay?: number;
      cumulativeLayoutShift?: number;
      resources?: any[];
      apiCalls?: Record<string, number>;
    };
  }
}

export default performanceMonitoring;

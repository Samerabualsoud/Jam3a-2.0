import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'G-LNHB23E5JK'; // Real GA measurement ID for Jam3a

// Initialize Google Analytics
const initializeGA = () => {
  if (typeof window !== 'undefined') {
    // Add Google Analytics script to head
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: false, // We'll send page views manually
    });

    // Make gtag available globally
    window.gtag = gtag;
  }
};

// Track page view
const trackPageView = (path) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: document.title,
      page_location: window.location.href,
    });
    console.log(`[GA] Page view tracked: ${path}`);
  }
};

// Track event
const trackEvent = (eventName, eventParams = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
    console.log(`[GA] Event tracked: ${eventName}`, eventParams);
  }
};

// Google Analytics component
const GoogleAnalytics = () => {
  const location = useLocation();

  // Initialize GA on mount
  useEffect(() => {
    initializeGA();
  }, []);

  // Track page views when location changes
  useEffect(() => {
    if (location) {
      trackPageView(location.pathname + location.search);
    }
  }, [location]);

  return null; // This component doesn't render anything
};

// Custom hook for using Google Analytics in components
export const useAnalytics = () => {
  return {
    trackEvent,
    trackPageView,
  };
};

export default GoogleAnalytics;

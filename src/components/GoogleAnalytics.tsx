// GoogleAnalytics.tsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Initialize Google Analytics
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

interface GoogleAnalyticsProps {
  measurementId: string;
}

const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({ measurementId }) => {
  const location = useLocation();

  useEffect(() => {
    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}', { 
        page_path: '${location.pathname}${location.search}',
        send_page_view: true
      });
    `;
    
    document.head.appendChild(script1);
    document.head.appendChild(script2);
    
    return () => {
      // Clean up
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, [measurementId]);

  // Track page views when location changes
  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', measurementId, {
        page_path: location.pathname + location.search,
        send_page_view: true
      });
    }
  }, [location, measurementId]);

  return null;
};

export default GoogleAnalytics;

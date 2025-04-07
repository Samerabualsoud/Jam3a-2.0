import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import apiService from '@/services/api';

// Google Analytics Component with proper API integration
const GoogleAnalytics = () => {
  const location = useLocation();
  const [analyticsConfig, setAnalyticsConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch analytics configuration from backend
  const fetchAnalyticsConfig = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.get('/analytics/config');
      
      // Store config in state and localStorage for fallback
      setAnalyticsConfig(response);
      localStorage.setItem('analyticsConfig', JSON.stringify(response));
      
      // Initialize GA if config is active and has tracking ID
      if (response.active && response.trackingId) {
        initializeGA(response);
      } else {
        console.log('[GA] Analytics is disabled or missing tracking ID');
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching analytics config:', err);
      setError('Failed to load analytics configuration');
      
      // Try to load from localStorage as fallback
      const storedConfig = localStorage.getItem('analyticsConfig');
      if (storedConfig) {
        try {
          const config = JSON.parse(storedConfig);
          setAnalyticsConfig(config);
          
          // Initialize GA if config is active and has tracking ID
          if (config.active && config.trackingId) {
            initializeGA(config);
          }
        } catch (parseError) {
          console.error('Error parsing stored analytics config:', parseError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize Google Analytics
  const initializeGA = (config) => {
    try {
      // Create script tag
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${config.trackingId}`;
      document.head.appendChild(script);
      
      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;
      
      gtag('js', new Date());
      
      // Configure with settings from backend
      gtag('config', config.trackingId, {
        anonymize_ip: config.ipAnonymization,
        send_page_view: config.trackPageViews
      });
      
      console.log(`[GA] Initialized with ID: ${config.trackingId}`);
      console.log(`[GA] IP Anonymization: ${config.ipAnonymization ? 'Enabled' : 'Disabled'}`);
      console.log(`[GA] Page View Tracking: ${config.trackPageViews ? 'Enabled' : 'Disabled'}`);
      console.log(`[GA] Event Tracking: ${config.trackEvents ? 'Enabled' : 'Disabled'}`);
    } catch (error) {
      console.error('Error initializing Google Analytics:', error);
    }
  };

  // Track page view when location changes
  const trackPageView = (path) => {
    if (typeof window !== 'undefined' && window.gtag && analyticsConfig?.trackPageViews) {
      try {
        window.gtag('event', 'page_view', {
          page_path: path,
          page_title: document.title
        });
        console.log(`[GA] Page view: ${path}`);
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    }
  };

  // Fetch analytics config on mount
  useEffect(() => {
    fetchAnalyticsConfig();
    
    // Set up interval to refresh config every hour
    const intervalId = setInterval(fetchAnalyticsConfig, 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Track page view when location changes
  useEffect(() => {
    if (analyticsConfig && !isLoading) {
      trackPageView(location.pathname);
    }
  }, [location, analyticsConfig, isLoading]);

  // This component doesn't render anything
  return null;
};

// Export track event function for use in other components
export const trackEvent = (category, action, label = null, value = null) => {
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      // Get config from localStorage
      const storedConfig = localStorage.getItem('analyticsConfig');
      if (storedConfig) {
        const config = JSON.parse(storedConfig);
        
        if (config.active && config.trackEvents) {
          const eventParams = {
            event_category: category,
            event_label: label,
            value: value
          };
          
          // Remove undefined properties
          Object.keys(eventParams).forEach(key => 
            eventParams[key] === null && delete eventParams[key]
          );
          
          window.gtag('event', action, eventParams);
          console.log(`[GA] Event: ${category} - ${action} - ${label || 'N/A'}`);
        }
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }
};

// Export ecommerce tracking functions
export const ecommerce = {
  // View item
  viewItem: (item) => {
    if (typeof window !== 'undefined' && window.gtag) {
      try {
        if (!item) {
          console.warn('[GA] viewItem called with invalid item');
          return;
        }
        
        window.gtag('event', 'view_item', {
          currency: 'SAR',
          value: parseFloat(item?.price || 0),
          items: [{
            item_id: item?.id || 'unknown_id',
            item_name: item?.name || 'Unknown Item',
            price: parseFloat(item?.price || 0),
            item_category: item?.category || 'Uncategorized',
            quantity: 1
          }]
        });
        console.log(`[GA] Ecommerce: view_item - ${item?.name || 'unknown'}`);
      } catch (error) {
        console.error('Error tracking view_item:', error);
      }
    }
  },
  
  // Add to cart
  addToCart: (item, quantity = 1) => {
    if (typeof window !== 'undefined' && window.gtag) {
      try {
        if (!item) {
          console.warn('[GA] addToCart called with invalid item');
          return;
        }
        
        window.gtag('event', 'add_to_cart', {
          currency: 'SAR',
          value: parseFloat(item?.price || 0) * quantity,
          items: [{
            item_id: item?.id || 'unknown_id',
            item_name: item?.name || 'Unknown Item',
            price: parseFloat(item?.price || 0),
            item_category: item?.category || 'Uncategorized',
            quantity: quantity
          }]
        });
        console.log(`[GA] Ecommerce: add_to_cart - ${item?.name || 'unknown'} (${quantity})`);
      } catch (error) {
        console.error('Error tracking add_to_cart:', error);
      }
    }
  },
  
  // Join Jam3a group
  joinJam3a: (groupInfo) => {
    if (typeof window !== 'undefined' && window.gtag) {
      try {
        if (!groupInfo) {
          console.warn('[GA] joinJam3a called with invalid group info');
          return;
        }
        
        window.gtag('event', 'join_jam3a_group', {
          group_id: groupInfo?.id || 'unknown_group',
          product_name: groupInfo?.productName || 'Unknown Product',
          product_price: parseFloat(groupInfo?.price || 0),
          discount_percentage: parseFloat(groupInfo?.discountPercentage || 0),
          currency: 'SAR'
        });
        console.log(`[GA] Custom event: join_jam3a_group - ${groupInfo?.productName || 'Unknown Product'}`);
      } catch (error) {
        console.error('Error tracking join_jam3a_group:', error);
      }
    }
  }
};

export default GoogleAnalytics;

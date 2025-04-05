import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'G-G3N8DYCLBM'; // Updated GA measurement ID for Jam3a

// Initialize Google Analytics
const initializeGA = () => {
  if (typeof window !== 'undefined') {
    try {
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
        cookie_domain: 'jam3a.sa',
        cookie_flags: 'SameSite=None;Secure',
        anonymize_ip: true,
        user_properties: {
          app_version: '2.0',
          platform: 'web'
        }
      });

      // Make gtag available globally
      window.gtag = gtag;
    } catch (error) {
      console.error('Failed to initialize Google Analytics:', error);
    }
  }
};

// Track page view
const trackPageView = (path) => {
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: document.title || 'Jam3a',
        page_location: window.location.href,
      });
      console.log(`[GA] Page view tracked: ${path}`);
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }
};

// Track event
const trackEvent = (eventName, eventParams = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('event', eventName, eventParams);
      console.log(`[GA] Event tracked: ${eventName}`, eventParams);
    } catch (error) {
      console.error(`Error tracking event ${eventName}:`, error);
    }
  }
};

// Enhanced ecommerce tracking functions
const ecommerce = {
  // View item list
  viewItemList: (items, listName) => {
    if (typeof window !== 'undefined' && window.gtag) {
      try {
        if (!Array.isArray(items) || items.length === 0) {
          console.warn('[GA] viewItemList called with empty or invalid items array');
          return;
        }
        
        window.gtag('event', 'view_item_list', {
          items: items.map(item => ({
            item_id: item?.id || 'unknown_id',
            item_name: item?.name || 'Unknown Item',
            price: parseFloat(item?.price || 0),
            item_category: item?.category || 'Uncategorized',
            item_list_name: listName || 'Default List',
            index: item?.index || 0
          })),
          item_list_name: listName || 'Default List'
        });
        console.log(`[GA] Ecommerce: view_item_list - ${listName || 'Default List'}`);
      } catch (error) {
        console.error('Error tracking view_item_list:', error);
      }
    }
  },
  
  // View item details
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
            item_category: item?.category || 'Uncategorized'
          }]
        });
        console.log(`[GA] Ecommerce: view_item - ${item?.name || 'Unknown Item'}`);
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
          value: parseFloat(item?.price || 0) * (quantity || 1),
          items: [{
            item_id: item?.id || 'unknown_id',
            item_name: item?.name || 'Unknown Item',
            price: parseFloat(item?.price || 0),
            item_category: item?.category || 'Uncategorized',
            quantity: quantity || 1
          }]
        });
        console.log(`[GA] Ecommerce: add_to_cart - ${item?.name || 'Unknown Item'} (${quantity || 1})`);
      } catch (error) {
        console.error('Error tracking add_to_cart:', error);
      }
    }
  },
  
  // Begin checkout
  beginCheckout: (items, value) => {
    if (typeof window !== 'undefined' && window.gtag) {
      try {
        if (!Array.isArray(items) || items.length === 0) {
          console.warn('[GA] beginCheckout called with empty or invalid items array');
          return;
        }
        
        window.gtag('event', 'begin_checkout', {
          currency: 'SAR',
          value: parseFloat(value || 0),
          items: items.map(item => ({
            item_id: item?.id || 'unknown_id',
            item_name: item?.name || 'Unknown Item',
            price: parseFloat(item?.price || 0),
            item_category: item?.category || 'Uncategorized',
            quantity: item?.quantity || 1
          }))
        });
        console.log(`[GA] Ecommerce: begin_checkout - ${items.length} items`);
      } catch (error) {
        console.error('Error tracking begin_checkout:', error);
      }
    }
  },
  
  // Purchase
  purchase: (transaction) => {
    if (typeof window !== 'undefined' && window.gtag) {
      try {
        if (!transaction || !Array.isArray(transaction.items)) {
          console.warn('[GA] purchase called with invalid transaction data');
          return;
        }
        
        window.gtag('event', 'purchase', {
          transaction_id: transaction?.id || `order_${Date.now()}`,
          value: parseFloat(transaction?.value || 0),
          currency: 'SAR',
          tax: parseFloat(transaction?.tax || 0),
          shipping: parseFloat(transaction?.shipping || 0),
          items: transaction.items.map(item => ({
            item_id: item?.id || 'unknown_id',
            item_name: item?.name || 'Unknown Item',
            price: parseFloat(item?.price || 0),
            item_category: item?.category || 'Uncategorized',
            quantity: item?.quantity || 1
          }))
        });
        console.log(`[GA] Ecommerce: purchase - Transaction ID: ${transaction?.id || 'unknown'}`);
      } catch (error) {
        console.error('Error tracking purchase:', error);
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
  },
  
  // Create Jam3a group
  createJam3a: (groupInfo) => {
    if (typeof window !== 'undefined' && window.gtag) {
      try {
        if (!groupInfo) {
          console.warn('[GA] createJam3a called with invalid group info');
          return;
        }
        
        window.gtag('event', 'create_jam3a_group', {
          product_name: groupInfo?.productName || 'Unknown Product',
          product_price: parseFloat(groupInfo?.price || 0),
          target_members: parseInt(groupInfo?.targetMembers || 1),
          discount_percentage: parseFloat(groupInfo?.discountPercentage || 0),
          currency: 'SAR'
        });
        console.log(`[GA] Custom event: create_jam3a_group - ${groupInfo?.productName || 'Unknown Product'}`);
      } catch (error) {
        console.error('Error tracking create_jam3a_group:', error);
      }
    }
  },
  
  // Join waitlist
  joinWaitlist: (email, hasSubscribed = false) => {
    if (typeof window !== 'undefined' && window.gtag) {
      try {
        if (!email) {
          console.warn('[GA] joinWaitlist called with invalid email');
          return;
        }
        
        window.gtag('event', 'join_waitlist', {
          has_subscribed: !!hasSubscribed
        });
        console.log(`[GA] Custom event: join_waitlist - ${email}`);
      } catch (error) {
        console.error('Error tracking join_waitlist:', error);
      }
    }
  },
  
  // User registration
  userRegistration: (method = 'email') => {
    if (typeof window !== 'undefined' && window.gtag) {
      try {
        window.gtag('event', 'sign_up', {
          method: method || 'email'
        });
        console.log(`[GA] Event: user_registration - Method: ${method || 'email'}`);
      } catch (error) {
        console.error('Error tracking user_registration:', error);
      }
    }
  },
  
  // User login
  userLogin: (method = 'email') => {
    if (typeof window !== 'undefined' && window.gtag) {
      try {
        window.gtag('event', 'login', {
          method: method || 'email'
        });
        console.log(`[GA] Event: user_login - Method: ${method || 'email'}`);
      } catch (error) {
        console.error('Error tracking user_login:', error);
      }
    }
  }
};

// Set user ID for cross-device tracking
const setUserId = (userId) => {
  if (typeof window !== 'undefined' && window.gtag && userId) {
    try {
      window.gtag('config', GA_MEASUREMENT_ID, {
        user_id: userId
      });
      console.log(`[GA] User ID set: ${userId}`);
    } catch (error) {
      console.error('Error setting user ID:', error);
    }
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
    ecommerce,
    setUserId
  };
};

export default GoogleAnalytics;

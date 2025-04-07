import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'UA-123456789-1'; // Default ID, will be overridden by config

// Initialize Google Analytics
const initializeGA = async () => {
  try {
    // Fetch configuration from backend
    const response = await axios.get('/api/analytics/config');
    const config = response.data;
    
    // If no tracking ID is set, don't initialize
    if (!config.trackingId) {
      console.warn('[GA] No tracking ID configured. Google Analytics will not be initialized.');
      return;
    }
    
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
    
    // Try to load from local storage as fallback
    const storedConfig = localStorage.getItem('analyticsConfig');
    if (storedConfig) {
      try {
        const config = JSON.parse(storedConfig);
        if (config.trackingId) {
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
          
          // Configure with settings from local storage
          gtag('config', config.trackingId, {
            anonymize_ip: config.ipAnonymization,
            send_page_view: config.trackPageViews
          });
          
          console.log(`[GA] Initialized from local storage with ID: ${config.trackingId}`);
        }
      } catch (parseError) {
        console.error('Error parsing stored analytics configuration:', parseError);
      }
    }
  }
};

// Track page view
const trackPageView = (path) => {
  if (typeof window !== 'undefined' && window.gtag) {
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

// Track custom event
const trackEvent = (category, action, label = null, value = null) => {
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      // Check if event tracking is enabled
      axios.get('/api/analytics/config')
        .then(response => {
          const config = response.data;
          
          if (config.trackEvents) {
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
          } else {
            console.log('[GA] Event tracking is disabled');
          }
        })
        .catch(error => {
          console.error('Error checking event tracking configuration:', error);
          
          // Try to load from local storage as fallback
          const storedConfig = localStorage.getItem('analyticsConfig');
          if (storedConfig) {
            try {
              const config = JSON.parse(storedConfig);
              
              if (config.trackEvents) {
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
                console.log(`[GA] Event (from local storage): ${category} - ${action} - ${label || 'N/A'}`);
              }
            } catch (parseError) {
              console.error('Error parsing stored analytics configuration:', parseError);
            }
          }
        });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }
};

// Ecommerce tracking
const ecommerce = {
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
  
  // Begin checkout
  beginCheckout: (items, value = 0) => {
    if (typeof window !== 'undefined' && window.gtag) {
      try {
        if (!items || !Array.isArray(items) || items.length === 0) {
          console.warn('[GA] beginCheckout called with invalid items');
          return;
        }
        
        window.gtag('event', 'begin_checkout', {
          currency: 'SAR',
          value: parseFloat(value || items.reduce((sum, item) => 
            sum + (parseFloat(item?.price || 0) * (item?.quantity || 1)), 0
          )),
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
        if (!transaction || !transaction.items || !Array.isArray(transaction.items)) {
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
      // Fetch configuration to get the tracking ID
      axios.get('/api/analytics/config')
        .then(response => {
          const config = response.data;
          
          if (config.trackingId) {
            window.gtag('config', config.trackingId, {
              user_id: userId
            });
            console.log(`[GA] User ID set: ${userId}`);
          }
        })
        .catch(error => {
          console.error('Error fetching analytics configuration for user ID:', error);
          
          // Try to load from local storage as fallback
          const storedConfig = localStorage.getItem('analyticsConfig');
          if (storedConfig) {
            try {
              const config = JSON.parse(storedConfig);
              
              if (config.trackingId) {
                window.gtag('config', config.trackingId, {
                  user_id: userId
                });
                console.log(`[GA] User ID set (from local storage): ${userId}`);
              }
            } catch (parseError) {
              console.error('Error parsing stored analytics configuration:', parseError);
            }
          }
        });
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
    
    // Set up refresh interval to check for configuration changes
    const intervalId = setInterval(() => {
      initializeGA();
    }, 15 * 60 * 1000); // Check every 15 minutes
    
    return () => clearInterval(intervalId);
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

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'G-G3N8DYCLBM'; // Updated GA measurement ID for Jam3a

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
      cookie_domain: 'jam3a.sa',
      cookie_flags: 'SameSite=None;Secure',
      anonymize_ip: true
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

// Enhanced ecommerce tracking functions
const ecommerce = {
  // View item list
  viewItemList: (items, listName) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_item_list', {
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          item_category: item.category,
          item_list_name: listName,
          index: item.index
        })),
        item_list_name: listName
      });
      console.log(`[GA] Ecommerce: view_item_list - ${listName}`);
    }
  },
  
  // View item details
  viewItem: (item) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_item', {
        currency: 'SAR',
        value: parseFloat(item.price),
        items: [{
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          item_category: item.category
        }]
      });
      console.log(`[GA] Ecommerce: view_item - ${item.name}`);
    }
  },
  
  // Add to cart
  addToCart: (item, quantity = 1) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'SAR',
        value: parseFloat(item.price) * quantity,
        items: [{
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          item_category: item.category,
          quantity: quantity
        }]
      });
      console.log(`[GA] Ecommerce: add_to_cart - ${item.name} (${quantity})`);
    }
  },
  
  // Begin checkout
  beginCheckout: (items, value) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'begin_checkout', {
        currency: 'SAR',
        value: parseFloat(value),
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          item_category: item.category,
          quantity: item.quantity
        }))
      });
      console.log(`[GA] Ecommerce: begin_checkout - ${items.length} items`);
    }
  },
  
  // Purchase
  purchase: (transaction) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: transaction.id,
        value: parseFloat(transaction.value),
        currency: 'SAR',
        tax: parseFloat(transaction.tax || 0),
        shipping: parseFloat(transaction.shipping || 0),
        items: transaction.items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          item_category: item.category,
          quantity: item.quantity
        }))
      });
      console.log(`[GA] Ecommerce: purchase - Transaction ID: ${transaction.id}`);
    }
  },
  
  // Join Jam3a group
  joinJam3a: (groupInfo) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'join_jam3a_group', {
        group_id: groupInfo.id,
        product_name: groupInfo.productName,
        product_price: parseFloat(groupInfo.price),
        discount_percentage: parseFloat(groupInfo.discountPercentage),
        currency: 'SAR'
      });
      console.log(`[GA] Custom event: join_jam3a_group - ${groupInfo.productName}`);
    }
  },
  
  // Create Jam3a group
  createJam3a: (groupInfo) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'create_jam3a_group', {
        product_name: groupInfo.productName,
        product_price: parseFloat(groupInfo.price),
        target_members: parseInt(groupInfo.targetMembers),
        discount_percentage: parseFloat(groupInfo.discountPercentage),
        currency: 'SAR'
      });
      console.log(`[GA] Custom event: create_jam3a_group - ${groupInfo.productName}`);
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
    ecommerce
  };
};

export default GoogleAnalytics;

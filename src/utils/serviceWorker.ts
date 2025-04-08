/**
 * Service worker registration for Jam3a-2.0
 * Implements offline capabilities and caching strategies
 */

// Check if service workers are supported
export const isServiceWorkerSupported = (): boolean => {
  return 'serviceWorker' in navigator;
};

// Register service worker
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!isServiceWorkerSupported()) {
    console.warn('Service workers are not supported in this browser');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js');
    console.log('Service worker registered successfully:', registration.scope);
    return registration;
  } catch (error) {
    console.error('Service worker registration failed:', error);
    return null;
  }
};

// Unregister service worker
export const unregisterServiceWorker = async (): Promise<boolean> => {
  if (!isServiceWorkerSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const result = await registration.unregister();
      console.log('Service worker unregistered:', result);
      return result;
    }
    return false;
  } catch (error) {
    console.error('Service worker unregistration failed:', error);
    return false;
  }
};

// Check if app is installed (PWA)
export const isAppInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
};

// Initialize service worker with caching strategies
export const initServiceWorker = async (): Promise<void> => {
  if (!isServiceWorkerSupported()) {
    return;
  }

  // Register service worker
  const registration = await registerServiceWorker();
  
  if (!registration) {
    return;
  }

  // Set up update handling
  registration.onupdatefound = () => {
    const installingWorker = registration.installing;
    if (!installingWorker) return;

    installingWorker.onstatechange = () => {
      if (installingWorker.state === 'installed') {
        if (navigator.serviceWorker.controller) {
          // New content is available, show notification to user
          console.log('New content is available, please refresh.');
          
          // Dispatch event for the app to show update notification
          window.dispatchEvent(new CustomEvent('serviceWorkerUpdated'));
        } else {
          // Content is cached for offline use
          console.log('Content is cached for offline use.');
        }
      }
    };
  };
};

// Update service worker
export const updateServiceWorker = async (): Promise<void> => {
  if (!isServiceWorkerSupported()) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      console.log('Service worker updated');
    }
  } catch (error) {
    console.error('Service worker update failed:', error);
  }
};

// Check if app is online
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Add online/offline event listeners
export const addConnectivityListeners = (
  onOnline: () => void,
  onOffline: () => void
): () => void => {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
};

export default {
  isServiceWorkerSupported,
  registerServiceWorker,
  unregisterServiceWorker,
  isAppInstalled,
  initServiceWorker,
  updateServiceWorker,
  isOnline,
  addConnectivityListeners
};

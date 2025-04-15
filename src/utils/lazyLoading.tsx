/**
 * Code splitting and lazy loading utilities for Jam3a-2.0
 * Implements performance optimizations for improved load times
 */

import React, { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Default loading component
const DefaultLoading = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="h-8 w-8 animate-spin text-jam3a-purple" />
  </div>
);

// Error boundary for lazy loaded components
class ErrorBoundary extends React.Component<
  { children: React.ReactNode, fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode, fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error in lazy loaded component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Default error fallback
const DefaultErrorFallback = () => (
  <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-800">
    <p className="font-medium">Failed to load component</p>
    <p className="text-sm mt-1">Please refresh the page and try again.</p>
  </div>
);

/**
 * Create a lazy loaded component with suspense and error boundary
 * @param importFn - Dynamic import function for the component
 * @param loadingComponent - Optional custom loading component
 * @param errorFallback - Optional custom error fallback
 * @returns Lazy loaded component with suspense and error boundary
 */
export function lazyLoad<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  loadingComponent: React.ReactNode = <DefaultLoading />,
  errorFallback: React.ReactNode = <DefaultErrorFallback />
) {
  const LazyComponent = lazy(importFn);

  return (props: React.ComponentProps<T>) => (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={loadingComponent}>
        <LazyComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

/**
 * Create a lazy loaded page component with suspense and error boundary
 * @param importFn - Dynamic import function for the page component
 * @returns Lazy loaded page component with suspense and error boundary
 */
export function lazyLoadPage<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  const PageLoading = () => (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="h-12 w-12 animate-spin text-jam3a-purple" />
      <span className="ml-3 text-lg font-medium text-jam3a-purple">Loading page...</span>
    </div>
  );

  const PageError = () => (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
      <div className="p-6 border border-red-300 bg-red-50 rounded-md text-red-800 max-w-md">
        <p className="font-medium text-lg">Failed to load page</p>
        <p className="mt-2">There was an error loading this page. Please refresh or try again later.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-jam3a-purple text-white rounded-md hover:bg-jam3a-deep-purple"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );

  return lazyLoad(importFn, <PageLoading />, <PageError />);
}

export default {
  lazyLoad,
  lazyLoadPage
};

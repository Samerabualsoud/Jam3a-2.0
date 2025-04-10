// Main App component with API integration
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Toaster } from '@/components/ui/toaster';

// Import contexts
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ApiProvider } from '@/services/ApiContext';

// Import components
import AppRoutes from '@/routes/AppRoutes';
import ScrollToTop from '@/components/ScrollToTop';
import ErrorBoundary from '@/components/ErrorBoundary';

const App = () => {
  // Create a client
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ApiProvider>
            <TooltipProvider>
              <LanguageProvider>
                <Toaster />
                <BrowserRouter>
                  <ScrollToTop />
                  <AppRoutes />
                </BrowserRouter>
              </LanguageProvider>
            </TooltipProvider>
          </ApiProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;

import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

/**
 * Loading fallback component to display during data fetching
 */
export const LoadingFallback = ({ message = 'Loading...' }: { message?: string }) => {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Loading</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
};

/**
 * Error fallback component to display when an error occurs
 */
export const ErrorFallback = ({ 
  message = 'An error occurred', 
  retry = undefined 
}: { 
  message: string; 
  retry?: () => void;
}) => {
  return (
    <Card className="max-w-md mx-auto border-destructive/20">
      <CardHeader className="text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
        <CardTitle className="text-destructive">Error</CardTitle>
        <CardDescription className="text-base">{message}</CardDescription>
      </CardHeader>
      {retry && (
        <CardFooter className="flex justify-center">
          <Button onClick={retry} variant="outline">
            Try Again
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

/**
 * Empty state fallback component to display when no data is available
 */
export const EmptyFallback = ({ 
  title = 'No Data Found', 
  message = 'There is no data to display at this time.',
  action = undefined,
  actionLabel = 'Go Back'
}: { 
  title?: string;
  message?: string;
  action?: () => void;
  actionLabel?: string;
}) => {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription className="text-base">{message}</CardDescription>
      </CardHeader>
      {action && (
        <CardFooter className="flex justify-center">
          <Button onClick={action} variant="outline">
            {actionLabel}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default {
  LoadingFallback,
  ErrorFallback,
  EmptyFallback
};

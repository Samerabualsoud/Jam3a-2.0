import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface FallbackProps {
  message?: string;
  retry?: () => void;
}

const LoadingFallback: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-8 min-h-[200px]">
    <Loader2 className="h-8 w-8 animate-spin text-jam3a-purple mb-4" />
    <p className="text-muted-foreground">Loading content...</p>
  </div>
);

const ErrorFallback: React.FC<FallbackProps> = ({ message = "Something went wrong", retry }) => (
  <Card className="w-full max-w-md mx-auto my-8">
    <CardContent className="pt-6 text-center">
      <p className="text-red-500 mb-4">{message}</p>
      {retry && (
        <Button 
          onClick={retry} 
          className="bg-jam3a-purple hover:bg-jam3a-deep-purple"
        >
          Try Again
        </Button>
      )}
    </CardContent>
  </Card>
);

const EmptyStateFallback: React.FC<FallbackProps> = ({ message = "No items found", retry }) => (
  <Card className="w-full max-w-md mx-auto my-8">
    <CardContent className="pt-6 text-center">
      <p className="text-muted-foreground mb-4">{message}</p>
      {retry && (
        <Button 
          onClick={retry} 
          variant="outline"
          className="border-jam3a-purple text-jam3a-purple hover:bg-jam3a-purple hover:text-white"
        >
          Refresh
        </Button>
      )}
    </CardContent>
  </Card>
);

export { LoadingFallback, ErrorFallback, EmptyStateFallback };

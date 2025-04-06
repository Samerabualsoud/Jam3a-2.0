import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[70vh]">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-jam3a-purple" />
          </div>
          
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <p className="text-xl mb-6">Oops! Page not found</p>
          
          <p className="text-muted-foreground mb-8">
            The page you are looking for might have been removed, had its name changed, 
            or is temporarily unavailable.
          </p>
          
          <Button 
            onClick={() => window.location.href = '/'} 
            className="bg-jam3a-purple hover:bg-jam3a-deep-purple"
          >
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;

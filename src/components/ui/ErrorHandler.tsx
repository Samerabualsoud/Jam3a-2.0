import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { XCircle, AlertTriangle, Info } from 'lucide-react';

interface ErrorHandlerProps {
  error: string | null;
  variant?: 'error' | 'warning' | 'info';
  className?: string;
  onDismiss?: () => void;
}

const ErrorHandler: React.FC<ErrorHandlerProps> = ({
  error,
  variant = 'error',
  className = '',
  onDismiss
}) => {
  if (!error) return null;

  const getIcon = () => {
    switch (variant) {
      case 'error':
        return <XCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      default:
        return <XCircle className="h-4 w-4" />;
    }
  };

  const getVariantClass = () => {
    switch (variant) {
      case 'error':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'warning':
        return 'border-amber-200 bg-amber-50 text-amber-800';
      case 'info':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      default:
        return 'border-red-200 bg-red-50 text-red-800';
    }
  };

  return (
    <Alert className={`${getVariantClass()} ${className}`}>
      <div className="flex items-start">
        <div className="mr-2 mt-0.5">{getIcon()}</div>
        <div className="flex-1">
          <AlertTitle className="font-medium">
            {variant === 'error' ? 'Error' : variant === 'warning' ? 'Warning' : 'Information'}
          </AlertTitle>
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </div>
        {onDismiss && (
          <button 
            onClick={onDismiss} 
            className="ml-2 text-sm opacity-70 hover:opacity-100"
            aria-label="Dismiss"
          >
            ×
          </button>
        )}
      </div>
    </Alert>
  );
};

export default ErrorHandler;

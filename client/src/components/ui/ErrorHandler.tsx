import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorHandlerProps {
  error?: string;
  errors?: Record<string, string[]>;
  className?: string;
}

const ErrorHandler: React.FC<ErrorHandlerProps> = ({ 
  error, 
  errors,
  className = ""
}) => {
  if (!error && (!errors || Object.keys(errors).length === 0)) {
    return null;
  }

  return (
    <div className={`bg-destructive/15 text-destructive rounded-md p-3 mt-2 ${className}`}>
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          {error && <p>{error}</p>}
          
          {errors && Object.keys(errors).length > 0 && (
            <ul className="list-disc pl-5 space-y-1">
              {Object.entries(errors).map(([field, fieldErrors]) => 
                fieldErrors.map((err, i) => (
                  <li key={`${field}-${i}`}>
                    <span className="font-medium">{field}: </span>
                    {err}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export { ErrorHandler };
export default ErrorHandler;

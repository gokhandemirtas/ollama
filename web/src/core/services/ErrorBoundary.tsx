import React, { ReactNode, useEffect, useState } from 'react';

interface Props {
  children: ReactNode;
}

const ErrorBoundary: React.FC<Props> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error: Error, errorInfo: string) => {
      console.error("Uncaught error:", error, errorInfo);
      setHasError(true);
    };

    const errorListener = (event: ErrorEvent) => {
      handleError(event.error, event.message);
    };

    window.addEventListener('error', errorListener);

    return () => {
      window.removeEventListener('error', errorListener);
    };
  }, []);

  if (hasError) {
    return ('An error occurred');
  }

  return <>{children}</>;
};

export default ErrorBoundary;

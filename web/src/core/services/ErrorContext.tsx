import React, { createContext, useEffect, useState } from 'react';

export const ErrorContext = createContext<{ error: string | null, setError: React.Dispatch<React.SetStateAction<string | null>> }>({
  error: null,
  setError: () => {},
});

export const ErrorProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleErrorEvent = (event: CustomEvent) => {
      console.log('error event', event.detail);
      setError(event.detail);
    };

    window.addEventListener('httpError', handleErrorEvent as EventListener);

    return () => {
      window.removeEventListener('httpError', handleErrorEvent as EventListener);
    };
  }, []);

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
};

import React from 'react';

interface Props {
  errorText: string
  className?: string;
}

export const ErrorBoundaryFallback: React.FC<Props> = ({ errorText, className }) => {
  return (
    <aside className={`panel ${className}`}>
      <p className="text-xs/6 text-red-600">{errorText ? errorText : 'Something went wrong with this component'}</p>
    </aside>
  );
};

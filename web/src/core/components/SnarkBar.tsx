import { useEffect, useState } from "react";

import { displayLoadingText } from '../services/LoadingText';

interface Props {
  className?: string;
}

export const SnarkBar: React.FC<Props> = ({ className }) => {
  const [loadingText, setLoadingText] = useState('');

  useEffect(() => {
    displayLoadingText(2000, setLoadingText);

    return () => {
      displayLoadingText();
    };
  }, []);

  return (
    <p className={className}>{loadingText }</p>
  );
}

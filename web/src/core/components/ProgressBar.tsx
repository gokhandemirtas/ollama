import { useEffect, useState } from "react";

import { displayLoadingText } from '../services/LoadingText';

export function ProgressBar() {
  const [loadingText, setLoadingText] = useState('');

  useEffect(() => {
    displayLoadingText(2000, setLoadingText);

    return () => {
      displayLoadingText();
    };
  }, []);

  return (
    <aside className="in-progress w-6/12 rounded-lg shadow-lg mb-4">
      <div className="text-center bg-stone-600 text-white text-xs/4 p-2 rounded-lg">
        {loadingText }
      </div>
    </aside>
  );
}

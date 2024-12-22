import './SnarkBar.css';

import { useEffect, useState } from "react";

import { displayLoadingText } from '../services/LoadingText';

export function SnarkBar() {
  const [loadingText, setLoadingText] = useState('');

  useEffect(() => {
    displayLoadingText(2000, setLoadingText);

    return () => {
      displayLoadingText();
    };
  }, []);

  return (
    <aside className="in-progress sm:w-10/12 md:w-8/12 lg:w-8/12 rounded-lg shadow-lg mb-4">
      <div className="text-center bg-stone-700 text-white text-xs/4 p-2 rounded-lg">
        {loadingText }
      </div>
    </aside>
  );
}

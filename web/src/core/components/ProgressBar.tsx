import './ProgressBar.css'

import { useEffect, useState } from "react";

export default function ProgressBar() {
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    function handler(event: any) {
      setInProgress(event.detail);
    }

    window.addEventListener('inProgress', handler);
    return () => {
      window.removeEventListener('inProgress', handler);
    };
  }, []);
  return (
    <aside className={`!border-3 fixed z-top top-0 left-0 w-full ${inProgress ? 'in-progress' : ''}`}></aside>
  );
}

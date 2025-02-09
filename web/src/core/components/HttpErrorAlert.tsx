import { Alert, AlertActions, AlertDescription, AlertTitle } from './catalyst/alert'
import { useEffect, useState } from 'react'

import { Button } from '@headlessui/react';

export default function HttpErrorHandler() {
  let [isOpen, setIsOpen] = useState(false);

  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    function handler(event: any) {
      if (event.detail) {
        console.log(event.detail);
        const txt = event.detail;
        setErrorText(txt);
        setIsOpen(true);
      }
    }

    window.addEventListener('httpError', handler);
    return () => {
      window.removeEventListener('httpError', handler);
    };
  }, []);

  return (
    <>
      <Alert open={isOpen} onClose={setIsOpen} className="!top-4 right-4 !p-4 !absolute border-2 border-red-500 bg-red-100 !bg-opacity-80">
        <AlertTitle>Error while processing your request</AlertTitle>
        <AlertDescription className="!text-xs/6">
          { errorText }
        </AlertDescription>
        <AlertActions>
          <Button onClick={() => setIsOpen(false)} className="text-white text-sm/6 px-2">
            Dismiss
          </Button>
        </AlertActions>
      </Alert>
    </>
  )
}

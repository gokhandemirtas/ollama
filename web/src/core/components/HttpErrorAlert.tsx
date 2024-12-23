import { Alert, AlertActions, AlertDescription, AlertTitle } from './catalyst/alert'
import { useEffect, useState } from 'react'

export default function HttpErrorHandler() {
  let [isOpen, setIsOpen] = useState(false);

  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    function handler(event: any) {
      if (event.detail) {
        setErrorText(event.detail);
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
      <Alert open={isOpen} onClose={setIsOpen} className="!border-1 !border-red-500">
        <AlertTitle>Error while processing your request</AlertTitle>
        <AlertDescription className="!text-xs/6">
          { errorText }
        </AlertDescription>
        <AlertActions>
          <button onClick={() => setIsOpen(false)} className="cancel-button !text-white">
            Dismiss
          </button>
        </AlertActions>
      </Alert>
    </>
  )
}

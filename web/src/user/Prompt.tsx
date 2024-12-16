import "./Prompt.css";

import { Field, Label, Textarea } from "@headlessui/react";

import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryFallback } from "../core/components/ErrorBoundaryFallback";
import Markdown from "react-markdown";
import { Panel } from "../core/components/Panel";
import { SnarkBar } from "../core/components/SnarkBar";
import api from "../core/services/HttpClient";
import { useState } from "react";

export default function Prompt() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [inProgress, setInProgress] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(answer);
  };

  const submitQuery = (e: React.FormEvent) => {
    e.preventDefault();
    setInProgress(true);
    setAnswer('');

    api.post(`${import.meta.env.VITE_BACKEND_URL}/query`, {
        json: { query },
        timeout: import.meta.env.VITE_TIMEOUT
      })
      .json()
      .then((res: any) => {
        console.log(res);
        setAnswer(res.message.content);
      }).finally(() => {
        setInProgress(false);
        setQuery('');
      });
  }
  return (
    <>
      <ErrorBoundary fallback={<ErrorBoundaryFallback errorText=""/>}>

      { answer &&
        <Panel className="answer-panel mb-2 relative">
          <ClipboardDocumentIcon className="size-7 bg-white border-4 absolute top-2 right-2  text-teal text-sm rounded-md cursor-pointer shadow-md shadow-slate-600" onClick={copyToClipboard}/>
          <Markdown>{ answer }</Markdown>
        </Panel>
      }

      <Panel>
        <form className={inProgress ? 'opacity-90 pointer-events-none' : ''}>
          <Field>
            <Label className="text-xs/6 text-black">
              { !inProgress && 'Ask a question' }
              { inProgress && <SnarkBar className="text-emerald-600 font-bold" /> }
            </Label>
            <Textarea
              id="prompt"
              name="prompt"
              rows={3}
              onChange={(e) => setQuery(e.target.value)}
              className="input-override w-full"
              spellCheck="false" value={query}>
              </Textarea>
          </Field>

          <div>
            <button
              type="submit"
              className="primary-button mt-4 float-right"
              disabled={!query || inProgress || query.length < 10}
              onClick={(e) => submitQuery(e)}>
              Query
            </button>
          </div>
        </form>
      </Panel>
      </ErrorBoundary>
    </>
  )
}

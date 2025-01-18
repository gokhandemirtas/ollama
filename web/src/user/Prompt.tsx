import "./Prompt.css";

import { Field, Label, Textarea } from "@headlessui/react";
import { useEffect, useState } from "react";

import Conversation from "./Conversation";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryFallback } from "../core/components/ErrorBoundaryFallback";
import IConversation from "../core/models/conversation";
import { Panel } from "../core/components/Panel";
import { SnarkBar } from "../core/components/SnarkBar";
import api from "../core/services/HttpClient";

export default function Prompt() {
  const [query, setQuery] = useState('');
  const [conversations, setConversations] = useState<Array<IConversation>>([]);
  const [inProgress, setInProgress] = useState(false);

  function clearChatHistory() {
    api.get(`${import.meta.env.VITE_BACKEND_URL}/clear-chat-history`)
      .json()
      .then(() => {
        setQuery('');
      });
  }

  function updateConversation(question: string, answer: string) {
    const timestamp = new Date().toISOString();
    const userId = '';
    const id = 1;
    setConversations([...conversations, { role: 'user', content: question, timestamp, userId, id}]);
    setConversations([...conversations, { role: 'assistant', content: answer, timestamp, userId, id}]);
  }

  useEffect(() => {
    api.get(`${import.meta.env.VITE_BACKEND_URL}/conversations`)
      .json()
      .then((res: any) => {
        console.log(res);
        setConversations(res);
      });
  }, [setConversations]);

  const submitQuery = (e: React.FormEvent) => {
    e.preventDefault();
    setInProgress(true);

    api.post(`${import.meta.env.VITE_BACKEND_URL}/query`, {
        json: { query },
        timeout: import.meta.env.VITE_TIMEOUT
      })
      .json()
      .then((res: any) => {
        console.log(res);
        const answer = res.message.content;
        updateConversation(query, answer);
      }).finally(() => {

        setInProgress(false);
        setQuery('');
      });
  }
  return (
    <>
      <ErrorBoundary fallback={<ErrorBoundaryFallback errorText=""/>}>
      <Panel className="mb-4">
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
            { conversations.length > 0 &&
                <button onClick={clearChatHistory} className="outline-button mt-4 mr-4 float-right">
                  Clear history
                </button>
            }
          </div>
        </form>
      </Panel>
      { conversations &&
        conversations.map((conversation, index) => (
          <Conversation conversation={conversation} key={index} />
        ))
      }
      </ErrorBoundary>
    </>
  )
}

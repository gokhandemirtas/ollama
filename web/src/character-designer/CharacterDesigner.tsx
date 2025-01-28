import { Field, Fieldset, Input, Select, Textarea } from "@headlessui/react";
import { useEffect, useState } from "react";

import CharacterForm from "./CharacterForm";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryFallback } from "../core/components/ErrorBoundaryFallback";
import { ICharacter } from "../core/models/character";
import Markdown from "react-markdown";
import { Panel } from "../core/components/Panel";
import { SnarkBar } from "../core/components/SnarkBar";
import api from "../core/services/HttpClient";
import { getPortrait } from "../core/utils/portrait-picker";
import useCharacterMetaStore from "../core/store/character-meta.store";

export default function CharacterDesigner() {
  const [inProgress, setInProgress] = useState(false);
  const [suggestion, setSuggestion] = useState<string>("Hello. I'll help you with this journey");
  const [timeout, setDelayTimeout] = useState(0);
  const [portrait, setPortrait] = useState('');

  function askAssistant(query: string) {
    console.log(query)
    if (!query || inProgress) return;
    clearTimeout(timeout);
    const timer = setTimeout(() => {
      setInProgress(true);
      api.post(`${import.meta.env.VITE_BACKEND_URL}/assistant`, {
        json: { query },
        timeout: import.meta.env.VITE_TIMEOUT,
      })
        .then((res) => res.json())
        .then((res: any) => {
          if (res) {
            setSuggestion(res.message.content);
          }

        })
        .finally(() => {
          setInProgress(false);
        });
    }, 3000);
    setDelayTimeout(timer);
  }

  function submitForm(character: ICharacter) {

  }

  useEffect(() => {
    const portrait = getPortrait(null as any);
    console.log(portrait)
    setPortrait(portrait!);
  }, [
    setPortrait
  ])

  return (
    <>
      <ErrorBoundary fallback={<ErrorBoundaryFallback errorText=""/>}>
      <section className="grid grid-cols-6 gap-0 !w-full">
        <aside className="col-span-4">
          <Panel>
            <CharacterForm
              onFormUpdateHandler={askAssistant}
              onPortraitChangeHandler={setPortrait}
              onSubmitHandler={submitForm}
              inProgress={inProgress}
            />
          </Panel>
        </aside>
        <aside  className="col-span-2">
          <Panel className="!p-0 !border-none !w-full !sm:w-full !lg:w-full !rounded-lg !bg-black">
            <figure className="!rounded-tl-lg !rounded-tr-lg overflow-hidden">
              <img src={portrait} />
            </figure>
            <div className="p-2 bg-white rounded-bl-lg rounded-br-lg">
              { inProgress ? <SnarkBar className="text-black text-xs" /> :
                <Markdown className="text-xs">
                  { suggestion }
                </Markdown>
              }
            </div>
          </Panel>
        </aside>
      </section>
      </ErrorBoundary>
    </>
  );
}

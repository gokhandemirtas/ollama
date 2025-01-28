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

export default function CharacterDesigner() {
  const [inProgress, setInProgress] = useState(false);
  const [suggestion, setSuggestion] = useState<string>("Hello. I'll help you with this journey");
  const [portrait, setPortrait] = useState('');

  function submitForm(character: ICharacter) {

  }

  useEffect(() => {
    const portrait = getPortrait(null as any);
    console.log(portrait)
    setPortrait(portrait!);
  }, [setPortrait])

  return (
    <>
      <section className="grid grid-cols-6 gap-0 !w-full">
        <aside className="col-span-4">
          <Panel>
            <CharacterForm
              onNewSuggestion={setSuggestion}
              onPortraitChangeHandler={setPortrait}
              onSubmitHandler={submitForm}
            />
          </Panel>
        </aside>
        <aside  className="col-span-2">
        <ErrorBoundary fallback={<ErrorBoundaryFallback errorText=""/>}>
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
        </ErrorBoundary>
        </aside>
      </section>
    </>
  );
}

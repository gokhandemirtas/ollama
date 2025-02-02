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
import { getRandomGreeting } from "../core/services/Greeter";

export default function CharacterDesigner() {
  const [inProgress, setInProgress] = useState(false);
  const [suggestion, setSuggestion] = useState<string>(getRandomGreeting());
  const [portrait, setPortrait] = useState('');

  async function submitForm(character: ICharacter) {
    setInProgress(true);
    try {
      await api.post<ICharacter>('/character', { json: character })
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const portrait = getPortrait(null as any);
    setPortrait(portrait!);
  }, [setPortrait])

  return (
    <>
      <section className="grid grid-cols-12 !gap-0 !w-full">
        <aside className="col-span-5">
          <Panel>
            <img src={portrait} className="rounded-lg mb-2"/>
            <CharacterForm
              onNewSuggestion={setSuggestion}
              onPortraitChangeHandler={setPortrait}
              onSubmitHandler={submitForm}
            />
          </Panel>
        </aside>
        <aside  className="col-span-7">
        <ErrorBoundary fallback={<ErrorBoundaryFallback errorText=""/>}>
          <Panel className="!p-0 !border-none !w-full !sm:w-full !lg:w-full !rounded-lg !bg-black">
            <div className="p-2 bg-white rounded-md flex-wrap text-xs">

              { inProgress ? <SnarkBar className="text-black text-xs" /> :
                <Markdown className="flex-wrap text-xs">{ suggestion }</Markdown>
              }
            </div>
          </Panel>
        </ErrorBoundary>
        </aside>
      </section>
    </>
  );
}

import { useEffect, useState } from "react";

import CharacterForm from "./CharacterForm";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryFallback } from "../core/components/ErrorBoundaryFallback";
import Markdown from "react-markdown";
import { Panel } from "../core/components/Panel";
import { SnarkBar } from "../core/components/SnarkBar";
import { getRandomGreeting } from "../core/services/Greeter";

export default function CharacterDesigner() {
  const [inProgress, setInProgress] = useState(false);
  const [suggestion, setSuggestion] = useState<string>(getRandomGreeting());
  const [portrait, setPortrait] = useState('');

  useEffect(() => {
    setPortrait(portrait!);
  }, [setPortrait]);

  function changePortrait(portrait: string) {
    setPortrait(portrait);
  }

  return (
    <>
      <section className="!w-full">
        <ErrorBoundary fallback={<ErrorBoundaryFallback errorText=""/>}>
          <Panel className="!border-none !w-full !sm:w-full !lg:w-full mb-6">
            <div className="flex gap-4">
              <aside className="w-24 flex-auto">
                <img src={portrait} className="rounded-lg mb-2"/>
              </aside>
              <aside className="w-80 flex-auto">
                <CharacterForm
                  onNewSuggestion={setSuggestion}
                  onPortraitChangeHandler={changePortrait}
                />
              </aside>
            </div>
          </Panel>
        </ErrorBoundary>
        <ErrorBoundary fallback={<ErrorBoundaryFallback errorText=""/>}>
          <Panel className="!p-0 !border-none !w-full !sm:w-full !lg:w-full !rounded-lg !bg-black">
            <div className="p-2 bg-white rounded-md flex-wrap text-xs">

              { inProgress ? <SnarkBar className="text-black text-xs" /> :
                <Markdown className="flex-wrap text-xs">{ suggestion }</Markdown>
              }
            </div>
          </Panel>
        </ErrorBoundary>
      </section>
    </>
  );
}

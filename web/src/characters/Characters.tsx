import { useEffect, useState } from "react";

import Character from "./Character";
import CharacterSheet from "./CharacterSheet";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryFallback } from "../core/components/ErrorBoundaryFallback";
import { ICharacter } from "../core/models/character";
import api from "../core/services/HttpClient";

export default function Characters() {
  const [characters, setCharacters] = useState<Array<ICharacter>>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<ICharacter | null>(null);

  function getCharacters(){
    api.get(`${import.meta.env.VITE_BACKEND_URL}/characters`)
      .then((res) => res.json() as Promise<Array<ICharacter>>)
      .then((res) => {
        console.log(res);
        setCharacters(res);
      });
  }

  useEffect(() => {
    getCharacters();
  }, [setCharacters]);

  return (
    <>
      <ErrorBoundary fallback={<ErrorBoundaryFallback errorText="Can not load characters"/>}>
        <div className="h-full flex justify-center items-center gap-8">
          { characters.length === 0 && <p className="text-2xl text-gray-500 dark:text-gray-400">No characters found</p> }
          {
            characters.length > 0 &&
            characters.map((character, index) => <Character key={index} character={character} onDeletedHandler={getCharacters} onSelectedHandler={setSelectedCharacter}/>
          )}
        </div>
        {selectedCharacter && <CharacterSheet character={selectedCharacter} />}
      </ErrorBoundary>
    </>
  );
}

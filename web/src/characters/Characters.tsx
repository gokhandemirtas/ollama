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

  async function getCharacters(){
    const chars = await api.get(`${import.meta.env.VITE_BACKEND_URL}/characters`)
      .then((res) => res.json() as Promise<Array<ICharacter>>)
    setCharacters(chars);
  }

  function onDeletedHandler(characterId: number){
    setCharacters(characters.filter((char) => char.id !== characterId));
  }

  useEffect(() => {
    getCharacters();
  }, [setCharacters]);

  return (
    <>
      <ErrorBoundary fallback={<ErrorBoundaryFallback errorText="Can not load characters"/>}>
        <div className="h-full w-full flex flex-wrap justify-center items-center gap-4">
          { characters.length === 0 && <p className="text-2xl text-gray-500 dark:text-gray-400">No characters found</p> }
          {
            characters.length > 0 &&
            characters.map((character, index) =>
              <Character key={index} character={character}
                onDeletedHandler={onDeletedHandler}
                onSelectedHandler={setSelectedCharacter}/>
            )
          }
        </div>
        {selectedCharacter && <CharacterSheet character={selectedCharacter} />}
      </ErrorBoundary>
    </>
  );
}

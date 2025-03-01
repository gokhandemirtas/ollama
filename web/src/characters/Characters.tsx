import { useEffect, useState } from "react";

import Character from "./Character";
import CharacterSheet from "./CharacterSheet";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryFallback } from "../core/components/ErrorBoundaryFallback";
import { ICharacter } from "../core/models/character";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import api from "../core/services/HttpClient";

export default function Characters() {
  const [characters, setCharacters] = useState<Array<ICharacter>>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<ICharacter | null>(null);

  function handleOnSelect(character: ICharacter){
    console.log(character);
    setSelectedCharacter(character);
  }

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
                onSelectedHandler={handleOnSelect}/>
            )
          }
          <div className="character-card flex justify-center items-center">
            <a href="/designer">
            <PlusCircleIcon className="size-24 text-gray-400 hover:text-emerald-500"/>
            </a>
          </div>
        </div>
        <CharacterSheet character={selectedCharacter!} />
      </ErrorBoundary>
    </>
  );
}

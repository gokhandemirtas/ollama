import { useEffect, useState } from "react";

import Character from "./Character";
import { ICharacter } from "../core/models/character";
import api from "../core/services/HttpClient";

export default function Characters() {
  const [characters, setCharacters] = useState<Array<ICharacter>>([]);

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
      <div className="h-full flex justify-center items-center gap-8">
      {
        characters.map((character, index) => <Character key={index} character={character} callback={getCharacters} />
      )}
      </div>
    </>
  );
}

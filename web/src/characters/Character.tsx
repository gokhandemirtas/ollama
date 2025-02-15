import './character.css';

import { useEffect, useState } from 'react';

import { ICharacter } from "../core/models/character";
import { TrashIcon } from '@heroicons/react/24/solid';
import api from '../core/services/HttpClient';
import { resolvePortrait } from '../core/utils/portrait-picker';

export default function Character({ character, onDeletedHandler, onSelectedHandler }: {
  character: ICharacter;
  onDeletedHandler: (characterId: number) => void;
  onSelectedHandler: (character: ICharacter) => void;
}) {

  const [portrait, setPortrait] = useState<string>('');

  async function deleteChar() {
    await api.delete(`${import.meta.env.VITE_BACKEND_URL}/character/${character.id}`);
    onDeletedHandler(character.id!);
  }

  async function getSetPortrait() {
    const portrait = await resolvePortrait(character.race, character.class as any);
    setPortrait(portrait!);
  }

  useEffect(() => {
    getSetPortrait();
  }, [character]);

  return (
    <div className="character-card relative" onClick={() => onSelectedHandler(character)}>
      <img src={portrait} alt={`${character.race} ${character.chrClass}`} className="w-full h-auto mx-auto rounded-lg" />
      {character && (
        <div className="p-2">
          <h2 className="text-sm/6 font-bold text-emerald-800 truncate text-ellipsis max-w-fit">{character.name ?? 'No name'}</h2>
          <TrashIcon className="absolute right-2 top-48 tool-button size-4 text-black hover:text-teal-500 cursor-pointer" onClick={deleteChar}/>
          <p className="text-xs/6">
            Lvl {character.level?.level}, {character.race} {character.class}
          </p>
        </div>
      )}
    </div>
  );
}

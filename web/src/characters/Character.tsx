import './character.css';

import { useEffect, useState } from 'react';

import { ICharacter } from "../core/models/character";
import { TrashIcon } from '@heroicons/react/24/solid';
import api from '../core/services/HttpClient';

const portraits = import.meta.glob('../assets/portraits/*.png', { eager: true });

export default function Character({ character, onDeletedHandler, onSelectedHandler }: {
  character: ICharacter;
  onDeletedHandler: () => void;
  onSelectedHandler: (character: ICharacter) => void;
}) {

  const [portrait, setPortrait] = useState<string>('');

  function getPortrait() {
    const charRace = String(character.race).toLowerCase();
    const charClass = String(character.class).toLowerCase();
    const portraitKey = `../assets/portraits/${charRace}-${charClass}.png`;
    return (portraits[portraitKey] as { default: string })?.default ?? (portraits['../assets/portraits/no-portrait.png'] as { default: string }).default;
  }

  async function deleteChar() {
    await api.delete(`${import.meta.env.VITE_BACKEND_URL}/character/${character.id}`);
    onDeletedHandler();
  }

  useEffect(() => {
    setPortrait(getPortrait());
  }, [character]);

  return (
    <div className="character-card relative" onClick={() => onSelectedHandler(character)}>
      <img src={portrait} alt={`${character.race} ${character.class}`} className="w-full h-auto mx-auto" />
      {character && (
        <div className="p-2">
          <h2 className="text-sm/6 font-bold text-emerald-800">{character.name}</h2>
          <TrashIcon className="absolute right-2 top-48 tool-button size-4 text-black hover:text-teal-500 cursor-pointer" onClick={deleteChar}/>
          <p className="text-xs/6">
            Lvl {character.level.level}, {character.race} {character.class}
          </p>
        </div>
      )}
    </div>
  );
}

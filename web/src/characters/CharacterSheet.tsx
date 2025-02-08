import { Dialog, DialogActions, DialogBody, DialogTitle } from "../core/components/catalyst/dialog";
import { useEffect, useState } from "react";

import { Button } from "@headlessui/react";
import { ICharacter } from "../core/models/character";
import Markdown from "react-markdown";
import { getPortrait } from "../core/utils/portrait-picker";

export default function CharacterSheet({ character }: {
  character: ICharacter;
}) {

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [portrait, setPortrait] = useState<string>('');

  useEffect(() => {
    if (character) {
      setDialogOpen(true);
      const port = getPortrait(character.race, character.class);
      setPortrait(port!);
    }
  }, [character]);

  return (
    <>
      <Dialog
        open={dialogOpen} onClose={() => setDialogOpen(false)}
        className="fixed !inset-0 !bg-none !bg-opacity-0 p-0 z-50 !rounded-none mx-auto !md:max-w-xl !lg:max-w-xl !xl:max-w-xl">
        <div className="bg-white p-4 overflow-y-auto mx-auto mt-6">
          <DialogBody className="mt-0">
          <h1 className="text-xl font-bold mb-4 text-emerald-800">{character?.name}</h1>
            <aside className="text-xs/6 leading-snug">
              <section className="flex mb-8">
                <img src={portrait} className="flex w-48 rounded-xl mr-8"/>
                <div className="flex-auto leading-relaxed">
                  <p><span className="font-bold text-emerald-700">Race:</span> {character?.race}</p>
                  <p><span className="font-bold text-emerald-700">Class:</span> {character?.class}</p>
                  <p><span className="font-bold text-emerald-700">Alignment:</span> {character?.alignment}</p>
                  <p><span className="font-bold text-emerald-700">Level:</span> {character?.level.level}</p>
                  <p><span className="font-bold text-emerald-700">Experience:</span> {character?.level.experience}</p>
                  <p><span className="font-bold text-emerald-700">AC:</span> {character?.armorClass}</p>
                </div>
                <div className="flex-auto leading-relaxed">
                  { character?.abilityScores &&
                    Object.keys(character?.abilityScores).map((key, index) => (
                      <p key={index}><span className="font-bold text-emerald-700">{String(key).toUpperCase()}:</span> {character.abilityScores[key]}</p>
                    ))
                  }
                </div>
              </section>

              <p><span className="font-bold text-emerald-700">Backstory:</span></p>
              <div className="overflow-y-auto h-48 mb-4">
                <Markdown>{character?.backstory}</Markdown>
              </div>
              <p><span className="font-bold text-emerald-700">Inventory:</span></p>
              <div className="overflow-y-auto h-48 mb-4">
                <Markdown>{character?.inventory}</Markdown>
              </div>
              <p><span className="font-bold text-emerald-700">Proficiencies:</span></p>
              <div className="overflow-y-auto h-48">
                <Markdown>{character?.proficiencies}</Markdown>
              </div>

            </aside>
          </DialogBody>
          <DialogActions>
            <Button className="primary-button" onClick={() => setDialogOpen(false)}>Close</Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
}

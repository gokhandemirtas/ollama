import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

import { ICharacter } from "../core/models/character";

export default function CharacterSheet({ character }: {
  character: ICharacter;
}) {
  return (
    <Dialog as="div"  open={true} onClose={() => {}}>
      <DialogBackdrop  className="w-full fixed h-full bg-black bg-opacity-50 z-10">
        <DialogPanel className="inset-0 w-3/5 h-3/5 top-2 right-2 rounded-lg shadow-lg shadow-black z-10 overflow-y-auto bg-white p-4">
          <DialogTitle>Character Sheet</DialogTitle>

        </DialogPanel>
      </DialogBackdrop>
    </Dialog>
  );
}

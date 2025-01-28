import { Field, Fieldset, Input, Select, Textarea } from "@headlessui/react";
import { useEffect, useState } from "react";

import { ICharacter } from "../core/models/character";
import { getPortrait } from "../core/utils/portrait-picker";
import useCharacterMetaStore from "../core/store/character-meta.store";

const formDefaults: ICharacter = {
  name: "",
  race: "",
  class: "",
  alignment: "",
  abilityScores: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
  level: { level: 0, experience: 0 },
  inventory: "",
  backstory: "",
}

export default function CharacterForm({ onPortraitChangeHandler, onSubmitHandler, onFormUpdateHandler, inProgress, character,  }: {
  onPortraitChangeHandler: (portrait: string) => void;
  onFormUpdateHandler: (query: string) => void;
  onSubmitHandler: (character: ICharacter) => void;
  inProgress: boolean;
  character?: ICharacter;
}) {
  const [formState, setFormState] = useState(formDefaults);
  const [error, setError] = useState("");
  const { classes, races, alignments } = useCharacterMetaStore();
  const [inventory, setInventory] = useState<string[]>([]);

  useEffect(() => {
    const query = getQuery();
    if (query) onFormUpdateHandler(query);
    const portrait = getPortrait(formState);
    onPortraitChangeHandler(portrait!);
  }, [formState]);

  function getQuery() {
    if (formState.name && formState.race && formState.class && formState.alignment) {
      let query = '';
      Object.keys(formState).forEach(key => {
        if (["race", "alignment", "class", "name"].includes(key)) {
          query += `${String(key).toUpperCase()}: ${formState[key]}, `
        }
      });
      console.log(query);
      return query;
    } else {
      return null;
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>){
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  };

  function resetForm() {
    setFormState(formDefaults);
    setError('');
  };


  return (
    <>
    <form>
      <Fieldset className="mb-2">
        <Field>
          <Input type="text"
            maxLength={30} required
            id="name"
            name="name"
            placeholder="Character full name"
            onChange={handleInputChange}
            className="input-override w-full !color-scheme:dark"
            value={formState.name}/>
        </Field>
        <Field>
          <Select name="race" onChange={(e) => handleInputChange(e as any)} className="input-override w-full !color-scheme:dark" required>
            <option>Pick a race</option>
            { races ? races.map((c) => <option key={c} value={c}>{c}</option>) : null }
          </Select>
        </Field>
        <Field>
          <Select name="class" onChange={(e) => handleInputChange(e as any)} className="input-override w-full !color-scheme:dark" required>
            <option>Pick a class</option>
            { classes ? classes.map((c) => <option key={c} value={c}>{c}</option>): null }
          </Select>
        </Field>
        <Field>
          <Select name="alignment" onChange={(e) => handleInputChange(e as any)} className="input-override w-full !color-scheme:dark" required>
            <option>Pick an alignment</option>
            { alignments ? alignments.map((c) => <option key={c} value={c}>{c}</option>): null }
          </Select>
        </Field>
        <Field>
          <Textarea maxLength={800} required
            id="class"
            name="backstory"
            placeholder="Your characters background story"
            onChange={(error) => handleInputChange(error as any)}
            className="input-override w-full !color-scheme:dark"
            value={formState.backstory}>
          </Textarea>
        </Field>
        <Field>
          <Input type="text" />
        </Field>
      </Fieldset>
      { error &&
        <div className="bg-red-500 p-1 px-2 mb-4 text-yellow-50 text-xs/6 rounded-lg">{ error }</div>
      }
      <div className="flex justify-end">
        <button type="button" className="cancel-button" disabled={inProgress} onClick={resetForm}>
          Cancel
        </button>
        <button
          type="submit"
          className="primary-button ml-4"
          onClick={(e) => onSubmitHandler(e)}
          disabled={inProgress}
        >
          Save
        </button>
      </div>
    </form>
    </>
  )
}

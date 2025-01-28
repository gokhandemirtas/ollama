import { Button, Field, Fieldset, Input, Label, Select, Textarea } from "@headlessui/react";
import { useEffect, useState } from "react";

import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryFallback } from "../core/components/ErrorBoundaryFallback";
import { ICharacter } from "../core/models/character";
import api from "../core/services/HttpClient";
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

export default function CharacterForm({ onPortraitChangeHandler, onNewSuggestion, onSubmitHandler, character  }: {
  onPortraitChangeHandler: (portrait: string) => void;
  onNewSuggestion: (suggestion: string) => void;
  onSubmitHandler: (character: ICharacter) => void;
  character?: ICharacter;
}) {
  const [formState, setFormState] = useState(formDefaults);
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [inProgress, setInProgress] = useState(false);
  const [timeout, setDelayTimeout] = useState(0);
  const { classes, races, alignments } = useCharacterMetaStore();
  const [inventory, setInventory] = useState<string[]>([]);

  function askAssistant(query: string, callback?: (res: any) => void) {
    console.log(query)
    if (!query || inProgress) return;
    clearTimeout(timeout);
    const timer = setTimeout(() => {
      setInProgress(true);
      api.post(`${import.meta.env.VITE_BACKEND_URL}/assistant`, {
        json: { query },
        timeout: import.meta.env.VITE_TIMEOUT,
      })
        .then((res) => res.json())
        .then((res: any) => {
          const content = res.message.content;
          callback ? callback(content) : onNewSuggestion(content);
        })
        .finally(() => {
          setInProgress(false);
        });
    }, 3000);
    setDelayTimeout(timer);
  }

  useEffect(() => {
    const portrait = getPortrait(formState);
    onPortraitChangeHandler(portrait!);
  }, [formState, classes]);

  function getSummary() {
    if (formState.name && formState.race && formState.class && formState.alignment) {
      let query = '';
      Object.keys(formState).forEach(key => {
        if (["race", "alignment", "class", "name"].includes(key)) {
          query += `${key}: ${formState[key]}, `
        }
      });
      console.log(`query: ${query}`);
      return query;
    } else {
      return null
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>){
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    validateForm();
  };

  function generateBackstory() {
    const query = getSummary();
    if(query) {
      askAssistant(
        `My character is a: ${query}, please generate a backstory for me.`,
        (res) => {
          setFormState((prevState) => ({
            ...prevState,
            backstory: res,
          }))
        });
    } else {
      validateForm();
    }
  }

  function roll() {
    if(formState.race && formState.class) {
      askAssistant(
        `My character is a ${formState.race} ${formState.class}, please roll my ability scores.`,
        (res) => {
          setFormState((prevState) => ({
            ...prevState,
            abilityScores: {
              ...res.abilityScores,
            },
          }))
        });
    } else {
      validateForm(['race', 'class']);
    }
  }

  function validateForm(fields = ['name', 'race', 'class', 'alignment']) {
    let newError: {[key:string]: string} = {};
    fields.map((field) => {
      if (!formState[field as keyof typeof formState]) {
        newError[field] = `Please fill out the ${field}`;
      }
    })

    setError(newError);
  }

  function analyze() {
    const query = getSummary();
    if(query) {
      askAssistant(`My character is a: ${query}, please analyze the character for me.`);
    } else {
      validateForm();
    }
  }

  function resetForm() {
    setFormState(formDefaults);
    setError({});
  };


  return (
    <>
    <ErrorBoundary fallback={<ErrorBoundaryFallback errorText=""/>}>
    <form>
      <Fieldset className="mb-2">
        <Field>
          <Label htmlFor="name" className="font-bold text-xs">
            Character Name
            { error.name ? <span className="text-red-600 ml-6">{ error.name }</span> : null }
          </Label>
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
          <Label htmlFor="race" className="font-bold text-xs">
            Character race
            { error.race ? <span className="text-red-600 ml-6">{ error.race }</span> : null }
          </Label>
          <Select name="race" onChange={(e) => handleInputChange(e as any)} className="input-override w-full !color-scheme:dark" required>
            <option>Pick a race</option>
            { races ? races.map((c) => <option key={c} value={c}>{c}</option>) : null }
          </Select>
        </Field>
        <Field>
          <Label htmlFor="class" className="font-bold text-xs">
            Character class
            { error.class ? <span className="text-red-600 ml-6">{ error.class }</span> : null }
          </Label>
          <Select name="class" onChange={(e) => handleInputChange(e as any)} className="input-override w-full !color-scheme:dark" required>
            <option>Pick a class</option>
            { classes ? classes.map((c) => <option key={c} value={c}>{c}</option>): null }
          </Select>
        </Field>
        <Field>
          <Label htmlFor="alignment" className="font-bold text-xs">
            Character alignment
            { error.alignment ? <span className="text-red-600 ml-6">{ error.alignment }</span> : null }
          </Label>
          <Select name="alignment" onChange={(e) => handleInputChange(e as any)} className="input-override w-full !color-scheme:dark" required>
            <option>Pick an alignment</option>
            { alignments ? alignments.map((c) => <option key={c} value={c}>{c}</option>): null }
          </Select>
        </Field>
        <Field className="relative">
          <Label htmlFor="backstory" className="font-bold text-xs">
            Character backstory
            { error.backstory ? <span className="text-red-600 ml-6">{ error.backstory }</span> : null }
          </Label>
          <Textarea maxLength={800} required
            id="class"
            name="backstory"
            placeholder="Your characters background story"
            onChange={(error) => handleInputChange(error as any)}
            className="input-override w-full !color-scheme:dark"
            value={formState.backstory}>
          </Textarea>
          <ArrowPathIcon className="absolute top-4 right-2 size-5 hover:text-emerald-500 cursor-pointer" onClick={generateBackstory}/>
        </Field>
        <Field>
          {
            Object.keys(formState.abilityScores).map((key) => {
              return (
                <span key={key}>
                  <Label className="font-bold text-xs mr-1">{ String(key).toUpperCase() }</Label>
                  <Input type="number" min={0} max={30} required
                    name={key}
                    placeholder={key}
                    onChange={handleInputChange}
                    className="input-override !color-scheme:dark mr-2 w-10 select-none"
                    value={formState.abilityScores[key as keyof typeof formState.abilityScores]}
                  />
                </span>
              )
            })
          }
          <Button className="primary-button" onClick={roll}>Roll</Button>
        </Field>
      </Fieldset>
      <div className="flex justify-end">
        <Button type="button" className="cancel-button" disabled={inProgress} onClick={resetForm}>
          Reset
        </Button>

        <Button type="button" className="primary-button ml-4" disabled={inProgress} onClick={analyze}>
          Analyze
        </Button>

        <Button
          type="submit"
          className="primary-button ml-4"
          onClick={(e) => onSubmitHandler(e)}
          disabled={inProgress}
        >
          Save
        </Button>
      </div>
    </form>
    </ErrorBoundary>
    </>
  )
}

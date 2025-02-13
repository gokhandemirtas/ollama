import { Button, Field, Input, Select, Textarea } from "@headlessui/react";
import { useEffect, useState } from "react";

import { BeakerIcon } from "@heroicons/react/24/solid";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryFallback } from "../core/components/ErrorBoundaryFallback";
import { ICharacter } from "../core/models/character";
import api from "../core/services/HttpClient";
import { characterSchema } from "./character-schema";
import { getPortrait } from "../core/utils/portrait-picker";
import { speak } from "../core/utils/speech";
import useCharacterMetaStore from "../core/store/character-meta.store";
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup";

export default function CharacterForm({ onPortraitChangeHandler, onNewSuggestion, character }: {
  onPortraitChangeHandler: (portrait: string) => void;
  onNewSuggestion: (suggestion: string) => void;
  character?: ICharacter;
}) {

  const [inProgress, setInProgress] = useState(false);
  const { classes, races, alignments } = useCharacterMetaStore();
  const [assistantError, setAssistantError] = useState<string>();
  const { register, watch, formState: { errors, isValid }, reset, setValue } = useForm<ICharacter>({
    resolver: yupResolver(characterSchema),
    mode: "onChange",
  })

  const abilityScores = {
    str: 0,
    dex: 0,
    con: 0,
    int: 0,
    wis: 0,
    cha: 0,
  }

  const formValues = watch();
  const abortController = new AbortController();

  useEffect(() => {
    if (formValues.race && formValues.chrClass) {
      const image = getPortrait(formValues.race, formValues.chrClass);
      onPortraitChangeHandler(image!);
    }
  }, [formValues.race, formValues.chrClass]);

  function askAssistant(query: string, callback?: (res: any) => void) {
    if (!query || inProgress) return;
    setInProgress(true);
    api.post(`${import.meta.env.VITE_BACKEND_URL}/assistant`, {
      json: { query },
      timeout: import.meta.env.VITE_TIMEOUT,
      signal: abortController.signal,
    })
      .then((res) => res.json())
      .then((res: any) => {
        const content = res.message.content;
        callback ? callback(content) : onNewSuggestion(content);
      })
      .catch((err) => {
        setAssistantError(err.message);
      })
      .finally(() => {
        setInProgress(false);
        speak('I am done with the task');
      });

  }

  function getSummary(restrict?: string[]) {
    let query = '';
    Object.keys(formValues).forEach(key => {
      query += restrict && !restrict.includes(key) ? '' : `${String(key).toUpperCase()}: ${formValues[key]}  `
    });
    return query;
  }

  function generateInventory() {
    const query = getSummary(['race', 'chrClass']);
    setInProgress(true);
    if(query) {
      askAssistant(
        `My character is, ${query} .Please generate an inventory for me.`,
        (res) => {
          const strip = res.replace(/["']/g, '');
          setValue('inventory', strip);
          setInProgress(false);
        });
    }
  }

  function generateProficiencies() {
    const query = getSummary(['name', 'race', 'chrClass', 'alignment']);
    setInProgress(true);
    if(query) {
      askAssistant(
        `My character is, ${query} .Please generate a list of proficiencies for me.`,
        (res) => {
          const strip = res.replace(/["']/g, '');
          setValue('proficiencies', strip);
          setInProgress(false);
        });
    }
  }

  function generateBackstory() {
    const query = getSummary(['name', 'race', 'chrClass', 'alignment']);
    setInProgress(true);
    if(query) {
      askAssistant(
        `My character is, ${query} .Please generate a backstory for me.`,
        (res) => {
          const strip = res.replace(/["']/g, '');
          console.log(strip.length)
          setValue('backstory', strip);
          setInProgress(false);
        });
    }
  }

  function generateName() {
    askAssistant(`My character is a ${formValues.race}, please generate a full name for me.`, (res) => {
      const strip = res.replace(/["']/g, '');
      setValue('name', strip);
    })
  }

  function roll() {
    const query = getSummary(['race', 'chrClass']);
    askAssistant(
      `My character is ${query}. Please roll my ability scores.`,
      (res) => {
        try {
          const scores = JSON.parse(res);

          Object.keys(scores).forEach(key => {
            setValue(`abilityScores[${key}]` as any, scores[key]);
          });
        } catch (error) {
          console.log(error);
        }
      });
  }

  function analyze() {
    const query = getSummary(['name', 'race', 'chrClass', 'alignment']);
    if(query) {
      askAssistant(`My character is ${query} .Please analyze and comment on it for me.`);
    }
  }

  async function updateMeta() {
    await api.get(`${import.meta.env.VITE_BACKEND_URL}/update-meta`, {})
  }

  function resetForm() {
    reset();
    onNewSuggestion('');
    onPortraitChangeHandler('');
  };

  async function onSubmit() {
    setInProgress(true);
      try {
        const payload = {
          ...formValues,
          class: formValues.chrClass,
          isDraft: false,
          level: {
            level: 1,
            experience: 0,
          },
          armorClass: Number(formValues.armorClass) || 10,
        }
        const done = await api.post<ICharacter>(`${import.meta.env.VITE_BACKEND_URL}/character`, { json: payload });
        alert('Character created successfully');
        resetForm();
      } catch (error) {
        console.error(error);
      } finally {
        setInProgress(false);
      }
  }


  return (
    <>
      <ErrorBoundary fallback={<ErrorBoundaryFallback errorText="" />}>
        <form>
          <div className="flex gap-4">
            <aside className="flex-auto">
              <Field className="relative">
                <label htmlFor="name" className="font-bold text-xs">
                  Name
                  {errors && errors.name ? <span className="error-text">{errors.name.message}</span> : null}
                </label>
                <Input
                  type="text"
                  {...register("name")}
                  placeholder="Character full name"
                  className="input-override w-full !color-scheme:dark"
                />
                { !inProgress && formValues.race ?
                  <a title="Generate a name suitable for the race"
                      onClick={generateName}
                      className={`absolute right-2 top-2 text-black hover:text-emerald-600 cursor-pointer ${inProgress ? 'animate-ping' : ''}`}>
                    <BeakerIcon className="size-5"
                   /> </a> : null
                }

              </Field>
              <Field>
                <label htmlFor="chrClass" className="font-bold text-xs">
                  Class
                  {errors && errors.chrClass ? <span className="error-text">{errors.chrClass.message}</span> : null}
                </label>
                <Select
                  {...register("chrClass")}
                  className="input-override w-full !color-scheme:dark"
                >
                  <option value="">Pick a class</option>
                  {classes ? classes.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  )) : null}
                </Select>
              </Field>
            </aside>
            <aside className="flex-auto">
              <Field>
                <label htmlFor="race" className="font-bold text-xs">
                  Race
                  {errors && errors.race ? <span className="error-text">{errors.race.message}</span> : null}
                </label>
                <Select
                  {...register("race")}
                  className="input-override w-full !color-scheme:dark"
                >
                  <option value="">Pick a race</option>
                  {races ? races.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  )) : null}
                </Select>

              </Field>
              <Field>
                <label htmlFor="alignment" className="font-bold text-xs">
                  Alignment
                  {errors && errors.alignment ? <span className="error-text">{errors.alignment.message}</span> : null}
                </label>
                <Select
                  {...register("alignment")}
                  className="input-override w-full !color-scheme:dark"
                >
                  <option value="">Pick an alignment</option>
                  {alignments ? alignments.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  )) : null}
                </Select>
              </Field>
            </aside>
          </div>
          <div>
            <aside className="!relative">
              <Field>
                <label htmlFor="inventory" className="font-bold text-xs">
                  Inventory
                  {errors && errors.inventory ? <span className="error-text">{errors.inventory.message}</span> : null}
                </label>
                <Textarea
                  {...register("inventory")}
                  className="input-override w-full !color-scheme:dark"
                >
                </Textarea>
                { !inProgress &&  formValues.race && formValues.chrClass && formValues.alignment && formValues.name ?
                  <a title="Get weapon and item suggestions based on information you've provided."
                      onClick={generateInventory}
                      className={`absolute right-2 top-2 text-black hover:text-emerald-600 cursor-pointer ${inProgress ? 'animate-ping' : ''}`}>
                    <BeakerIcon className="size-5"
                   /> </a> : null
                }
              </Field>
            </aside>
            <aside className="!relative">
              <Field>
                <label htmlFor="proficiencies" className="font-bold text-xs">
                  Proficiencies
                  {errors && errors.proficiencies ? <span className="error-text">{errors.proficiencies.message}</span> : null}
                </label>
                <Textarea
                  {...register("proficiencies")}
                  className="input-override w-full !color-scheme:dark"
                >
                </Textarea>
                { !inProgress &&  formValues.race && formValues.chrClass && formValues.alignment && formValues.name ?
                  <a title="Get list of proficiencies based on information you've provided."
                      onClick={generateProficiencies}
                      className={`absolute right-2 top-2 text-black hover:text-emerald-600 cursor-pointer ${inProgress ? 'animate-ping' : ''}`}>
                    <BeakerIcon className="size-5"
                   /> </a> : null
                }
              </Field>
            </aside>
            <aside className="!relative">
              <Field>
                <label htmlFor="backstory" className="font-bold text-xs">
                  Character backstory
                  {errors && errors.backstory ? <span className="error-text">{errors.backstory.message}</span> : null}
                </label>
                <Textarea
                  {...register("backstory")}
                  className="input-override w-full !color-scheme:dark"
                >
                </Textarea>
                { !inProgress && formValues.race && formValues.chrClass && formValues.alignment && formValues.name ?
                  <a title="Generate a backstory based on information you've provided."
                      onClick={generateBackstory}
                      className={`absolute right-2 top-2 text-black hover:text-emerald-600 cursor-pointer ${inProgress ? 'animate-ping' : ''}`}>
                    <BeakerIcon className="size-5"
                   /> </a> : null
                }

              </Field>
            </aside>
            <aside className="flex gap-2">
              {Object.keys(abilityScores).map((key: any) => (
                <Field className="flex flex-col mb-2" key={key}>
                  <label htmlFor={`abilityScores.${key}`} className="font-bold text-xs">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <Input
                    type="number"
                    id={key}
                    {...register(`abilityScores.${key}` as any)}
                    className="input-override w-full !color-scheme:dark"
                  />
                </Field>
              ))}
              <Field className="flex flex-col mb-2">
                <label htmlFor="armorClass" className="font-bold text-xs">
                  AC
                </label>
                <Input
                  type="number"
                  {...register("armorClass")}
                  className="input-override w-full !color-scheme:dark"
                />
              </Field>
            </aside>
          </div>
          <nav className="flex justify-end">
            <span className="error-text">{ assistantError }</span>
            <Button className="secondary-button ml-8" type="reset" onClick={resetForm}>
              Reset
            </Button>
            <Button className="outline-button ml-2" type="button" onClick={analyze} disabled={inProgress || (
              !formValues.race && !formValues.chrClass && !formValues.alignment && !formValues.name
            )}>
              Analyze
            </Button>
            <Button className="outline-button ml-2" type="button" onClick={roll} disabled={inProgress || (
              !formValues.race && !formValues.chrClass && !formValues.alignment && !formValues.name
            )}>
              Roll
            </Button>
            <Button className="primary-button ml-2" type="button" disabled={inProgress || (!isValid)} onClick={onSubmit}>
              Create
            </Button>
          </nav>
        </form>
      </ErrorBoundary>
    </>
  )
}

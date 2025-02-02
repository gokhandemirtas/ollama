import { Button, Input, Select, Textarea } from "@headlessui/react";
import { ErrorMessage, Field, Form, Formik, useFormik, useFormikContext } from 'formik';
import { initialValues, validationSchema } from "./form-schema";
import { useEffect, useState } from "react";

import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorBoundaryFallback } from "../core/components/ErrorBoundaryFallback";
import { ICharacter } from "../core/models/character";
import api from "../core/services/HttpClient";
import { getPortrait } from "../core/utils/portrait-picker";
import useCharacterMetaStore from "../core/store/character-meta.store";

export default function CharacterForm({ onPortraitChangeHandler, onNewSuggestion, onSubmitHandler, character  }: {
  onPortraitChangeHandler: (portrait: string) => void;
  onNewSuggestion: (suggestion: string) => void;
  onSubmitHandler: (character: ICharacter) => void;
  character?: ICharacter;
}) {

  const [inProgress, setInProgress] = useState(false);
  const [timeout, setDelayTimeout] = useState(0);
  const { classes, races, alignments } = useCharacterMetaStore();
  const [portraitParams, setPortraitParams] = useState({ race: '', chrClass: '' });
  const [assistantError, setAssistantError] = useState<string>();

  const formik = useFormik({
    initialValues,
    onSubmit: values => {
      onSubmitHandler(values);
      alert(JSON.stringify(values, null, 2));
    },
  });

  useEffect(() => {
    if (portraitParams.chrClass && portraitParams.race) {
      const image = getPortrait(portraitParams as any);
      onPortraitChangeHandler(image!);
    }
  }, [portraitParams])

  function portraitChange(field: string, value: string) {
    setPortraitParams({ ...portraitParams, [field]: value });
  }

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

  function getSummary() {
    if (formik.values) {
      let query = '';
      Object.keys(formik.values).forEach(key => {
        if (["race", "alignment", "class", "name"].includes(key)) {
          query += `${key}: ${formik.values[key]}, `
        }
      });
      console.log(`query: ${query}`);
      return query;
    } else {
      return null
    }
  }


  function generateBackstory() {
    const { setFieldValue } = useFormikContext();
    if (formik.values.name && formik.values.race && formik.values.chrClass && formik.values.alignment) {
      const query = getSummary();
      if(query) {
        askAssistant(
          `My character is a: ${query}, please generate a backstory for me.`,
          (res) => {
            setFieldValue('backstory', res.backstory);
          });
      }
    } else {
      setAssistantError('Please fill out name, race, class and alignment.');
    }
  }

  function roll() {
    const { setFieldValue } = useFormikContext();
     if(formik.values.race && formik.values.chrClass) {
      askAssistant(
        `My character is a ${formik.values.race} & ${formik.values.chrClass}, please roll my ability scores.`,
        (res) => {
          console.log(res);
          /* Object.keys(res.abilityScores).forEach(key => {
            setFieldValue(`abilityScores.${key}`, res.abilityScores[key]);
          }); */
        });
    } else {
      setAssistantError('Please fill out race and class.');
    }
  }

  function analyze() {
    if (formik.values.name && formik.values.race && formik.values.chrClass && formik.values.alignment) {
      const query = getSummary();
      console.log('this is the query', query);
      if(query) {
        askAssistant(`My character is a: ${query}, please analyze the character for me.`);
      }
    } else {
      setAssistantError('Please fill out name, race, class and alignment.');
    }
  }

  function resetForm() {
 /*    setFormState(initialValues);
    setError({}); */
  };


  return (
    <>
    <ErrorBoundary fallback={<ErrorBoundaryFallback errorText=""/>}>
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmitHandler}>
        {formik => (
          <Form>
            <div className="flex gap-2">
              <aside className="flex-col">
                <Field name="name" className="flex">
                  {({ field }) => (
                    <>
                      <label htmlFor="name" className="font-bold text-xs">
                        Name
                      </label>
                      <Input
                        type="text"
                        id="name"
                        placeholder="Character full name"
                        {...field}
                        className="input-override w-full !color-scheme:dark"
                      />
                      <ErrorMessage
                        component="div"
                        name="name"
                        className="error-text " />
                    </>
                  )}
                </Field>
                <Field name="chrClass">
                  {({ field }) => (
                    <>
                      <label htmlFor="chrClass" className="font-bold text-xs">
                        Class
                      </label>
                      <Select
                        {...field}
                        className="input-override w-full !color-scheme:dark"
                        onChange={(e) => {
                          field.onChange(e);
                          portraitChange('chrClass', e.target.value);
                        }}
                      >
                        <option value="">Pick a class</option>
                        {classes ? classes.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        )) : null}
                      </Select>
                      <ErrorMessage component="div" name="chrClass" className="error-text" />
                    </>
                  )}
                </Field>
              </aside>
              <aside className="flex-col">
              <Field name="race">
                  {({ field }) => (
                    <>
                      <label htmlFor="race" className="font-bold text-xs">
                        Race
                      </label>
                      <Select
                        {...field}
                        className="input-override w-full !color-scheme:dark"
                        onChange={(e) => {
                          field.onChange(e);
                          portraitChange('race', e.target.value);
                        }}
                      >
                        <option value="">Pick a race</option>
                        {races ? races.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        )) : null}
                      </Select>
                      <ErrorMessage component="div" name="race" className="error-text" />
                    </>
                  )}
                </Field>
                <Field name="alignment">
                  {({ field }) => (
                    <>
                      <label htmlFor="alignment" className="font-bold text-xs">
                      Alignment
                      </label>
                      <Select
                        {...field}
                        className="input-override w-full !color-scheme:dark"
                      >
                        <option value="">Pick an alignment</option>
                        {alignments ? alignments.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        )) : null}
                      </Select>
                      <ErrorMessage component="div" name="alignment" className="error-text" />
                    </>
                  )}
                </Field>
              </aside>
            </div>
            <div>
              <Field name="inventory">
                {({ field }) => (
                  <>
                    <label htmlFor="inventory" className="font-bold text-xs">
                      Inventory
                    </label>
                    <Textarea
                      {...field}
                      className="input-override w-full !color-scheme:dark"
                    >
                    </Textarea>
                    <ErrorMessage component="div" name="inventory" className="error-text" />
                  </>
                )}
              </Field>
              <aside className="!relative">
                <Field name="backstory">
                  {({ field }) => (
                    <>
                      <label htmlFor="backstory" className="font-bold text-xs">
                        Character backstory
                      </label>
                      <Textarea
                        {...field}
                        className="input-override w-full !color-scheme:dark"
                      >
                      </Textarea>
                      <ErrorMessage component="div" name="backstory" className="error-text" />
                      <ArrowPathIcon
                        className="absolute right-2 top-2 text-black size-5 hover:text-emerald-600 cursor-pointer" onClick={generateBackstory} />
                    </>
                  )}
                </Field>
              </aside>
              <aside className="flex gap-2">
              <Field name="abilityScores">
                  {({ field }) => (
                    <>
                      {Object.keys(field.value).map((key) => (
                        <div key={key} className="flex flex-col mb-2">
                          <label htmlFor={`abilityScores.${key}`} className="font-bold text-xs">
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </label>
                          <Input
                            type="number"
                            id={`abilityScores.${key}`}
                            {...formik.getFieldProps(`abilityScores.${key}`)}
                            className="input-override w-full !color-scheme:dark"
                          />

                        </div>
                      ))}
                    </>
                  )}
                </Field>
              </aside>
            </div>
            <nav className="flex justify-end">
              <Button className="secondary-button" type="button" onClick={resetForm}>
                Reset
              </Button>
              <Button className="outline-button ml-2" type="button" onClick={analyze} disabled={formik.isSubmitting}>
                Analyze
              </Button>
              <Button className="outline-button ml-2" type="button" onClick={roll} disabled={formik.isSubmitting}>
                Roll
              </Button>
              <Button className="primary-button ml-2" type="submit" disabled={formik.isSubmitting}>
                Submit
              </Button>
            </nav>
          </Form>
        )}
      </Formik>
    </ErrorBoundary>
    </>
  )
}

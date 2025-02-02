import * as Yup from 'yup';

import { ICharacter } from "../core/models/character";

export const initialValues: ICharacter = {
  name: "",
  race: "",
  class: "",
  alignment: "",
  abilityScores: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
  level: { level: 0, experience: 0 },
  inventory: "",
  backstory: "",
}

export const validationSchema = Yup.object({
  name: Yup.string().required('Name is required').max(50, 'Name is too long').min(3, 'Name is too short'),
  race: Yup.string().required('Race is required'),
  alignment: Yup.string().required('Alignment is required'),
  class: Yup.string().required('Class is required'),
  abilityScores: Yup.object().shape({
    str: Yup.number().required().max(25).min(1),
    dex: Yup.number().required().max(25).min(1),
    con: Yup.number().required().max(25).min(1),
    int: Yup.number().required().max(25).min(1),
    wis: Yup.number().required().max(25).min(1),
    cha: Yup.number().required().max(25).min(1)
  }),
  level: Yup.object().shape({
    level: Yup.number().required().max(20).min(0),
    experience: Yup.number().required().max(100000).min(0)
  }),
  inventory: Yup.string().required('Inventory is required'),
  backstory: Yup.string().required('Backstory is required').max(1000, 'Backstory is too long').min(1, 'Backstory is too short')
});

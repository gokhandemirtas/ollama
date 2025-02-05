import { number, object, string } from 'yup';

export const characterSchema = object({
  name: string().required('Required').max(50, 'Too long').min(3, 'Too short'),
  race: string().required('Required'),
  alignment: string().required('Required'),
  chrClass: string().required('Required'),
  abilityScores: object().shape({
    str: number().required().max(25).min(1),
    dex: number().required().max(25).min(1),
    con: number().required().max(25).min(1),
    int: number().required().max(25).min(1),
    wis: number().required().max(25).min(1),
    cha: number().required().max(25).min(1)
  }),
  level: object().shape({
    level: number().required().max(20).min(0),
    experience: number().required().max(100000).min(0)
  }),
  inventory: string().required('Required').max(500, 'Too long').min(10, 'Too short'),
  armorClass: number().required().max(18).min(0),
  proficiencies: string().required('Required').max(2000, 'Too long').min(10, 'Too short'),
  backstory: string().required('Required').max(10000, 'Too long').min(30, 'Too short')
});

export interface ICharacter {
  id?: number;
  name: string;
  race: string;
  chrClass: string;
  class?: string;
  alignment: string;
  abilityScores: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  level: {
    level: number;
    experience: number;
  };
  inventory: string;
  armorClass: number;
  proficiencies: string;
  backstory: string;
}

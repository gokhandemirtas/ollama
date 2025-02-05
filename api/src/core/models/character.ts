export interface ICharacter {
  name: string;
  race: string;
  class: string;
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
  backstory: string;
  armorClass: number;
  proficiencies: string;
  isDraft: boolean;
}

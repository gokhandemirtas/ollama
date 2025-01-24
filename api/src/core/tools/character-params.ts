export const parameters = {
  type: "object",
  properties: {
    name: {
      type: "string",
      description: `Character full name`,
    },
    race: {
      type: "string",
      description: `e.g. Human, Elf, Dwarf, Gnome, Half-Elf, Halfling`,
    },
    class: {
      type: "string",
      description: `e.g. Bard, Cleric, Druid, Mage, Fighter, Paladin, Monk, Ranger, Thief, Warlock, Witch, Shaman, Psionicist`,
    },
    alignment: {
      type: "string",
      description: `e.g. Lawful Good, Chaotic Neutral, etc. any valid dungeons and dragons alignment playable`,
    },
    abilityScores: {
      type: "object",
      description: `e.g. {str: 10, dex: 12, con: 14, int: 16, wis: 18, cha: 20}`,
    },
    level: {
      type: "object",
      description: `e.g. {level: 1, experience: 0}`,
    },
    inventory: {
      type: "string",
      description: `Comma seperated strong of weapons and items e.g. "Sword, Shield, Potion of Healing"`,
    },
    backstory: {
      type: "string",
      description: `A brief history of the character, personality traits, beliefs etc.`,
    },
  },
  required: ["name", "race", "class", "alignment", "abilityScores", "level", "inventory", "backstory"],
};

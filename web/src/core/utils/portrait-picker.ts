import { ICharacter } from "../models/character";

const portraits = import.meta.glob('../../assets/portraits/*.png', { eager: true });

export function getPortrait(character: ICharacter) {
  try {
    if (character) {
      const charRace = String(character.race).toLowerCase();
      const charClass = String(character.class).toLowerCase();
      const portraitKey = `../../assets/portraits/${charRace}-${charClass}.png`;
      return (portraits[portraitKey] as { default: string })?.default ?? (portraits['../../assets/portraits/no-portrait.png'] as { default: string }).default;
    }

  } catch (error) {
    return (portraits['../../assets/portraits/no-portrait.png'] as { default: string }).default;
  }
}

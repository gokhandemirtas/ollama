import { ICharacter } from "../models/character";

const portraits = import.meta.glob('../../assets/portraits/*.png', { eager: true });

export function getPortrait(race: string, chrClass: string): string {
  try {
    const charRace = String(race).toLowerCase();
    const charClass = String(chrClass).toLowerCase();
    const portraitKey = `../../assets/portraits/${charRace}-${charClass}.png`;
    return (portraits[portraitKey] as { default: string })?.default ?? (portraits['../../assets/portraits/no-portrait.png'] as { default: string }).default;
  } catch (error) {
    return (portraits['../../assets/portraits/no-portrait.png'] as { default: string }).default;
  }
}

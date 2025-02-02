import { ICharacter } from "../models/character";

const portraits = import.meta.glob('../../assets/portraits/*.png', { eager: true });

export function getPortrait(args: Partial<ICharacter>) {
  try {
    if (args.race && args.chrClass ) {
      const charRace = String(args.race).toLowerCase();
      const charClass = String(args.chrClass).toLowerCase();
      const portraitKey = `../../assets/portraits/${charRace}-${charClass}.png`;
      return (portraits[portraitKey] as { default: string })?.default ?? (portraits['../../assets/portraits/no-portrait.png'] as { default: string }).default;
    }

  } catch (error) {
    return (portraits['../../assets/portraits/no-portrait.png'] as { default: string }).default;
  }
}

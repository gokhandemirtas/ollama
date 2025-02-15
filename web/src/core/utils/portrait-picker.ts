import { getStorageRef } from "../services/Firebase";

export function resolvePortrait(race: string, chrClass: string): Promise<string> {
  try {
    const charRace = String(race).toLowerCase();
    const charClass = String(chrClass).toLowerCase();
    return getStorageRef(`${charRace}-${charClass}.png`)

  } catch (error) {
    return Promise.reject(error);
  }
}

import { retrieveCharacters } from "./retrieve-character.tool";
import { saveCharacter } from "./save-character.tool";

export * from "./retrieve-character.tool";
export * from "./create-character.tool";
export * from "./save-character.tool";

export default function toolPicker(name: string): Function {
  switch (name) {
    case "saveCharacter":
      return saveCharacter;
    case "retrieveCharacters":
      return retrieveCharacters;
    default:
      return () => Promise.reject("Tool not found");
  }
}

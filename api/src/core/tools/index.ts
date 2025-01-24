import { retrieveCharacters } from "./retrieve-character";
import { saveCharacter } from "./save-character";

export * from "./retrieve-character";
export * from "./create-character";
export * from "./save-character";

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

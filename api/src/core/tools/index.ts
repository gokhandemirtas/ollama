import { retrieveCharacters, retrieveSingleCharacter } from "./retrieve-character.tool";

export * from "./retrieve-character.tool";

export default function toolPicker(name: string): Function {
  switch (name) {
    case "retrieveCharacters":
      return retrieveCharacters;
    case "retrieveSingleCharacter":
        return retrieveSingleCharacter;
    default:
      return () => Promise.reject("Tool not found");
  }
}

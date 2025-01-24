import { characterSchema } from "../../../core/schemas";
import { db } from "../../../core/providers/db.provider";
import { eq } from "drizzle-orm";
import { log } from "../../../core/providers/logger.provider";

export namespace CharacterController {
  export async function fetchCharacters() {
    try {
      const characters = await db.select().from(characterSchema)
      return Promise.resolve(characters);
    } catch (error) {
      log.error(`[fetchCharacters]`, error);
      return error;
    }
  }

  export async function deleteCharacter(characterId: number) {
    try {
      await db.delete(characterSchema)
        .where(eq(characterSchema.id, characterId))
      return Promise.resolve(true);
    } catch (error) {
      log.error(`[deleteCharacter]`, error);
      return error;
    }
  }
}

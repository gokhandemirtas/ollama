import { DEFAULT_META } from "../../../core/constants/default-meta";
import { IMeta } from "../../../core/models/meta";
import { db } from "../../../core/providers/db.provider";
import { log } from "../../../core/providers/logger.provider";
import { metaSchema } from "../../../core/schemas/meta-schema";

export namespace MetaController {
  export async function fetchMeta() {
    try {
      const response = await db.select().from(metaSchema).limit(1);
      return response[0];
    } catch (error) {
      log.error(`[fetchMeta] error: ${error}`);
    }
  }

  export async function updateMeta(meta?: IMeta) {
    try {
      const done = await db.insert(metaSchema).values(DEFAULT_META)
      return done;
    } catch (error) {
      log.error(`[updateMeta] error: ${error}`);
    }
  }

}

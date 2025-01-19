import { Program } from "../schema.ts";
import { NotFoundConfigError, SetConfigError } from "../common/exception.ts";
import { KV_KEYS } from "../common/kv_key.ts";
import { Repository } from "../common/types.ts";

export class ConfigProgramRepository implements Repository<Program> {
  #kv: Deno.Kv;

  constructor(kv: Deno.Kv) {
    this.#kv = kv;
  }

  async get(): Promise<Program> {
    const result = await this.#kv.get<Program>(KV_KEYS.PROGRAMS);
    if (result.value == null) {
      throw new NotFoundConfigError({
        message: `Not Found value. key: ${JSON.stringify(KV_KEYS.PROGRAMS)}`,
      });
    }
    return result.value;
  }

  async save(value: Program): Promise<void> {
    const result = await this.#kv.set(KV_KEYS.PROGRAMS, value);
    if (!result.ok) {
      throw new SetConfigError({
        message: `Failed to set. key: ${
          JSON.stringify(KV_KEYS.PROGRAMS)
        }, value: ${JSON.stringify(value)}`,
      });
    }
  }
}

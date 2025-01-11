import { Repository } from "../common/types.ts";
import { ProgramTitle, ProgramTitleSchema } from "../schema.ts";
import { createErrorMessage } from "../common/util.ts";

export class ProgramService {
  #repository: Repository<ProgramTitle>;

  constructor(repository: Repository<ProgramTitle>) {
    this.#repository = repository;
  }

  async get(): Promise<ProgramTitle> {
    return await this.#repository.get();
  }

  async validateAndSave(value: unknown) {
    const result = ProgramTitleSchema.safeParse(value);
    if (!result.success) {
      return {
        success: false,
        message: createErrorMessage(result.error.issues),
      } as const;
    }
    await this.#repository.save(result.data);
    return { success: true, message: null } as const;
  }
}

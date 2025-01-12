import { Repository } from "../common/types.ts";
import { Program, ProgramSchema } from "../schema.ts";
import { createErrorMessage } from "../common/util.ts";

export class ProgramService {
  #repository: Repository<Program>;

  constructor(repository: Repository<Program>) {
    this.#repository = repository;
  }

  async get(): Promise<Program> {
    return await this.#repository.get();
  }

  async validateAndSave(value: unknown) {
    const result = ProgramSchema.safeParse(value);
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

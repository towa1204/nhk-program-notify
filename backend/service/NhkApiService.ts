import { Repository } from "../common/types.ts";
import { NhkApiSchema } from "../schema.ts";
import { NhkApi } from "../schema.ts";
import { createErrorMessage } from "../common/util.ts";

export class NhkApiService {
  private readonly repository: Repository<NhkApi>;

  constructor(repository: Repository<NhkApi>) {
    this.repository = repository;
  }

  async get(): Promise<NhkApi> {
    return await this.repository.get();
  }

  async validateAndSave(value: unknown) {
    const result = NhkApiSchema.safeParse(value);
    if (!result.success) {
      return {
        success: false,
        message: createErrorMessage(result.error.issues),
      } as const;
    }
    await this.repository.save(result.data);
    return { success: true, message: null } as const;
  }
}

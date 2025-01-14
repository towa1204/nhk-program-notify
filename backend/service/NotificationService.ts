import { Repository } from "../common/types.ts";
import { Notification, NotificationSchema } from "../schema.ts";
import { createErrorMessage } from "../common/util.ts";

export class NotificationService {
  private readonly repository: Repository<Notification>;

  constructor(repository: Repository<Notification>) {
    this.repository = repository;
  }

  async get(): Promise<Notification> {
    return await this.repository.get();
  }

  async validateAndSave(value: unknown) {
    const result = NotificationSchema.safeParse(value);
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

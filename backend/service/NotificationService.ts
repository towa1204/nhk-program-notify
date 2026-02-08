import { ILineClient } from "../client/LineClient.ts";
import { WatchProgram } from "../client/nhk_types.ts";
import { buildNotificationMessage } from "../common/notification_message.ts";

export interface INotificationService {
  execute: (programs: WatchProgram[]) => Promise<void>;
}

export class NotificationService implements INotificationService {
  private readonly notificationClient: ILineClient;

  constructor(notificationClient: ILineClient) {
    this.notificationClient = notificationClient;
  }

  public async execute(programs: WatchProgram[]) {
    if (programs.length === 0) {
      console.log("通知対象の番組がありません");
      return;
    }
    const message = buildNotificationMessage(programs);
    console.log(message);
    await this.notificationClient.send(message);
  }
}

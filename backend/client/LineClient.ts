import { ApiClientError } from "../common/exception.ts";

export interface ILineClient {
  send: (usedId: string, accessToken: string, message: string) => Promise<void>;
}

export class LineClient implements ILineClient {
  private static readonly MESSAGING_API_BASE_PATH = "https://api.line.me/v2";

  public async send(
    usedId: string,
    accessToken: string,
    message: string,
  ): Promise<void> {
    const payload = {
      to: usedId,
      messages: [{
        type: "text",
        text: message,
      }],
    };

    const url = `${LineClient.MESSAGING_API_BASE_PATH}/bot/message/push`;
    const res = await fetch(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) {
      throw new ApiClientError({
        url,
        status: res.status,
        responseBody: await res.text(),
        message: `LINE Messaging Push APIへの接続に失敗しました`,
      });
    }
    await res.body?.cancel();
  }
}

import { env } from "../../env.ts";
import { LineClient } from "./LineClient.ts";
import { Repository } from "../common/types.ts";
import { Notification } from "../schema.ts";

function devSetup() {
  const mockRepository: Repository<Notification> = {
    async get() {
      return await Promise.resolve({
        selectNow: "LINE",
        LineApi: {
          userid: env("TEST_LINE_API_USER_ID"),
          accessToken: env("TEST_LINE_API_TOKEN"),
        },
      });
    },
    async save(_: Notification) {},
  };
  return { mockRepository };
}

Deno.test("LineClient", async (t) => {
  await t.step({
    name: "actual send",
    ignore: true,
    fn: async () => {
      const { mockRepository } = devSetup();
      const lineClient = new LineClient(mockRepository);
      await lineClient.send("わいわい");
    },
  });
});

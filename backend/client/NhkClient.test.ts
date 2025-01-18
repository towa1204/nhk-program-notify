import { NhkClient } from "./NhkClient.ts";
import { env } from "../../env.ts";
import { Repository } from "../common/types.ts";
import { NhkApi } from "../schema.ts";

function devSetup() {
  const mockRepository: Repository<NhkApi> = {
    async get() {
      return await Promise.resolve({
        area: "横浜",
        services: ["g1", "e1"],
        nhkApiKey: env("TEST_NHK_API_KEY"),
      });
    },
    async save(_) {},
  };
  return { mockRepository };
}

// TODO: fetchをモック化してテスト

Deno.test("NhkClient", async (t) => {
  await t.step({
    name: "actual",
    ignore: true,
    fn: async () => {
      const { mockRepository } = devSetup();

      const nhkClient = new NhkClient(mockRepository);
      const res = await nhkClient.fetchPrograms("2025-01-18"); // TODO: テスト実行日の日付を取得させる
      console.log(res);
    },
  });
});

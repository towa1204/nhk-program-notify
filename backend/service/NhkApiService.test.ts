import { NhkApiRepository } from "../repository/NhkApiRepository.ts";
import { NhkApiService } from "./NhkApiService.ts";
import { setTestDataFromFile } from "../common/kv_test_helper.ts";
import { KV_KEYS } from "../common/kv_key.ts";
import { assertEquals, assertRejects } from "@std/assert";
import { NotFoundConfigError } from "../common/exception.ts";

async function setup() {
  const kv = await Deno.openKv(":memory:");
  const repository = new NhkApiRepository(kv);
  await setTestDataFromFile(
    kv,
    KV_KEYS.NHKAPI,
    "backend/testdata/config_nhkapi.json",
  );
  return { kv, repository };
}

Deno.test("NhkApiService", async (t) => {
  await t.step("データを取得できる", async () => {
    const { kv, repository } = await setup();

    const service = new NhkApiService(repository);
    const result = await service.get();
    assertEquals(result, {
      "area": "横浜",
      "services": [
        "g1",
        "e1",
      ],
      "nhkApiKey": "nhk-api-key",
    });

    kv.close();
  });

  await t.step("データがなければ例外を送出する", async () => {
    const { kv, repository } = await setup();

    await kv.delete(KV_KEYS.NHKAPI);
    const service = new NhkApiService(repository);
    await assertRejects(async () => await service.get(), NotFoundConfigError);

    kv.close();
  });

  await t.step("areaを100に変更できる", async () => {
    const { kv, repository } = await setup();

    const service = new NhkApiService(repository);
    const result = await service.validateAndSave({
      "area": "前橋",
      "services": [
        "g1",
        "e1",
      ],
      "nhkApiKey": "nhk-api-key",
    });
    assertEquals(result.success, true);
    assertEquals(result.message, null);

    kv.close();
  });

  await t.step("nhkApiKeyがなくバリデーションエラー", async () => {
    const { kv, repository } = await setup();

    const service = new NhkApiService(repository);
    const result = await service.validateAndSave({
      "area": "前橋",
      "services": [
        "g1",
        "e1",
      ],
    });
    assertEquals(result.success, false);
    assertEquals(result.message, ["nhkApiKey: Required"]);

    kv.close();
  });
});

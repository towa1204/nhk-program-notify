import { setTestDataFromFile } from "../common/kv_test_helper.ts";
import { KV_KEYS } from "../common/kv_key.ts";
import { assertEquals, assertRejects } from "@std/assert";
import { NotificationRepository } from "../repository/NotificationRepository.ts";
import { NotificationService } from "./NotificationService.ts";
import { NotFoundConfigError } from "../common/exception.ts";

async function setup() {
  const kv = await Deno.openKv(":memory:");
  const repository = new NotificationRepository(kv);
  await setTestDataFromFile(
    kv,
    KV_KEYS.NOTIFICATION,
    "backend/testdata/config_notification.json",
  );
  return { kv, repository };
}

Deno.test("NotificationService", async (t) => {
  await t.step("データを取得できる", async () => {
    const { kv, repository } = await setup();

    const service = new NotificationService(repository);
    const result = await service.get();
    assertEquals(result, {
      "selectNow": "LINE",
      "LineApi": {
        "userid": "user-id",
        "accessToken": "access-token",
      },
    });

    kv.close();
  });

  await t.step("データがなければ例外を送出する", async () => {
    const { kv, repository } = await setup();

    await kv.delete(KV_KEYS.NOTIFICATION);
    const service = new NotificationService(repository);
    await assertRejects(async () => await service.get(), NotFoundConfigError);

    kv.close();
  });

  await t.step("useridを変更できる", async () => {
    const { kv, repository } = await setup();

    const service = new NotificationService(repository);
    const result = await service.validateAndSave({
      "selectNow": "LINE",
      "LineApi": {
        "userid": "user-id-changed",
        "accessToken": "access-token",
      },
    });
    assertEquals(result.success, true);
    assertEquals(result.message, null);

    kv.close();
  });

  await t.step("accessTokenがなくバリデーションエラー", async () => {
    const { kv, repository } = await setup();

    const service = new NotificationService(repository);
    const result = await service.validateAndSave({
      "selectNow": "LINE",
      "LineApi": {
        "userid": "user-id",
      },
    });
    assertEquals(result.success, false);
    assertEquals(result.message, ["LineApi.accessToken: Required"]);

    kv.close();
  });
});

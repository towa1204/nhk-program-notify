import { afterEach, beforeEach, describe, it } from "@std/testing/bdd";
import { setTestDataFromFile } from "../common/kv_test_helper.ts";
import { KV_KEYS } from "../common/kv_key.ts";
import { assertEquals } from "@std/assert";
import { Repository } from "../common/types.ts";
import { Notification } from "../schema.ts";
import { NotificationRepository } from "../repository/NotificationRepository.ts";
import { NotificationService } from "./NotificationService.ts";

describe("NotificationService", () => {
  let kv: Deno.Kv;
  let repository: Repository<Notification>;

  beforeEach(async () => {
    kv = await Deno.openKv(":memory:");
    repository = new NotificationRepository(kv);
    await setTestDataFromFile(
      kv,
      KV_KEYS.NOTIFICATION,
      "backend/testdata/config_notification.json",
    );
  });

  afterEach(async () => {
    await kv.close();
  });

  it("get", async () => {
    const service = new NotificationService(repository);
    const result = await service.get();
    assertEquals(result, {
      "selectNow": "LINE",
      "LineApi": {
        "userID": "user-id",
        "accessToken": "access-token",
      },
    });
  });

  it("validateAndSave: userIDを変更", async () => {
    const service = new NotificationService(repository);
    const result = await service.validateAndSave({
      "selectNow": "LINE",
      "LineApi": {
        "userID": "user-id-changed",
        "accessToken": "access-token",
      },
    });
    assertEquals(result.success, true);
    assertEquals(result.message, null);
  });

  it("validateAndSave: accessTokenがない", async () => {
    const service = new NotificationService(repository);
    const result = await service.validateAndSave({
      "selectNow": "LINE",
      "LineApi": {
        "userID": "user-id",
      },
    });
    assertEquals(result.success, false);
    assertEquals(result.message, ["LineApi.accessToken: Required"]);
  });
});

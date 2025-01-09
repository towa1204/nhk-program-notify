import { KV_KEYS } from "./common/kv_key.ts";
import { setTestDataFromFile } from "./common/kv_test_helper.ts";
import { NhkApiRepository } from "./repository/NhkApiRepository.ts";
import { NotificationRepository } from "./repository/NotificationRepository.ts";
import { NhkApiService } from "./service/NhkApiService.ts";
import { NotificationService } from "./service/NotificationService.ts";

/*
 * Serviceインスタンスをシングルトンで生成
 */

const kv = await Deno.openKv(":memory:");
setTestDataFromFile(kv, KV_KEYS.NHKAPI, "backend/testdata/config_nhkapi.json");
setTestDataFromFile(
  kv,
  KV_KEYS.NOTIFICATION,
  "backend/testdata/config_notification.json",
);

function createNhkApiService(kv: Deno.Kv) {
  const repository = new NhkApiRepository(kv);
  return new NhkApiService(repository);
}
export const nhkApiService = createNhkApiService(kv);

function createNotificationService(kv: Deno.Kv) {
  const repository = new NotificationRepository(kv);
  return new NotificationService(repository);
}
export const notificationService = createNotificationService(kv);

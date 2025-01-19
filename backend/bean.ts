import { KV_KEYS } from "./common/kv_key.ts";
import { setTestDataFromFile } from "./common/kv_test_helper.ts";
import { ConfigNhkApiRepository } from "./repository/ConfigNhkApiRepository.ts";
import { ConfigNotificationRepository } from "./repository/ConfigNotificationRepository.ts";
import { ConfigProgramRepository } from "./repository/ConfigProgramRepository.ts";
import { ConfigNhkApiService } from "./service/ConfigNhkApiService.ts";
import { ConfigNotificationService } from "./service/ConfigNotificationService.ts";
import { ConfigProgramsService } from "./service/ConfigProgramsService.ts";

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
setTestDataFromFile(
  kv,
  KV_KEYS.PROGRAMS,
  "backend/testdata/config_programs.json",
);

function createNhkApiService(kv: Deno.Kv) {
  const repository = new ConfigNhkApiRepository(kv);
  return new ConfigNhkApiService(repository);
}
export const nhkApiService = createNhkApiService(kv);

function createNotificationService(kv: Deno.Kv) {
  const repository = new ConfigNotificationRepository(kv);
  return new ConfigNotificationService(repository);
}
export const notificationService = createNotificationService(kv);

function createProgramService(kv: Deno.Kv) {
  const repository = new ConfigProgramRepository(kv);
  return new ConfigProgramsService(repository);
}
export const programService = createProgramService(kv);

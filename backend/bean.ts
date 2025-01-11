import { KV_KEYS } from "./common/kv_key.ts";
import { setTestDataFromFile } from "./common/kv_test_helper.ts";
import { NhkApiRepository } from "./repository/NhkApiRepository.ts";
import { NotificationRepository } from "./repository/NotificationRepository.ts";
import { ProgramRepository } from "./repository/ProgramRepository.ts";
import { NhkApiService } from "./service/NhkApiService.ts";
import { NotificationService } from "./service/NotificationService.ts";
import { ProgramService } from "./service/ProgramService.ts";

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
  const repository = new NhkApiRepository(kv);
  return new NhkApiService(repository);
}
export const nhkApiService = createNhkApiService(kv);

function createNotificationService(kv: Deno.Kv) {
  const repository = new NotificationRepository(kv);
  return new NotificationService(repository);
}
export const notificationService = createNotificationService(kv);

function createProgramService(kv: Deno.Kv) {
  const repository = new ProgramRepository(kv);
  return new ProgramService(repository);
}
export const programService = createProgramService(kv);

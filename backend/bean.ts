import { LineClient } from "./client/LineClient.ts";
import { NhkClient } from "./client/NhkClient.ts";
import { KV_KEYS } from "./common/kv_key.ts";
import { setTestDataFromFile } from "./common/kv_test_helper.ts";
import { ConfigNhkApiRepository } from "./repository/ConfigNhkApiRepository.ts";
import { ConfigNotificationRepository } from "./repository/ConfigNotificationRepository.ts";
import { ConfigProgramRepository } from "./repository/ConfigProgramRepository.ts";
import { ConfigNhkApiService } from "./service/ConfigNhkApiService.ts";
import { ConfigNotificationService } from "./service/ConfigNotificationService.ts";
import { ConfigProgramsService } from "./service/ConfigProgramsService.ts";
import { MainFlowService } from "./service/MainFlowService.ts";
import { NhkProgramService } from "./service/NhkProgramService.ts";
import { NotificationService } from "./service/NotificationService.ts";

export function createBeans(kv: Deno.Kv) {
  const configNhkApiRepository = new ConfigNhkApiRepository(kv);
  const configNotificationRepository = new ConfigNotificationRepository(kv);
  const configProgramRepository = new ConfigProgramRepository(kv);

  const configNhkApiService = new ConfigNhkApiService(configNhkApiRepository);
  const configNotificationService = new ConfigNotificationService(
    configNotificationRepository,
  );
  const configProgramsService = new ConfigProgramsService(
    configProgramRepository,
  );

  const nhkClient = new NhkClient(configNhkApiRepository);
  const lineClient = new LineClient(configNotificationRepository);
  const nhkProgramService = new NhkProgramService(
    nhkClient,
    configProgramRepository,
  );
  const notificationService = new NotificationService(lineClient);

  const mainFlowService = new MainFlowService(
    nhkProgramService,
    notificationService,
  );

  return {
    configNhkApiService,
    configNotificationService,
    configProgramsService,
    nhkProgramService,
    notificationService,
    mainFlowService,
  };
}

const kv = await Deno.openKv(":memory:");
await setTestDataFromFile(
  kv,
  KV_KEYS.NHKAPI,
  "backend/testdata/config_nhkapi.json",
);
await setTestDataFromFile(
  kv,
  KV_KEYS.NOTIFICATION,
  "backend/testdata/config_notification.json",
);
await setTestDataFromFile(
  kv,
  KV_KEYS.PROGRAMS,
  "backend/testdata/config_programs.json",
);

export const {
  configNhkApiService,
  configNotificationService,
  configProgramsService,
  nhkProgramService,
  notificationService,
  mainFlowService,
} = createBeans(kv);

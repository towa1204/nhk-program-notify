import { KV_KEYS } from "./common/kv_key.ts";
import { setTestDataFromFile } from "./common/kv_test_helper.ts";
import { NhkApiRepository } from "./repository/NhkApiRepository.ts";
import { NhkApiService } from "./service/NhkApiService.ts";

/*
 * Serviceインスタンスをシングルトンで生成
 */

const kv = await Deno.openKv(":memory:");
setTestDataFromFile(kv, KV_KEYS.NHKAPI, "backend/testdata/config_nhkapi.json");

function createNhkApiService(kv: Deno.Kv) {
  const repository = new NhkApiRepository(kv);
  return new NhkApiService(repository);
}
export const nhkApiService = createNhkApiService(kv);

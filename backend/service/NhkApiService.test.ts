import { afterEach, beforeEach, describe, it } from "@std/testing/bdd";
import { NhkApiRepository } from "../repository/NhkApiRepository.ts";
import { NhkApiService } from "./NhkApiService.ts";
import { setTestDataFromFile } from "../common/kv_test_helper.ts";
import { KV_KEYS } from "../common/kv_key.ts";
import { assertEquals } from "@std/assert";
import { Repository } from "../common/types.ts";
import { NhkApi } from "../schema.ts";

describe("NhkApiService", () => {
  let kv: Deno.Kv;
  let repository: Repository<NhkApi>;

  beforeEach(async () => {
    kv = await Deno.openKv(":memory:");
    repository = new NhkApiRepository(kv);
    await setTestDataFromFile(
      kv,
      KV_KEYS.NHKAPI,
      "backend/testdata/config_nhkapi.json",
    );
  });

  afterEach(async () => {
    await kv.close();
  });

  it("get", async () => {
    const service = new NhkApiService(repository);
    const result = await service.get();
    assertEquals(result, {
      "area": "140",
      "services": [
        "g1",
        "e1",
      ],
      "nhkApiKey": "nhk-api-key",
    });
  });

  it("validateAndSave: areaを100に変更", async () => {
    const service = new NhkApiService(repository);
    const result = await service.validateAndSave({
      "area": "100",
      "services": [
        "g1",
        "e1",
      ],
      "nhkApiKey": "nhk-api-key",
    });
    assertEquals(result.success, true);
    assertEquals(result.message, null);
  });

  it("validateAndSave: nhkApiKeyがない", async () => {
    const service = new NhkApiService(repository);
    const result = await service.validateAndSave({
      "area": "100",
      "services": [
        "g1",
        "e1",
      ],
    });
    assertEquals(result.success, false);
    assertEquals(result.message, ["nhkApiKey: Required"]);
  });
});

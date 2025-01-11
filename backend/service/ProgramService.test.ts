import { afterEach, beforeEach, describe, it } from "@std/testing/bdd";

import { setTestDataFromFile } from "../common/kv_test_helper.ts";
import { KV_KEYS } from "../common/kv_key.ts";
import { assertEquals } from "@std/assert";
import { Repository } from "../common/types.ts";
import { ProgramTitle } from "../schema.ts";
import { ProgramRepository } from "../repository/ProgramRepository.ts";
import { ProgramService } from "./ProgramService.ts";

describe("ProgramsService", () => {
  let kv: Deno.Kv;
  let repository: Repository<ProgramTitle>;

  beforeEach(async () => {
    kv = await Deno.openKv(":memory:");
    repository = new ProgramRepository(kv);
    await setTestDataFromFile(
      kv,
      KV_KEYS.PROGRAMS,
      "backend/testdata/config_programs.json",
    );
  });

  afterEach(async () => {
    await kv.close();
  });

  it("get", async () => {
    const service = new ProgramService(repository);
    const result = await service.get();
    assertEquals(result, {
      "programs": [
        {
          "title": "100分de名著シリーズ",
        },
        {
          "title": "ザ・バックヤード",
        },
        {
          "title": "みんなのうた",
        },
      ],
    });
  });

  it("validateAndSave: みんなのうたを削除", async () => {
    const service = new ProgramService(repository);
    const result = await service.validateAndSave({
      "programs": [
        {
          "title": "100分de名著シリーズ",
        },
        {
          "title": "ザ・バックヤード",
        },
      ],
    });
    assertEquals(result.success, true);
    assertEquals(result.message, null);
  });

  it("validateAndSave: 空文字で送信", async () => {
    const service = new ProgramService(repository);
    const result = await service.validateAndSave({
      "programs": [
        {
          "title": "100分de名著シリーズ",
        },
        {
          "title": "",
        },
      ],
    });
    assertEquals(result.success, false);
    assertEquals(result.message, [
      "programs.1.title: String must contain at least 1 character(s)",
    ]);
  });
});

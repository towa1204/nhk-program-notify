import { afterEach, beforeEach, describe, it } from "@std/testing/bdd";

import { setTestDataFromFile } from "../common/kv_test_helper.ts";
import { KV_KEYS } from "../common/kv_key.ts";
import { assertEquals, assertRejects } from "@std/assert";
import { Repository } from "../common/types.ts";
import { Program } from "../schema.ts";
import { ProgramRepository } from "../repository/ProgramRepository.ts";
import { ProgramService } from "./ProgramService.ts";
import { NotFoundConfigError } from "../common/exception.ts";

describe("ProgramsService", () => {
  let kv: Deno.Kv;
  let repository: Repository<Program>;

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

  it("get: データがセットされており取得可", async () => {
    const service = new ProgramService(repository);
    const result = await service.get();
    assertEquals(result, {
      "programs": [
        {
          "enabled": true,
          "title": "100分de名著シリーズ",
        },
        {
          "enabled": true,
          "title": "ザ・バックヤード",
        },
        {
          "enabled": false,
          "title": "みんなのうた",
        },
      ],
    });
  });

  it("get: データがセットされておらず例外を送出", async () => {
    await kv.delete(KV_KEYS.PROGRAMS);
    const service = new ProgramService(repository);
    await assertRejects(async () => await service.get(), NotFoundConfigError);
  });

  it("validateAndSave: みんなのうたを削除", async () => {
    const service = new ProgramService(repository);
    const result = await service.validateAndSave({
      "programs": [
        {
          "enabled": true,
          "title": "100分de名著シリーズ",
        },
        {
          "enabled": true,
          "title": "ザ・バックヤード",
        },
      ],
    });
    assertEquals(result.success, true);
    assertEquals(result.message, null);
  });

  it("validateAndSave: すべての番組を削除", async () => {
    const service = new ProgramService(repository);
    const result = await service.validateAndSave({
      "programs": [],
    });
    assertEquals(result.success, true);
    assertEquals(result.message, null);
  });

  it("validateAndSave: 空文字で送信", async () => {
    const service = new ProgramService(repository);
    const result = await service.validateAndSave({
      "programs": [
        {
          "enabled": true,
          "title": "100分de名著シリーズ",
        },
        {
          "enabled": true,
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

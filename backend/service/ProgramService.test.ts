import { setTestDataFromFile } from "../common/kv_test_helper.ts";
import { KV_KEYS } from "../common/kv_key.ts";
import { assertEquals, assertRejects } from "@std/assert";
import { ProgramRepository } from "../repository/ProgramRepository.ts";
import { ProgramService } from "./ProgramService.ts";
import { NotFoundConfigError } from "../common/exception.ts";

async function setup() {
  const kv = await Deno.openKv(":memory:");
  const repository = new ProgramRepository(kv);
  await setTestDataFromFile(
    kv,
    KV_KEYS.PROGRAMS,
    "backend/testdata/config_programs.json",
  );
  return { kv, repository };
}

Deno.test("ProgramsService", async (t) => {
  await t.step("データを取得できる", async () => {
    const { kv, repository } = await setup();

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

    kv.close();
  });

  await t.step("データがなければ例外を送出する", async () => {
    const { kv, repository } = await setup();

    await kv.delete(KV_KEYS.PROGRAMS);
    const service = new ProgramService(repository);
    await assertRejects(async () => await service.get(), NotFoundConfigError);

    kv.close();
  });

  await t.step("番組(みんなのうた)を削除できる", async () => {
    const { kv, repository } = await setup();

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

    kv.close();
  });

  await t.step("すべての番組を削除できる", async () => {
    const { kv, repository } = await setup();

    const service = new ProgramService(repository);
    const result = await service.validateAndSave({
      "programs": [],
    });
    assertEquals(result.success, true);
    assertEquals(result.message, null);

    kv.close();
  });

  await t.step("番組を空文字で送信するとバリデーションエラー", async () => {
    const { kv, repository } = await setup();

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

    kv.close();
  });
});

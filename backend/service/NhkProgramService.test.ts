import { assertEquals } from "@std/assert";
import { INhkClient } from "../client/NhkClient.ts";
import { Repository } from "../common/types.ts";
import { ConfigProgram } from "../schema.ts";
import { NhkProgramService } from "./NhkProgramService.ts";
import { assertSpyCalls, returnsNext, stub } from "@std/testing/mock";
import {
  allPrograms,
  allWatchPrograms,
  configProgram,
} from "../testdata/sample.ts";

Deno.test("NhkProgramService", async (t) => {
  const mockNhkApiClient: INhkClient = {
    fetchPrograms: async (_: string) => {
      return await Promise.resolve([]);
    },
  };
  await t.step("2日分の番組情報から視聴番組を抽出できている", async () => {
    using nhkApiClientStub = stub(
      mockNhkApiClient,
      "fetchPrograms",
      returnsNext([
        Promise.resolve(allPrograms),
        Promise.resolve([]),
      ]),
    );
    const mockRepository: Repository<ConfigProgram> = {
      async get() {
        return await Promise.resolve(configProgram);
      },
      async save(_) {},
    };

    const nhkProgramService = new NhkProgramService(
      mockNhkApiClient,
      mockRepository,
    );
    const programs = await nhkProgramService.listByDates([
      "2026-02-08",
      "2026-02-09",
    ]);

    assertEquals(programs, allWatchPrograms);
    assertSpyCalls(nhkApiClientStub, 2);
  });

  await t.step("番組情報がないときは何も返さない", async () => {
    const mockRepository: Repository<ConfigProgram> = {
      async get() {
        return await Promise.resolve(configProgram);
      },
      async save(_) {},
    };

    const nhkProgramService = new NhkProgramService(
      mockNhkApiClient,
      mockRepository,
    );
    const programs = await nhkProgramService.listByDates(["2026-02-08"]);

    assertEquals(programs, []);
  });

  await t.step("視聴番組がないときは何も返さない", async () => {
    using nhkApiClientStub = stub(
      mockNhkApiClient,
      "fetchPrograms",
      returnsNext([
        Promise.resolve(allPrograms),
      ]),
    );
    const mockRepository: Repository<ConfigProgram> = {
      async get() {
        return await Promise.resolve({
          programs: [],
        });
      },
      async save(_) {},
    };

    const nhkProgramService = new NhkProgramService(
      mockNhkApiClient,
      mockRepository,
    );
    const programs = await nhkProgramService.listByDates(["2026-02-08"]);

    assertEquals(programs, []);
    assertSpyCalls(nhkApiClientStub, 1);
  });

  await t.step("findByTitleInDatesで部分一致が取得できる", async () => {
    using nhkApiClientStub = stub(
      mockNhkApiClient,
      "fetchPrograms",
      returnsNext([
        Promise.resolve(allPrograms),
      ]),
    );
    const mockRepository: Repository<ConfigProgram> = {
      async get() {
        return await Promise.resolve({ programs: [] });
      },
      async save(_) {},
    };

    const nhkProgramService = new NhkProgramService(
      mockNhkApiClient,
      mockRepository,
    );

    const programs = await nhkProgramService.findByTitleInDates([
      "2026-02-08",
    ], "大相撲");

    assertEquals(programs.length, 1);
    assertEquals(
      programs[0].title,
      "大相撲（２０２６年）　幕内の全取組　初場所　七日目",
    );
    assertSpyCalls(nhkApiClientStub, 1);
  });

  await t.step("findByTitleInDatesで一致しない場合は空配列", async () => {
    using nhkApiClientStub = stub(
      mockNhkApiClient,
      "fetchPrograms",
      returnsNext([
        Promise.resolve(allPrograms),
      ]),
    );
    const mockRepository: Repository<ConfigProgram> = {
      async get() {
        return await Promise.resolve({ programs: [] });
      },
      async save(_) {},
    };

    const nhkProgramService = new NhkProgramService(
      mockNhkApiClient,
      mockRepository,
    );

    const programs = await nhkProgramService.findByTitleInDates([
      "2026-02-08",
    ], "存在しないタイトル");

    assertEquals(programs, []);
    assertSpyCalls(nhkApiClientStub, 1);
  });
});

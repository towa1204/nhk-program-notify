import { BroadcastEvent, WatchProgram } from "../client/nhk_types.ts";
import { INhkClient } from "../client/NhkClient.ts";
import { Repository } from "../common/types.ts";
import { ConfigProgram } from "../schema.ts";

export interface INhkProgramService {
  /**
   * 指定した日付の視聴番組を取得する
   * @param dates 取得する日付のリスト(YYYY-MM-DD形式)
   * @returns 視聴番組のリスト
   */
  listByDates: (dates: string[]) => Promise<WatchProgram[]>;
}

export class NhkProgramService implements INhkProgramService {
  private readonly nhkClient: INhkClient;
  private readonly repository: Repository<ConfigProgram>;

  constructor(nhkClient: INhkClient, repository: Repository<ConfigProgram>) {
    this.nhkClient = nhkClient;
    this.repository = repository;
  }

  public async listByDates(dates: string[]) {
    const allPrograms: BroadcastEvent[] = [];
    for (const date of dates) {
      const programs = await this.nhkClient.fetchPrograms(date);
      allPrograms.push(...programs);
    }

    return this.selectSubscribePrograms(allPrograms);
  }

  private async selectSubscribePrograms(
    programs: BroadcastEvent[],
  ): Promise<WatchProgram[]> {
    const keywords = (await this.repository.get()).programs;
    return programs.filter((program) =>
      keywords.some((keyword) =>
        keyword.enabled && program.name.includes(keyword.title)
      )
    )
      .map((program) => ({
        "title": program.name ?? "",
        "subtitle": program.description ?? "",
        "content": program.detailedDescription?.epg200 ?? "",
        "act": this.buildAct(program),
        "genres": program.identifierGroup?.genre?.map((genre) => genre.id) ??
          [],
        "start_time": program.startDate ?? "",
        "end_time": program.endDate ?? "",
      }));
  }

  private buildAct(program: BroadcastEvent): string {
    const actList = program.misc?.actList ?? [];
    return actList.map((act) => {
      if (!act.role) {
        return act.name;
      }
      const separator = act.role.endsWith("：") ? "" : "：";
      return `${act.role}${separator}${act.name}`;
    }).join("、");
  }
}

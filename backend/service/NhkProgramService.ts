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
  /**
   * 指定した日付の番組をタイトル検索する
   * @param dates 取得する日付のリスト(YYYY-MM-DD形式)
   * @param title 検索対象のタイトル(部分一致)
   * @returns 視聴番組のリスト
   */
  findByTitleInDates: (
    dates: string[],
    title: string,
  ) => Promise<WatchProgram[]>;
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

  public async findByTitleInDates(dates: string[], title: string) {
    const allPrograms: BroadcastEvent[] = [];
    for (const date of dates) {
      const programs = await this.nhkClient.fetchPrograms(date);
      allPrograms.push(...programs);
    }

    return this.selectProgramsByTitle(allPrograms, title);
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
      .map((program) => this.toWatchProgram(program));
  }

  private selectProgramsByTitle(
    programs: BroadcastEvent[],
    title: string,
  ): WatchProgram[] {
    return programs.filter((program) => program.name?.includes(title))
      .map((program) => this.toWatchProgram(program));
  }

  private toWatchProgram(program: BroadcastEvent): WatchProgram {
    return {
      "title": program.name ?? "",
      "subtitle": program.description ?? "",
      "content": program.detailedDescription?.epg200 ?? "",
      "act": this.buildAct(program),
      "genres": program.identifierGroup?.genre?.map((genre) => genre.id) ?? [],
      "start_time": program.startDate ?? "",
      "end_time": program.endDate ?? "",
    };
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

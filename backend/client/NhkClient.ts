import { ApiClientError } from "../common/exception.ts";
import { ProgramList, ProgramListReq } from "./nhk_types.ts";

export interface INhkClient {
  send: (req: ProgramListReq) => Promise<ProgramList>;
}

export class NhkClient implements INhkClient {
  private static readonly API_BASE_PATH = "https://api.nhk.or.jp/v2";

  public static readonly AREA_MASTER_MAP: Map<string, string> = new Map([
    ["札幌", "010"],
    ["函館", "011"],
    ["旭川", "012"],
    ["帯広", "013"],
    ["釧路", "014"],
    ["北見", "015"],
    ["室蘭", "016"],
    ["青森", "020"],
    ["盛岡", "030"],
    ["仙台", "040"],
    ["秋田", "050"],
    ["山形", "060"],
    ["福島", "070"],
    ["水戸", "080"],
    ["宇都宮", "090"],
    ["前橋", "100"],
    ["さいたま", "110"],
    ["千葉", "120"],
    ["東京", "130"],
    ["横浜", "140"],
    ["新潟", "150"],
    ["富山", "160"],
    ["金沢", "170"],
    ["福井", "180"],
    ["甲府", "190"],
    ["長野", "200"],
    ["岐阜", "210"],
    ["静岡", "220"],
    ["名古屋", "230"],
    ["津", "240"],
    ["大津", "250"],
    ["京都", "260"],
    ["大阪", "270"],
    ["神戸", "280"],
    ["奈良", "290"],
    ["和歌山", "300"],
    ["鳥取", "310"],
    ["松江", "320"],
    ["岡山", "330"],
    ["広島", "340"],
    ["山口", "350"],
    ["徳島", "360"],
    ["高松", "370"],
    ["松山", "380"],
    ["高知", "390"],
    ["福岡", "400"],
    ["北九州", "401"],
    ["佐賀", "410"],
    ["長崎", "420"],
    ["熊本", "430"],
    ["大分", "440"],
    ["宮崎", "450"],
    ["鹿児島", "460"],
    ["沖縄", "470"],
  ]);

  public async send(
    programListReq: ProgramListReq,
  ): Promise<ProgramList> {
    const url = this.buildUrl(programListReq);

    const res = await fetch(url);
    if (!res.ok) {
      throw new ApiClientError({
        url,
        status: res.status,
        responseBody: await res.text(),
        message: "ProgramList APIへの接続に失敗しました",
      });
    }
    return await res.json() as ProgramList;
  }

  private buildUrl({ area, service, date, apikey }: ProgramListReq) {
    const areaNumber = NhkClient.AREA_MASTER_MAP.get(area);
    return `${NhkClient.API_BASE_PATH}/pg/list/${areaNumber}/${service}/${date}.json?key=${apikey}`;
  }
}

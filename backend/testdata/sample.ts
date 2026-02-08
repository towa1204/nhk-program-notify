import { BroadcastEvent, WatchProgram } from "../client/nhk_types.ts";
import { ConfigProgram } from "../schema.ts";

export const configProgram: ConfigProgram = {
  "programs": [
    {
      "enabled": true,
      "title": "こころの時代選",
    },
    {
      "enabled": false,
      "title": "ＮＨＫ短歌",
    },
    {
      "enabled": true,
      "title": "大相撲",
    },
  ],
};

const e1Programs: BroadcastEvent[] = [
  {
    "id": "e1-130-202602080001",
    "name":
      "こころの時代選　宮沢賢治　久遠の宇宙に生きる（４）あまねく「いのち」を見つめて",
    "description":
      "今年没後９０年を迎える宮沢賢治。名作を生む原動力となった知られざる宗教観に迫るシリーズ。",
    "startDate": "2026-02-08T05:00:00+09:00",
    "endDate": "2026-02-08T06:00:00+09:00",
    "identifierGroup": {
      "genre": [
        { "id": "0804" },
        { "id": "1011" },
        { "id": "1102" },
      ],
    },
    "misc": {
      "actList": [
        { "role": "出演", "name": "東京立正短期大学名誉教授…北川前肇" },
        { "role": "朗読", "name": "加瀬亮" },
      ],
    },
    "detailedDescription": {
      "epg200":
        "２４歳で逝去した妹トシは賢治にとって「信仰をともにする唯一の道連れ」と呼ぶほどの存在だった。",
    },
  },
  {
    "id": "e1-130-202602080002",
    "name": "ＮＨＫ短歌“ものがたり”の深みへ　テーマ「踊る」",
    "description":
      "大森静佳さんが選者の「“ものがたり”の深みへ」。今回のテーマは「踊る」。",
    "startDate": "2026-02-08T06:00:00+09:00",
    "endDate": "2026-02-08T06:25:00+09:00",
    "identifierGroup": {
      "genre": [
        { "id": "1011" },
      ],
    },
    "misc": {
      "actList": [
        { "role": "司会", "name": "尾崎世界観" },
      ],
    },
    "detailedDescription": {
      "epg200": "今回は、おなじみの日本の昔話の一編を取り上げて、その深みへ。",
    },
  },
];

const g1Programs: BroadcastEvent[] = [
  {
    "id": "g1-130-202602080003",
    "name": "大相撲（２０２６年）　幕内の全取組　初場所　七日目",
    "description": "",
    "startDate": "2026-02-08T03:55:00+09:00",
    "endDate": "2026-02-08T04:20:00+09:00",
    "identifierGroup": {
      "genre": [
        { "id": "0105" },
        { "id": "0100" },
        { "id": "0804" },
      ],
    },
    "misc": {
      "actList": [],
    },
    "detailedDescription": {
      "epg200": "",
    },
  },
];

export const allPrograms: BroadcastEvent[] = [...e1Programs, ...g1Programs];

const e1WatchPrograms: WatchProgram[] = [
  {
    "title":
      "こころの時代選　宮沢賢治　久遠の宇宙に生きる（４）あまねく「いのち」を見つめて",
    "subtitle":
      "今年没後９０年を迎える宮沢賢治。名作を生む原動力となった知られざる宗教観に迫るシリーズ。",
    "content":
      "２４歳で逝去した妹トシは賢治にとって「信仰をともにする唯一の道連れ」と呼ぶほどの存在だった。",
    "act": "出演：東京立正短期大学名誉教授…北川前肇、朗読：加瀬亮",
    "genres": [
      "0804",
      "1011",
      "1102",
    ],
    "start_time": "2026-02-08T05:00:00+09:00",
    "end_time": "2026-02-08T06:00:00+09:00",
  },
];

const g1WatchPrograms: WatchProgram[] = [
  {
    "title": "大相撲（２０２６年）　幕内の全取組　初場所　七日目",
    "subtitle": "",
    "content": "",
    "act": "",
    "genres": [
      "0105",
      "0100",
      "0804",
    ],
    "start_time": "2026-02-08T03:55:00+09:00",
    "end_time": "2026-02-08T04:20:00+09:00",
  },
];

export const allWatchPrograms: WatchProgram[] = [
  ...e1WatchPrograms,
  ...g1WatchPrograms,
];

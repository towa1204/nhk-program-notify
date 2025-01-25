import { ILineClient } from "../client/LineClient.ts";
import { NotificationService } from "./NotificationService.ts";
import { WatchProgram } from "../client/nhk_types.ts";
import { assertSpyCallAsync, assertSpyCalls, spy } from "@std/testing/mock";

Deno.test("NotificationService", async (t) => {
  const mockLineClient: ILineClient = {
    send: async (message: string) => {
      console.log(message);
      return await Promise.resolve();
    },
  };

  await t.step("executeで送信するメッセージが正しい", async () => {
    const programs: WatchProgram[] = [
      {
        title:
          "こころの時代選　宮沢賢治　久遠の宇宙に生きる（４）あまねく「いのち」を見つめて",
        subtitle:
          "今年没後９０年を迎える宮沢賢治。名作を生む原動力となった知られざる宗教観に迫るシリーズ。第４回は最愛の妹トシとの死別がもたらした賢治の死生観を連作詩から探る。",
        content:
          "２４歳で逝去した妹トシは賢治にとって「信仰をともにする唯一の道連れ」と呼ぶほどの存在だった。その死の日に作った詩「永訣の朝」「松の針」からうかがえる賢治の慟哭。そして、８か月後に書かれた「青森挽歌」「オホーツク挽歌」の詩から読み取れる賢治の「死」のとらえ方。そこに見える「法華経」「歎異抄」などの影響をあげながら、仏教の視点から読み解く賢治の晩年の死生観とトシの生き方に見られる菩薩道について考える。",
        act:
          "【出演】東京立正短期大学名誉教授…北川前肇，【朗読】加瀬亮，井上二郎，【語り】守本奈実",
        genres: [
          "0804",
          "1011",
          "1102",
        ],
        start_time: "2025-01-19T05:00:00+09:00",
        end_time: "2025-01-19T06:00:00+09:00",
      },
      {
        title: "ＮＨＫ短歌“ものがたり”の深みへ　テーマ「踊る」",
        subtitle:
          "大森静佳さんが選者の「“ものがたり”の深みへ」。今回のテーマは「踊る」。ゲストは作家で、歌集も出版している町田康さん。司会はミュージシャンの尾崎世界観さん。",
        content:
          "大森静佳さんが選者の「“ものがたり”の深みへ」。今回のテーマは「踊る」。ゲストは作家で、歌集も出版している町田康さん。今回は、おなじみの日本の昔話の一編を取り上げて、その深みへ。町田さん自身の現代語訳も紹介、本人による朗読も見どころ。大森さんは、独特の言葉のリズムを生かした短歌を詠むことに挑戦。「踊る」をテーマにした投稿歌から、入選作品９首も紹介。司会はミュージシャンの尾崎世界観さん。",
        act: "【司会】尾崎世界観，【出演】大森静佳，【ゲスト】町田康，宮田愛萌",
        genres: [
          "1011",
        ],
        start_time: "2025-01-19T06:00:00+09:00",
        end_time: "2025-01-19T06:25:00+09:00",
      },
    ];
    using lineClientSpy = spy(mockLineClient, "send");

    const notificationService = new NotificationService(mockLineClient);
    await notificationService.execute(programs);

    await assertSpyCallAsync(lineClientSpy, 0, {
      args: [
        "[1] 01/19 05:00 ~ 01/19 06:00\n" +
        "こころの時代選　宮沢賢治　久遠の宇宙に生きる（４）あまねく「いのち」を見つめて\n\n" +
        "[2] 01/19 06:00 ~ 01/19 06:25\n" +
        "ＮＨＫ短歌“ものがたり”の深みへ　テーマ「踊る」",
      ],
    });
    assertSpyCalls(lineClientSpy, 1);
  });

  await t.step("視聴番組が1件もないときは何も送信しない", async () => {
    const programs: WatchProgram[] = [];
    using lineClientSpy = spy(mockLineClient, "send");

    const notificationService = new NotificationService(mockLineClient);
    await notificationService.execute(programs);

    assertSpyCalls(lineClientSpy, 0);
  });
});

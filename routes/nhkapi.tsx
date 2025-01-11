import { Handlers, PageProps } from "$fresh/server.ts";
import Select from "../components/Select.tsx";
import SaveButton from "../components/SaveButton.tsx";
import Input from "../islands/Input.tsx";
import {
  getErrorMessageOnCookie,
  setErrorMessageOnCookie,
} from "../backend/cookie.ts";
import { nhkApiService } from "../backend/bean.ts";
import { NhkApi } from "../backend/schema.ts";
import { WithErrorMessage } from "./types.ts";
import { HomeButton } from "../components/HomeButton.tsx";

const AREA_MASTER = [
  { value: "010", label: "札幌" },
  { value: "011", label: "函館" },
  { value: "012", label: "旭川" },
  { value: "013", label: "帯広" },
  { value: "014", label: "釧路" },
  { value: "015", label: "北見" },
  { value: "016", label: "室蘭" },
  { value: "020", label: "青森" },
  { value: "030", label: "盛岡" },
  { value: "040", label: "仙台" },
  { value: "050", label: "秋田" },
  { value: "060", label: "山形" },
  { value: "070", label: "福島" },
  { value: "080", label: "水戸" },
  { value: "090", label: "宇都宮" },
  { value: "100", label: "前橋" },
  { value: "110", label: "さいたま" },
  { value: "120", label: "千葉" },
  { value: "130", label: "東京" },
  { value: "140", label: "横浜" },
  { value: "150", label: "新潟" },
  { value: "160", label: "富山" },
  { value: "170", label: "金沢" },
  { value: "180", label: "福井" },
  { value: "190", label: "甲府" },
  { value: "200", label: "長野" },
  { value: "210", label: "岐阜" },
  { value: "220", label: "静岡" },
  { value: "230", label: "名古屋" },
  { value: "240", label: "津" },
  { value: "250", label: "大津" },
  { value: "260", label: "京都" },
  { value: "270", label: "大阪" },
  { value: "280", label: "神戸" },
  { value: "290", label: "奈良" },
  { value: "300", label: "和歌山" },
  { value: "310", label: "鳥取" },
  { value: "320", label: "松江" },
  { value: "330", label: "岡山" },
  { value: "340", label: "広島" },
  { value: "350", label: "山口" },
  { value: "360", label: "徳島" },
  { value: "370", label: "高松" },
  { value: "380", label: "松山" },
  { value: "390", label: "高知" },
  { value: "400", label: "福岡" },
  { value: "401", label: "北九州" },
  { value: "410", label: "佐賀" },
  { value: "420", label: "長崎" },
  { value: "430", label: "熊本" },
  { value: "440", label: "大分" },
  { value: "450", label: "宮崎" },
  { value: "460", label: "鹿児島" },
  { value: "470", label: "沖縄" },
];

export const handler: Handlers = {
  async GET(req, ctx) {
    const { message, resHeaders } = getErrorMessageOnCookie(req.headers);

    const nhkapiProps = await nhkApiService.get();

    const initData: WithErrorMessage<NhkApi> = {
      ...nhkapiProps,
      errorMessage: message,
    };

    return ctx.render(initData, { headers: resHeaders });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const areaNumber = form.get("areaNumber") as string;
    const apiKey = form.get("apiKey") as string;

    const resHeaders = new Headers({
      "Location": ctx.url.pathname,
    });

    const result = await nhkApiService.validateAndSave({
      area: areaNumber,
      services: ["g1", "e1"],
      nhkApiKey: apiKey,
    });
    if (!result.success) {
      setErrorMessageOnCookie(resHeaders, result.message.join("\n"));
    }

    return new Response(null, {
      status: 303,
      headers: resHeaders,
    });
  },
};

export default function NhkApiPage(
  { data }: PageProps<WithErrorMessage<NhkApi>>,
) {
  const { area, nhkApiKey, errorMessage } = data;

  return (
    <>
      <div className="rounded-md border border-gray-200/60 bg-gray-100/30 p-6">
        <header className="mb-4 flex justify-between gap-3">
          <hgroup>
            <h2 className="text-lg font-medium !leading-none text-black">
              NHK API
            </h2>
            <h3 className="mt-1 !leading-tight text-gray-500">
              放送エリアとAPIキーを設定
            </h3>
          </hgroup>
        </header>

        {errorMessage && (
          <div
            class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 whitespace-pre-wrap"
            role="alert"
          >
            {errorMessage}
          </div>
        )}

        <form method="post">
          <Select
            name="areaNumber"
            selected={area}
            options={AREA_MASTER}
          />
          <Input
            name="apiKey"
            placeholder="NHK APIキー"
            isSecret
            value={nhkApiKey}
          />
          <div className="mt-3">
            <SaveButton isDisabled={false} />
          </div>
        </form>
      </div>
      <div class="mt-2">
        <HomeButton />
      </div>
    </>
  );
}

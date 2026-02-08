import { Handlers } from "$fresh/server.ts";
import { nhkProgramService } from "../../backend/bean.ts";
import { week } from "../../backend/common/date.ts";
import { buildNotificationMessage } from "../../backend/common/notification_message.ts";

type ProgramCheckRequest = {
  title: string;
};

type ProgramCheckResponse = {
  found: boolean;
  message: string;
};

export const handler: Handlers = {
  async POST(req) {
    try {
      const body = await req.json() as ProgramCheckRequest;
      const title = (body.title ?? "").trim();

      if (!title) {
        return Response.json(
          {
            found: false,
            message: "番組名を入力してください",
          } satisfies ProgramCheckResponse,
          { status: 400 },
        );
      }

      const programs = await nhkProgramService.findByTitleInDates(
        week(new Date()),
        title,
      );

      if (programs.length === 0) {
        return Response.json(
          {
            found: false,
            message: "該当する番組は見つかりませんでした",
          } satisfies ProgramCheckResponse,
        );
      }

      const firstMessage = buildNotificationMessage([programs[0]]);
      const extraCount = programs.length - 1;
      const message = extraCount > 0
        ? `${firstMessage}\n\n他${extraCount}件あります`
        : firstMessage;

      return Response.json(
        { found: true, message } satisfies ProgramCheckResponse,
      );
    } catch (error) {
      const detail = error instanceof Error ? error.message : "不明なエラー";
      return Response.json(
        {
          found: false,
          message: `番組チェックに失敗しました: ${detail}`,
        } satisfies ProgramCheckResponse,
        { status: 500 },
      );
    }
  },
};

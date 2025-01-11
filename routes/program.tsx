import { Handlers, PageProps } from "$fresh/server.ts";
import { programService } from "../backend/bean.ts";
import {
  getErrorMessageOnCookie,
  setErrorMessageOnCookie,
} from "../backend/cookie.ts";
import { ProgramTitle } from "../backend/schema.ts";
import ProgramForm from "../islands/PrgoramForm.tsx";
import { WithErrorMessage } from "./types.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const { message, resHeaders } = getErrorMessageOnCookie(req.headers);

    const programTitlesProps = await programService.get();

    const initData: WithErrorMessage<ProgramTitle> = {
      ...programTitlesProps,
      errorMessage: message,
    };

    return ctx.render(initData, { headers: resHeaders });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    console.log(form.getAll("programs"));

    const resHeaders = new Headers({
      "Location": ctx.url.pathname,
    });

    const result = await programService.validateAndSave({
      programs: form.getAll("programs").map((title) => ({ title })),
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

export default function ProgramPage(
  { data }: PageProps<WithErrorMessage<ProgramTitle>>,
) {
  const { errorMessage } = data;

  return (
    <div className="rounded-md border border-gray-200/60 bg-gray-100/30 p-6">
      <header className="mb-4 flex justify-between gap-3">
        <hgroup>
          <h2 className="text-lg font-medium !leading-none text-black">
            Program
          </h2>
          <h3 className="mt-1 !leading-tight text-gray-500">
            Set programs to be notified
          </h3>
        </hgroup>
      </header>

      {errorMessage != undefined && (
        <div
          class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      <ProgramForm initialPrograms={data} />
    </div>
  );
}

import { FreshContext } from "$fresh/server.ts";
import { basicAuth } from "https://deno.land/x/basic_auth@v1.1.1/mod.ts";
import { BASIC_AUTH_PASSWORD, BASIC_AUTH_USER } from "../env.ts";

export async function handler(
  req: Request,
  ctx: FreshContext,
) {
  const unauthorized = basicAuth(req, "nhk-program-notify", {
    [BASIC_AUTH_USER]: BASIC_AUTH_PASSWORD,
  });
  // TODO: エラーページへ遷移する
  if (unauthorized) return unauthorized;

  return await ctx.next();
}

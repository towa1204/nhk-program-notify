import { describe, it } from "@std/testing/bdd";
import { env } from "../../env.ts";
import { LineClient } from "./LineClient.ts";

describe("LineClient", () => {
  it.ignore("actual", async () => {
    const lineClient = new LineClient();
    await lineClient.send(
      env("TEST_LINE_API_USER_ID"),
      env("TEST_LINE_API_TOKEN"),
      "わいわい",
    );
  });
});

import { describe, it } from "@std/testing/bdd";
import { NhkClient } from "./NhkClient.ts";
import { env } from "../../env.ts";

describe("NhkClient", () => {
  it.ignore("actual", async () => {
    const nhkClient = new NhkClient();
    const apiKey = env("TEST_NHK_API_KEY");
    const res = await nhkClient.send({
      area: "横浜",
      service: "g1",
      date: "2025-01-13",
      apikey: apiKey,
    });
    console.log(res);
  });
});

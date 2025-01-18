// import { beforeEach, describe, it } from "@std/testing/bdd";
// import { env } from "../../env.ts";
// import { LineClient } from "./LineClient.ts";
// import { Repository } from "../common/types.ts";
// import { Notification } from "../schema.ts";

// describe("LineClient", () => {
//   let repository: Repository<Notification>;
//   beforeEach(() => {
//     repository = {
//       async get() {
//         return await Promise.resolve({
//           selectNow: "LINE",
//           LineApi: {
//             userid: env("TEST_LINE_API_USER_ID"),
//             accessToken: env("TEST_LINE_API_TOKEN"),
//           },
//         });
//       },
//       async save(_: Notification) {},
//     };
//   });

//   it("actual", async () => {
//     const lineClient = new LineClient(repository);
//     await lineClient.send("わいわい");
//   });
// });

import { z } from "zod";

export const ProgramSchema = z.object({
  programs: z.array(
    z.object({
      enabled: z.boolean(),
      title: z.string().nonempty(),
    }),
  ),
});
export type Program = z.infer<typeof ProgramSchema>;

export const NhkApiSchema = z.object({
  area: z.string(),
  services: z.array(z.string()),
  nhkApiKey: z.string().nonempty(),
});
export type NhkApi = z.infer<typeof NhkApiSchema>;

export const NotificationSchema = z.object({
  selectNow: z.literal("LINE"),
  LineApi: z.object({
    userID: z.string().nonempty(),
    accessToken: z.string().nonempty(),
  }),
});
export type Notification = z.infer<typeof NotificationSchema>;

export const ConfigSchema = ProgramSchema
  .merge(NhkApiSchema)
  .merge(NotificationSchema);

export type Config = z.infer<typeof ConfigSchema>;

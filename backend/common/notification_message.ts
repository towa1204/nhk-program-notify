import { WatchProgram } from "../client/nhk_types.ts";
import { toJSTMMDDhhmmFormat } from "./date.ts";

export function buildNotificationMessage(programs: WatchProgram[]): string {
  return programs.map((program, index) => {
    const startMMDDhhmm = toJSTMMDDhhmmFormat(program.start_time);
    const endMMDDhhmm = toJSTMMDDhhmmFormat(program.end_time);
    return [
      `[${index + 1}] ${startMMDDhhmm} ~ ${endMMDDhhmm}`,
      `${program.title}`,
    ].join("\n");
  }).join("\n\n");
}

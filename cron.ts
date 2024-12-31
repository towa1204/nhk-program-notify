export function cron() {
  Deno.cron("execute every minute", "* * * * *", () => {
    console.log("Hello World!!");
  });
}

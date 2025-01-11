function env(key: string) {
  const value = Deno.env.get(key);
  if (value === undefined) {
    throw new Error(`env: ${key} is not found`);
  }
  return value;
}

export const BASIC_AUTH_USER = env("BASIC_AUTH_USER");
export const BASIC_AUTH_PASSWORD = env("BASIC_AUTH_PASSWORD");

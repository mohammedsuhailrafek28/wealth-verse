const isProduction = process.env.NODE_ENV === "production";
const isDemoMode =
  process.env.WEALTHVERSE_DEMO_MODE === "true" ||
  (!isProduction && process.env.WEALTHVERSE_DEMO_MODE !== "false");

if (isProduction && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required in production");
}

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? (isDemoMode ? "wealthverse-local-demo-secret" : ""),
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction,
  isDemoMode,
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};

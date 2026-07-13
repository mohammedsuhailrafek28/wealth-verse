const isProduction = process.env.NODE_ENV === "production";
const isDemoMode =
  process.env.WEALTHVERSE_DEMO_MODE === "true" ||
  (!isProduction && process.env.WEALTHVERSE_DEMO_MODE !== "false");
const allowProductionDemoMode = process.env.WEALTHVERSE_ALLOW_DEMO_IN_PRODUCTION === "true";
const persistenceMode = process.env.WEALTHVERSE_PERSISTENCE === "json" ? "json" : "memory";

if (isProduction && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required in production");
}

if (isProduction && isDemoMode && !allowProductionDemoMode) {
  throw new Error(
    "WEALTHVERSE_DEMO_MODE=true is not allowed in production unless WEALTHVERSE_ALLOW_DEMO_IN_PRODUCTION=true is explicitly set"
  );
}

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? (isDemoMode ? "wealthverse-local-demo-secret" : ""),
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction,
  isDemoMode,
  allowProductionDemoMode,
  persistenceMode,
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};

export function getConfigWarnings() {
  const warnings: string[] = [];
  if (!process.env.DATABASE_URL) {
    warnings.push(
      isDemoMode
        ? "DATABASE_URL is not configured; local demo data is active."
        : "DATABASE_URL is not configured; database-backed features will fail."
    );
  }
  if (!process.env.JWT_SECRET) {
    warnings.push("JWT_SECRET is not configured; this is only acceptable in local demo mode.");
  }
  if (isProduction && persistenceMode === "json") {
    warnings.push("WEALTHVERSE_PERSISTENCE=json is local/dev only and should not be used in production.");
  }
  if (!process.env.BUILT_IN_FORGE_API_KEY) {
    warnings.push("Optional LLM/template API key is not configured; deterministic fallback mode will be used.");
  }
  if (!process.env.VITE_OAUTH_PORTAL_URL || !process.env.VITE_APP_ID || !process.env.OAUTH_SERVER_URL) {
    warnings.push("OAuth variables are incomplete; local demo login fallback is expected.");
  }
  return warnings;
}

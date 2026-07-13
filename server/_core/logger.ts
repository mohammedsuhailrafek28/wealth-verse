type LogMeta = Record<string, unknown>;

const isDebugEnabled = process.env.WEALTHVERSE_LOG_LEVEL === "debug";

function sanitize(value: unknown): unknown {
  if (!value || typeof value !== "object") return value;
  if (value instanceof Error) {
    return { name: value.name, message: value.message };
  }
  if (Array.isArray(value)) return value.map(sanitize);

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, entry]) => {
      const normalized = key.toLowerCase();
      if (
        normalized.includes("secret") ||
        normalized.includes("token") ||
        normalized.includes("key") ||
        normalized.includes("password")
      ) {
        return [key, "[redacted]"];
      }
      return [key, sanitize(entry)];
    })
  );
}

function write(level: "info" | "warn" | "error" | "debug", message: string, meta?: LogMeta) {
  if (level === "debug" && !isDebugEnabled) return;
  const payload = meta ? [message, sanitize(meta)] : [message];
  if (level === "error") {
    console.error(...payload);
    return;
  }
  if (level === "warn") {
    console.warn(...payload);
    return;
  }
  console.log(...payload);
}

export const logger = {
  info: (message: string, meta?: LogMeta) => write("info", message, meta),
  warn: (message: string, meta?: LogMeta) => write("warn", message, meta),
  error: (message: string, meta?: LogMeta) => write("error", message, meta),
  debug: (message: string, meta?: LogMeta) => write("debug", message, meta),
};

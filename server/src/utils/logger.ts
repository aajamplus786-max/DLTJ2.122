// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 9
// FILE: server/src/utils/logger.ts
// DATE: 2026-08-31
// =====================================================

type LogData =
  | Record<string, unknown>
  | undefined;

function write(
  level: string,
  message: string,
  data?: LogData,
) {
  const timestamp =
    new Date().toISOString();

  const suffix =
    data && Object.keys(data).length > 0
      ? ` ${JSON.stringify(data)}`
      : "";

  console.log(
    `[${timestamp}] [${level}] ${message}${suffix}`,
  );
}

export const logger = {
  info(
    message: string,
    data?: LogData,
  ) {
    write("INFO", message, data);
  },

  warn(
    message: string,
    data?: LogData,
  ) {
    write("WARN", message, data);
  },

  error(
    message: string,
    data?: LogData,
  ) {
    write("ERROR", message, data);
  },

  debug(
    message: string,
    data?: LogData,
  ) {
    if (process.env.NODE_ENV !== "production") {
      write("DEBUG", message, data);
    }
  },
};

export default logger;
export const logger = {
  error: (message, data) => {
    console.error(`[ERROR] ${message}`, data);
  },

  warn: (message, data) => {
    console.warn(`[WARN] ${message}`, data);
  },

  info: (message, data) => {
    console.info(`[INFO] ${message}`, data);
  },

  debug: (message, data) => {
    if (import.meta.env.DEV) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  },
};

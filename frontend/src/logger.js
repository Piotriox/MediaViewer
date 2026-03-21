/**
 * Logging utility for frontend
 * Provides consistent error and info logging
 */

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

/**
 * Logs a message with timestamp and level
 * @param {string} level - Log level
 * @param {string} message - Message to log
 * @param {*} data - Optional data to log
 */
function log(level, message, data) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}`;

  if (data) {
    console.log(logMessage, data);
  } else {
    console.log(logMessage);
  }
}

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

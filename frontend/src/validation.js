/**
 * File validation utilities
 * Validates file types, sizes, and paths
 */

// Supported file extensions
export const SUPPORTED_EXTENSIONS = {
  image: ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg'],
  video: ['.mp4', '.webm', '.ogg', '.mov', '.mkv', '.avi', '.wmv', '.m4v'],
};

const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB

/**
 * Determines if a file is an image based on extension
 * @param {string} fileName - File name
 * @returns {boolean}
 */
export function isImageFile(fileName) {
  const ext = fileName.toLowerCase().match(/\.[^.]+$/)?.[0];
  return ext ? SUPPORTED_EXTENSIONS.image.includes(ext) : false;
}

/**
 * Determines if a file is a video based on extension
 * @param {string} fileName - File name
 * @returns {boolean}
 */
export function isVideoFile(fileName) {
  const ext = fileName.toLowerCase().match(/\.[^.]+$/)?.[0];
  return ext ? SUPPORTED_EXTENSIONS.video.includes(ext) : false;
}

/**
 * Validates if a file is supported
 * @param {string} fileName - File name
 * @returns {{valid: boolean, type?: string, error?: string}}
 */
export function validateFile(fileName) {
  if (!fileName) {
    return { valid: false, error: 'File name is empty' };
  }

  if (isImageFile(fileName)) {
    return { valid: true, type: 'image' };
  }

  if (isVideoFile(fileName)) {
    return { valid: true, type: 'video' };
  }

  const ext = fileName.match(/\.[^.]+$/)?.[0] || 'unknown';
  return {
    valid: false,
    error: `Unsupported file format: ${ext}`,
  };
}

/**
 * Validates file path for security issues
 * @param {string} path - File path
 * @returns {boolean}
 */
export function isPathSafe(path) {
  // Prevent path traversal
  if (path.includes('..') || path.includes('//')) {
    return false;
  }
  return true;
}

/**
 * Extracts file name from path
 * @param {string} path - Full file path
 * @returns {string} File name
 */
export function getFileName(path) {
  return path.split(/[\\\/]/).pop() || 'Unknown';
}

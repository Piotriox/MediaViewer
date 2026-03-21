/**
 * File handling utilities for MediaViewer
 * Manages ObjectURL creation and cleanup
 */

/**
 * Creates an ObjectURL from a file path
 * @param {string} path - File path
 * @returns {string} Object URL
 */
export function createObjectUrl(path) {
  try {
    const url = URL.createObjectURL(new File([], path));
    return url;
  } catch (error) {
    console.error('Failed to create object URL:', error);
    throw new Error(`Could not create URL for file: ${path}`);
  }
}

/**
 * Revokes an ObjectURL to prevent memory leaks
 * @param {string|null} url - Object URL to revoke
 */
export function revokeObjectUrl(url) {
  if (url && url.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(url);
    } catch (error) {
      console.warn('Failed to revoke object URL:', error);
    }
  }
}

/**
 * Handles cleanup when page unloads
 * @param {Set<string>} urlsToRevoke - Set of URLs to cleanup
 */
export function setupCleanupOnUnload(urlsToRevoke) {
  window.addEventListener('beforeunload', () => {
    urlsToRevoke.forEach(url => revokeObjectUrl(url));
  });
}

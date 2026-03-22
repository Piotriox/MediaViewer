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

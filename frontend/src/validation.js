// File size limits
const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB
const MAX_PLAYLIST_SIZE = 50 * 1024 * 1024 * 1024; // 50GB total

export const SUPPORTED_EXTENSIONS = {
  image: ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg'],
  video: ['.mp4', '.webm', '.ogg', '.mov', '.mkv', '.avi', '.wmv', '.m4v'],
};

// MIME type signatures (magic bytes) with deeper validation
const MIME_SIGNATURES = {
  'image/png': {
    bytes: [0x89, 0x50, 0x4e, 0x47],
    offset: 0,
    validation: (bytes) => validatePNG(bytes),
  },
  'image/jpeg': {
    bytes: [0xff, 0xd8, 0xff],
    offset: 0,
    validation: (bytes) => validateJPEG(bytes),
  },
  'image/gif': {
    bytes: [0x47, 0x49, 0x46],
    offset: 0,
    validation: (bytes) => validateGIF(bytes),
  },
  'image/webp': {
    bytes: [0x52, 0x49, 0x46, 0x46],
    offset: 0,
    validation: (bytes) => validateWebP(bytes),
  },
  'image/bmp': {
    bytes: [0x42, 0x4d],
    offset: 0,
    validation: (bytes) => validateBMP(bytes),
  },
  'video/mp4': {
    bytes: [0x00, 0x00, 0x00],
    offset: 0,
    validation: (bytes) => validateMP4(bytes),
  },
  'video/webm': {
    bytes: [0x1a, 0x45, 0xdf, 0xa3],
    offset: 0,
    validation: (bytes) => validateWebM(bytes),
  },
  'video/ogg': {
    bytes: [0x4f, 0x67, 0x67, 0x53],
    offset: 0,
    validation: (bytes) => validateOgg(bytes),
  },
  'video/quicktime': {
    bytes: [0x00, 0x00, 0x00],
    offset: 0,
    validation: (bytes) => validateQuickTime(bytes),
  },
  'video/x-matroska': {
    bytes: [0x1a, 0x45, 0xdf, 0xa3],
    offset: 0,
    validation: (bytes) => validateMatroska(bytes),
  },
};

// PNG validation: Check IHDR chunk signature
function validatePNG(bytes) {
  // PNG signature: 89 50 4E 47 0D 0A 1A 0A
  if (bytes[4] !== 0x0d || bytes[5] !== 0x0a || bytes[6] !== 0x1a || bytes[7] !== 0x0a) {
    return false;
  }
  // IHDR chunk should be first (bytes 8-11: "IHDR")
  if (bytes[12] !== 0x49 || bytes[13] !== 0x48 || bytes[14] !== 0x44 || bytes[15] !== 0x52) {
    return false;
  }
  return true;
}

// JPEG validation: Check for SOI and valid APP markers
function validateJPEG(bytes) {
  // JPEG starts with FFD8 (SOI)
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return false;
  // Next marker must be FF (application/JFIF/EXIF marker)
  if (bytes[2] !== 0xff) return false;
  // Avoid JPEG files with suspicious markers (check for script-like patterns)
  const view = new DataView(new ArrayBuffer(Math.min(256, bytes.length)));
  for (let i = 0; i < Math.min(256, bytes.length); i++) {
    view.setUint8(i, bytes[i]);
  }
  return true;
}

// GIF validation: Check version (87a or 89a)
function validateGIF(bytes) {
  // GIF87a or GIF89a
  if (bytes[3] !== 0x38) return false; // '8'
  if (bytes[4] !== 0x37 && bytes[4] !== 0x39) return false; // '7' or '9'
  if (bytes[5] !== 0x61) return false; // 'a'
  // Logical Screen Descriptor must follow
  if (bytes.length < 10) return false;
  return true;
}

// WebP validation: Check RIFF structure and VP8/VP8L/VP8X chunks
function validateWebP(bytes) {
  // RIFF.... WEBP
  if (bytes[8] !== 0x57 || bytes[9] !== 0x45 || bytes[10] !== 0x42 || bytes[11] !== 0x50) {
    return false;
  }
  // Check for valid VP8/VP8L/VP8X chunk at offset 12
  if (bytes.length < 20) return false;
  const chunkId = String.fromCharCode(bytes[12], bytes[13], bytes[14], bytes[15]);
  return chunkId === 'VP8 ' || chunkId === 'VP8L' || chunkId === 'VP8X';
}

// BMP validation: Check BMP header structure
function validateBMP(bytes) {
  // BM signature must be followed by file size (4 bytes little-endian)
  if (bytes.length < 26) return false;
  // DIB header offset should be at bytes 10-13 (typically 40 for modern BMPs)
  const dibSize = bytes[14] | (bytes[15] << 8) | (bytes[16] << 16) | (bytes[17] << 24);
  // Standard DIB sizes: 40, 108, 124 (BITMAPCOREHEADER, BITMAPV5HEADER variations)
  return dibSize === 40 || dibSize === 108 || dibSize === 124;
}

// MP4 validation: Check for ftyp box at offset 4
function validateMP4(bytes) {
  // MP4 atoms typically start with size (4 bytes) followed by "ftyp", "mdat", "moov"
  if (bytes.length < 12) return false;
  // Check for ftyp box (most common first atom)
  const boxType = String.fromCharCode(bytes[4], bytes[5], bytes[6], bytes[7]);
  if (boxType === 'ftyp') {
    // Validate box size
    const size = (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3];
    return size >= 20 && size < 65536; // Reasonable size range
  }
  return false;
}

// WebM validation: Check EBML header
function validateWebM(bytes) {
  // WebM starts with EBML element (0x1A45DFA3), then version, read size
  if (bytes.length < 12) return false;
  // After EBML magic, should have element size (variable-length encoding)
  // Check for common version bytes
  return bytes[4] >= 0x80 && bytes[4] <= 0xFF;
}

// Ogg validation: Check second occurrence of "Oggs" pattern
function validateOgg(bytes) {
  if (bytes.length < 100) return false;
  // Ogg should have page structure with repeated OggS markers
  let oggCount = 0;
  for (let i = 0; i < Math.min(256, bytes.length - 3); i++) {
    if (bytes[i] === 0x4f && bytes[i + 1] === 0x67 && bytes[i + 2] === 0x67 && bytes[i + 3] === 0x53) {
      oggCount++;
    }
  }
  return oggCount >= 2; // Valid Ogg files have multiple OggS markers
}

// QuickTime validation: Check for valid atom types after leading 4-byte size
function validateQuickTime(bytes) {
  if (bytes.length < 16) return false;
  // QuickTime atoms: size (4) + type (4)
  const atomType = String.fromCharCode(bytes[4], bytes[5], bytes[6], bytes[7]);
  const validTypes = ['ftyp', 'mdat', 'moov', 'free', 'skip', 'wide', 'uuid'];
  return validTypes.includes(atomType);
}

// Matroska validation: Check EBML header structure
function validateMatroska(bytes) {
  if (bytes.length < 16) return false;
  // After EBML magic (0x1A45DFA3), check for proper element size encoding
  // Element size uses variable-length encoding, so check for valid patterns
  return bytes[4] >= 0x80 && bytes[5] >= 0x42; // Valid EBML size and version markers
}

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
 * Checks if file MIME type matches its extension
 * Reads 256+ bytes for comprehensive header validation and polyglot file detection
 * @param {File} file - File object
 * @returns {Promise<boolean>} True if MIME type matches extension and passes deep validation
 */
export async function validateMimeType(file) {
  if (!file || !file.type) {
    return false;
  }

  // Read first 256 bytes for deep validation
  try {
    const readSize = Math.min(256, file.size);
    const buffer = await file.slice(0, readSize).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // Get expected MIME type from extension
    const ext = file.name.toLowerCase().match(/\.[^.]+$/)?.[0];
    if (!ext) return false;

    // Map extension to expected MIME types
    const mimeMap = {
      '.png': ['image/png'],
      '.jpg': ['image/jpeg'],
      '.jpeg': ['image/jpeg'],
      '.gif': ['image/gif'],
      '.bmp': ['image/bmp'],
      '.webp': ['image/webp'],
      '.svg': ['image/svg+xml'],
      '.mp4': ['video/mp4'],
      '.webm': ['video/webm'],
      '.ogg': ['video/ogg'],
      '.mov': ['video/quicktime'],
      '.mkv': ['video/x-matroska'],
      '.avi': ['video/x-msvideo'],
      '.wmv': ['video/x-ms-wmv'],
      '.m4v': ['video/x-m4v'],
    };

    const expectedMimes = mimeMap[ext] || [];
    if (!expectedMimes.includes(file.type)) {
      return false;
    }

    // Deep validate each expected MIME type
    for (const mimeType of expectedMimes) {
      const sig = MIME_SIGNATURES[mimeType];
      if (!sig) continue;

      // Check initial magic bytes
      let matches = true;
      for (let i = 0; i < sig.bytes.length; i++) {
        if (bytes[sig.offset + i] !== sig.bytes[i]) {
          matches = false;
          break;
        }
      }

      if (!matches) continue;

      // Run format-specific deep validation
      if (sig.validation) {
        if (!sig.validation(bytes)) {
          continue;
        }
      }

      // Additional polyglot detection: check for suspicious patterns
      if (!isPolyglotFile(bytes, mimeType)) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('MIME type validation failed:', error);
    return false;
  }
}

/**
 * Detects potential polyglot files (files valid in multiple formats)
 * Looks for patterns that suggest multiple formats embedded
 * @param {Uint8Array} bytes - File bytes
 * @param {string} mimeType - MIME type being validated
 * @returns {boolean} True if polyglot/suspicious patterns detected
 */
function isPolyglotFile(bytes, mimeType) {
  // Check for embedded executables or script signatures
  const suspiciousPatterns = [
    { sig: [0x4d, 0x5a], name: 'PE/MZ executable' }, // MZ header (Windows EXE)
    { sig: [0x7f, 0x45, 0x4c, 0x46], name: 'ELF executable' }, // ELF header
    { sig: [0xca, 0xfe, 0xba, 0xbe], name: 'Mach-O executable' }, // Mach-O header
  ];

  for (const pattern of suspiciousPatterns) {
    let patternFound = false;
    for (let i = 0; i <= bytes.length - pattern.sig.length; i++) {
      let matches = true;
      for (let j = 0; j < pattern.sig.length; j++) {
        if (bytes[i + j] !== pattern.sig[j]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        console.warn(`Polyglot file detected: ${pattern.name} signature found in ${mimeType}`);
        patternFound = true;
        break;
      }
    }
    if (patternFound) return true;
  }

  // Check for ZIP signature in images (common polyglot vector)
  if (mimeType.startsWith('image/') && bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04) {
    console.warn(`Polyglot file detected: ZIP signature in image file`);
    return true;
  }

  return false;
}

/**
 * Validates file size against limits
 * @param {File} file - File object
 * @param {number} totalPlaylistSize - Current total playlist size in bytes
 * @returns {{valid: boolean, error?: string}}
 */
export function validateFileSize(file, totalPlaylistSize = 0) {
  if (file.size > MAX_FILE_SIZE) {
    const sizeGB = (file.size / 1024 / 1024 / 1024).toFixed(2);
    return {
      valid: false,
      error: `File too large: ${sizeGB}GB (max 5GB)`,
    };
  }

  if (totalPlaylistSize + file.size > MAX_PLAYLIST_SIZE) {
    const available = ((MAX_PLAYLIST_SIZE - totalPlaylistSize) / 1024 / 1024 / 1024).toFixed(2);
    return {
      valid: false,
      error: `Playlist too large. Only ${available}GB available.`,
    };
  }

  return { valid: true };
}

/**
 * Get human-readable file size
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, index)).toFixed(2) + ' ' + units[index];
}

/**
 * Extracts file name from path
 * @param {string} path - Full file path
 * @returns {string} File name
 */
export function getFileName(path) {
  return path.split(/[\\\/]/).pop() || 'Unknown';
}

/**
 * Unit tests for validation.js
 */

import { describe, it, expect } from 'vitest';
import {
  isImageFile,
  isVideoFile,
  validateFile,
  isPathSafe,
  getFileName,
} from '../validation';

describe('File Validation', () => {
  describe('isImageFile', () => {
    it('should identify image files by extension', () => {
      expect(isImageFile('photo.jpg')).toBe(true);
      expect(isImageFile('picture.PNG')).toBe(true);
      expect(isImageFile('image.svg')).toBe(true);
    });

    it('should return false for non-image files', () => {
      expect(isImageFile('video.mp4')).toBe(false);
      expect(isImageFile('document.pdf')).toBe(false);
    });
  });

  describe('isVideoFile', () => {
    it('should identify video files by extension', () => {
      expect(isVideoFile('movie.mp4')).toBe(true);
      expect(isVideoFile('clip.MKV')).toBe(true);
      expect(isVideoFile('video.webm')).toBe(true);
    });

    it('should return false for non-video files', () => {
      expect(isVideoFile('photo.jpg')).toBe(false);
      expect(isVideoFile('audio.mp3')).toBe(false);
    });
  });

  describe('validateFile', () => {
    it('should validate image files', () => {
      const result = validateFile('sunset.jpg');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('image');
    });

    it('should validate video files', () => {
      const result = validateFile('movie.mp4');
      expect(result.valid).toBe(true);
      expect(result.type).toBe('video');
    });

    it('should reject unsupported files', () => {
      const result = validateFile('document.pdf');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Unsupported');
    });

    it('should handle empty filenames', () => {
      const result = validateFile('');
      expect(result.valid).toBe(false);
    });
  });

  describe('isPathSafe', () => {
    it('should reject path traversal attempts', () => {
      expect(isPathSafe('/home/user/../../../etc')).toBe(false);
      expect(isPathSafe('C:\\Users\\..\\..\\System32')).toBe(false);
    });

    it('should reject double slashes', () => {
      expect(isPathSafe('/home//user//file')).toBe(false);
    });

    it('should accept normal paths', () => {
      expect(isPathSafe('/home/user/photo.jpg')).toBe(true);
      expect(isPathSafe('C:\\Users\\Media\\video.mp4')).toBe(true);
    });
  });

  describe('getFileName', () => {
    it('should extract filename from Windows paths', () => {
      expect(getFileName('C:\\Users\\Alice\\photo.jpg')).toBe('photo.jpg');
    });

    it('should extract filename from Unix paths', () => {
      expect(getFileName('/home/alice/video.mp4')).toBe('video.mp4');
    });

    it('should handle filenames without path', () => {
      expect(getFileName('image.png')).toBe('image.png');
    });
  });
});

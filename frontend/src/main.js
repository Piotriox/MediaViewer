import './style.css';
import { convertFileSrc } from '@tauri-apps/api/core';
import { validateFile, validateMimeType, validateFileSize, formatFileSize, isImageFile, isVideoFile, getFileName } from './validation.js';
import { revokeObjectUrl, setupCleanupOnUnload } from './utils.js';
import { logger } from './logger.js';

const statusEl = document.getElementById('status');
const imageContainer = document.getElementById('imageContainer');
const imageEl = document.getElementById('mediaImage');
const videoEl = document.getElementById('mediaVideo');
const videoContainer = document.getElementById('videoContainer');
const videoPlayBtn = document.getElementById('videoPlayBtn');
const progressSlider = document.getElementById('progressSlider');
const progressFill = document.querySelector('.progress-fill');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');

/**
 * @typedef {Object} MediaItem
 * @property {string} kind - 'image' or 'video'
 * @property {string} src - Asset URL or object URL
 * @property {string} name - Display name
 * @property {boolean} shouldRevoke - Whether to revoke URL on cleanup
 */

const state = {
  playlist: [],
  currentIndex: 0,
  currentKind: null,
  urlsToRevoke: new Set(),
  isPlaying: false,
  
  // Image zoom and pan
  imageZoom: 1,
  imagePanX: 0,
  imagePanY: 0,
  isPanning: false,
  panStartX: 0,
  panStartY: 0,
  panStartPanX: 0,
  panStartPanY: 0,
  addToRevoke(url) {
    if (url && url.startsWith('blob:')) {
      this.urlsToRevoke.add(url);
    }
  },

  revoke(url) {
    if (this.urlsToRevoke.has(url)) {
      revokeObjectUrl(url);
      this.urlsToRevoke.delete(url);
    }
  },

  clear() {
    this.urlsToRevoke.forEach(url => revokeObjectUrl(url));
    this.urlsToRevoke.clear();
    this.playlist = [];
    this.currentIndex = 0;
    this.currentKind = null;
    this.isPlaying = false;
    this.resetImageTransform();
  },

  resetImageTransform() {
    this.imageZoom = 1;
    this.imagePanX = 0;
    this.imagePanY = 0;
    this.updateImageTransform();
  },

  updateImageTransform() {
    const transform = `scale(${this.imageZoom}) translate(${this.imagePanX}px, ${this.imagePanY}px)`;
    imageEl.style.transform = transform;
  },
};

setupCleanupOnUnload(state.urlsToRevoke);

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function setStatus(text) {
  statusEl.textContent = text;
}

function displayImage(item) {
  if (item.kind !== 'image') {
    logger.warn(`Cannot display image: wrong type (${item.kind})`);
    return false;
  }

  try {
    state.currentKind = 'image';
    state.resetImageTransform();
    document.querySelector('.status').hidden = true;
    document.querySelector('.stage').hidden = false;
    imageContainer.style.display = 'flex';
    videoContainer.style.display = 'none';
    
    videoEl.pause();
    imageEl.src = item.src;

    logger.info(`Displaying image: ${item.name}`);
    return true;
  } catch (error) {
    logger.error('Failed to display image', error);
    document.querySelector('.status').hidden = false;
    document.querySelector('.status').textContent = `Error loading image: ${item.name}`;
    return false;
  }
}

function displayVideo(item) {
  if (item.kind !== 'video') {
    logger.warn(`Cannot display video: wrong type (${item.kind})`);
    return false;
  }

  try {
    state.currentKind = 'video';
    document.querySelector('.status').hidden = true;
    document.querySelector('.stage').hidden = false;
    imageContainer.style.display = 'none';
    videoContainer.style.display = 'flex';

    videoEl.src = item.src;
    videoEl.currentTime = 0;

    logger.info(`Playing video: ${item.name}`);
    videoEl.play().catch(() => {
      logger.debug('Autoplay prevented, waiting for user interaction');
    });

    return true;
  } catch (error) {
    logger.error('Failed to display video', error);
    document.querySelector('.status').hidden = false;
    document.querySelector('.status').textContent = `Error loading video: ${item.name}`;
    return false;
  }
}

function playMedia(index) {
  if (state.playlist.length === 0) {
    logger.warn('Cannot play: empty playlist');
    return;
  }

  state.currentIndex = Math.max(0, Math.min(index, state.playlist.length - 1));
  const item = state.playlist[state.currentIndex];

  const displayed = item.kind === 'image'
    ? displayImage(item)
    : displayVideo(item);

  if (!displayed) {
    setStatus(`Unsupported file: ${item.name}`);
    logger.error(`Unsupported file type: ${item.name}`);
  }
}

function updatePlayButtonState() {
  state.isPlaying = !videoEl.paused;
  videoPlayBtn.textContent = state.isPlaying ? '⏸' : '▶';
}

function updateProgressBar() {
  const duration = videoEl.duration;
  if (duration && isFinite(duration)) {
    const percent = (videoEl.currentTime / duration) * 100;
    progressFill.style.width = `${percent}%`;
    progressSlider.value = percent;
    currentTimeEl.textContent = formatTime(videoEl.currentTime);
  }
}

function updateDuration() {
  const duration = videoEl.duration;
  if (duration && isFinite(duration)) {
    durationEl.textContent = formatTime(duration);
    progressSlider.max = 100;
  }
}

function handlePlayPauseClick() {
  if (videoEl.paused) {
    videoEl.play().catch(err => {
      logger.debug('Play failed', err);
    });
  } else {
    videoEl.pause();
  }
}

function handleProgressChange() {
  const duration = videoEl.duration;
  if (duration && isFinite(duration)) {
    const percent = parseFloat(progressSlider.value);
    videoEl.currentTime = (percent / 100) * duration;
  }
}

function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
  document.querySelector('.stage').classList.add('drag-over');
  statusEl.classList.add('drag-over');
}

function handleDragLeave(event) {
  if (event.target === document.querySelector('#app')) {
    document.querySelector('.stage').classList.remove('drag-over');
    statusEl.classList.remove('drag-over');
  }
}

function handleDrop(event) {
  event.preventDefault();
  document.querySelector('.stage').classList.remove('drag-over');
  statusEl.classList.remove('drag-over');

  const files = Array.from(event.dataTransfer.files || []);
  logger.info(`User dropped ${files.length} file(s)`);

  state.clear();
  state.playlist = [];

  let totalPlaylistSize = 0;
  const validatedFiles = [];

  for (const file of files) {
    // Check file size first
    const sizeCheck = validateFileSize(file, totalPlaylistSize);
    if (!sizeCheck.valid) {
      logger.warn(`Skipping file: ${file.name} - ${sizeCheck.error}`);
      statusEl.textContent = sizeCheck.error;
      continue;
    }

    // Check extension
    const validation = validateFile(file.name);
    if (!validation.valid) {
      logger.warn(`Skipping unsupported file: ${file.name} (${validation.error})`);
      continue;
    }

    // Create blob URL immediately to prevent memory leak (blob URL fix)
    let objectUrl;
    try {
      objectUrl = URL.createObjectURL(file);
      state.addToRevoke(objectUrl);
      logger.debug(`Blob URL created for ${file.name}`);
    } catch (error) {
      logger.error(`Failed to create URL for file ${file.name}`, error);
      continue;
    }

    // Store for async validation
    validatedFiles.push({
      file,
      objectUrl,
      validation,
      totalPlaylistSize,
    });

    totalPlaylistSize += file.size;
  }

  // Validate MIME types asynchronously for all files
  const validationPromises = validatedFiles.map(async (item) => {
    try {
      const isValid = await validateMimeType(item.file);
      
      if (!isValid) {
        logger.warn(`MIME type validation failed for ${item.file.name} - file may be corrupted or misnamed`);
        // Revoke blob URL if MIME validation fails (blob URL memory leak fix)
        revokeObjectUrl(item.objectUrl);
        state.urlsToRevoke.delete(item.objectUrl);
        return null;
      }

      return {
        kind: item.validation.type,
        src: item.objectUrl,
        name: item.file.name,
        size: item.file.size,
        shouldRevoke: true,
      };
    } catch (error) {
      logger.error(`Error validating MIME type for ${item.file.name}`, error);
      // Revoke blob URL on validation error
      revokeObjectUrl(item.objectUrl);
      state.urlsToRevoke.delete(item.objectUrl);
      return null;
    }
  });

  // Wait for all validations and update UI
  Promise.all(validationPromises).then((results) => {
    const validItems = results.filter(item => item !== null);
    state.playlist = validItems;

    if (state.playlist.length === 0) {
      document.querySelector('.stage').hidden = true;
      document.querySelector('.status').hidden = false;
      imageContainer.hidden = true;
      videoContainer.hidden = true;
      imageEl.removeAttribute('src');
      videoEl.removeAttribute('src');
      setStatus('No supported image or video files dropped');
      return;
    }

    logger.info(`Loaded ${state.playlist.length} media file(s) (${formatFileSize(totalPlaylistSize)} total)`);
    state.currentIndex = 0;
    playMedia(0);
  }).catch(error => {
    logger.error('Error processing files', error);
    setStatus('Error processing files');
  });
}

function handleKeyDown(event) {
  if (event.key === 'Escape' && document.fullscreenElement) {
    document.exitFullscreen().catch(err => {
      logger.debug('Failed to exit fullscreen', err);
    });
  }
  if (event.code === 'Space' && state.currentKind === 'video') {
    event.preventDefault();
    handlePlayPauseClick();
  }
}

function handleVideoPlayPause() {
  updatePlayButtonState();
}

function handleImageWheel(event) {
  if (state.currentKind !== 'image') return;
  
  event.preventDefault();
  
  const zoomDelta = event.deltaY > 0 ? 0.9 : 1.1;
  const newZoom = Math.max(1, Math.min(5, state.imageZoom * zoomDelta));
  
  if (newZoom !== state.imageZoom) {
    state.imageZoom = newZoom;
    state.updateImageTransform();
    logger.debug(`Image zoom: ${state.imageZoom.toFixed(2)}x`);
  }
}

function handleImageMouseDown(event) {
  if (state.currentKind !== 'image' || state.imageZoom <= 1) return;
  state.isPanning = true;
  state.panStartX = event.clientX;
  state.panStartY = event.clientY;
  state.panStartPanX = state.imagePanX;
  state.panStartPanY = state.imagePanY;
  imageEl.classList.add('grabbing');
}

function handleImageMouseMove(event) {
  if (!state.isPanning) return;
  const deltaX = event.clientX - state.panStartX;
  const deltaY = event.clientY - state.panStartY;
  state.imagePanX = state.panStartPanX + (deltaX / state.imageZoom);
  state.imagePanY = state.panStartPanY + (deltaY / state.imageZoom);
  state.updateImageTransform();
}

function handleImageMouseUp() {
  if (!state.isPanning) return;
  state.isPanning = false;
  imageEl.classList.remove('grabbing');
}

function initializeFromFileAssociation() {
  const openedFiles = Array.isArray(window.openedFiles) ? window.openedFiles : [];
  if (openedFiles.length === 0) return;
  logger.info(`Opening ${openedFiles.length} file(s) from file association`);

  state.clear();
  state.playlist = [];

  for (const path of openedFiles) {
    const fileName = getFileName(path);
    const validation = validateFile(fileName);

    if (!validation.valid) {
      logger.warn(`Skipping file from association: ${fileName} (${validation.error})`);
      continue;
    }

    try {
      state.playlist.push({
        kind: validation.type,
        src: convertFileSrc(path),
        name: fileName,
        shouldRevoke: false,
      });
    } catch (error) {
      logger.error(`Failed to convert file path: ${path}`, error);
    }
  }

  if (state.playlist.length > 0) {
    logger.info(`Initialized with ${state.playlist.length} file(s)`);
    state.currentIndex = 0;
    playMedia(0);
  }
}

function initialize() {
  document.addEventListener('dragover', handleDragOver, false);
  document.addEventListener('dragleave', handleDragLeave, false);
  document.addEventListener('drop', handleDrop, false);
  document.addEventListener('keydown', handleKeyDown);
  imageContainer.addEventListener('wheel', handleImageWheel, { passive: false });
  imageContainer.addEventListener('mousedown', handleImageMouseDown);
  imageContainer.addEventListener('mousemove', handleImageMouseMove);
  imageContainer.addEventListener('mouseup', handleImageMouseUp);
  imageContainer.addEventListener('mouseleave', handleImageMouseUp);
  videoPlayBtn.addEventListener('click', handlePlayPauseClick);
  progressSlider.addEventListener('input', handleProgressChange);
  videoEl.addEventListener('play', handleVideoPlayPause);
  videoEl.addEventListener('pause', handleVideoPlayPause);
  videoEl.addEventListener('timeupdate', updateProgressBar);
  videoEl.addEventListener('loadedmetadata', updateDuration);
  setStatus('Drag and drop images or videos here');
  updatePlayButtonState();
  initializeFromFileAssociation();
  logger.info('MediaViewer initialized');
}

initialize();


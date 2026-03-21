# MediaViewer Architecture Guide

**Platforms**: Windows 10+ (x86_64), Linux (x86_64), macOS (x86_64, ARM64)

Comprehensive technical documentation for MediaViewer's design and implementation.

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Windows Taskbar                       │
│               (File Association Handler)                 │
└─────────────────┬───────────────────────────────────────┘
                  │ user double-clicks media file
                  ▼
┌─────────────────────────────────────────────────────────┐
│                  Tauri Application                       │
├──────────────────────────────────────────────────────────┤
│  Backend (Rust)              │   Frontend (JavaScript)   │
│                              │                           │
│ • File Association Handler   │ • State Management        │
│ • Asset Protocol Scope       │ • File Validation         │
│ • Security Configuration     │ • Error Handling & Logging│
│ • Window Initialization      │ • Media Display           │
│ • Logging                    │ • UI Event Handling       │
└──────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Data Flow

```
User Interaction (file select / open from association)
        ↓
File Validation (extension check, path safety)
        ↓
Playlist Creation (build media items array)
        ↓
URL Management (create blob URLs, track revokes)
        ↓
Display Media (show image or play video)
        ↓
UI Update (enable/disable buttons, show status)
        ↓
Fullscreen Mode (request fullscreen on display)
```

### State Management

The `state` object in `main.js` is the single source of truth:

```javascript
state = {
  playlist: [],              // Array of MediaItem objects
  currentIndex: 0,          // Current playing position
  currentKind: 'image'|'video'|null,
  urlsToRevoke: Set<string>, // Track blob URLs for cleanup
}
```

**Why not Redux/Vuex?**
- App is simple with single viewport
- Minimal state mutations
- Direct DOM updates are sufficient
- Easier to debug and maintain

### Module Breakdown

#### `main.js` (~200 lines)
**Responsibilities:**
- State initialization and management
- Event listener attachment
- Media playback flow control
- Fullscreen management
- File association initialization

**Key Functions:**
- `initialize()` - App startup
- `playMedia(index)` - Play specific media
- `displayImage(item)` - Show image
- `displayVideo(item)` - Play video
- `handleKeyDown()` - Keyboard shortcuts

#### `validation.js` (~100 lines)
**Responsibilities:**
- File type detection
- Path safety validation
- Error message generation

**Exports:**
- `isImageFile(name)` - Extension check
- `isVideoFile(name)` - Extension check
- `validateFile(name)` - Type validation with errors
- `isPathSafe(path)` - Path traversal prevention
- `getFileName(path)` - Path parsing

**Supported Formats:**
```javascript
Images: .png, .jpg, .jpeg, .gif, .bmp, .webp, .svg
Videos: .mp4, .webm, .ogg, .mov, .mkv, .avi, .wmv, .m4v
```

#### `utils.js` (~50 lines)
**Responsibilities:**
- ObjectURL lifecycle management
- Memory leak prevention

**Functions:**
- `createObjectUrl(path)` - Create blob URL from file
- `revokeObjectUrl(url)` - Clean up blob URL
- `setupCleanupOnUnload(urls)` - Page unload handler

**Memory Management:**
```
File Selected
    ↓
Create blob URL
    ↓
Track in urlsToRevoke Set
    ↓
Play media
    ↓
Display finished → Remove from Set & revoke
    ↓
Page unload → Revoke all remaining URLs
```

#### `logger.js` (~30 lines)
**Responsibilities:**
- Consistent error/info logging
- Development vs. production logging

**Methods:**
- `logger.error(msg, data)` - Errors (always logged)
- `logger.warn(msg, data)` - Warnings (always logged)
- `logger.info(msg, data)` - Info (always logged)
- `logger.debug(msg, data)` - Debug (dev only)

### Error Handling Strategy

```
User Action
    ↓
Try-Catch Block
    ├─ Success → Update UI, log info
    └─ Error → Catch block
        ├─ Log error with context
        ├─ Display user-friendly message
        └─ Update button states
```

**Error Types Handled:**
- Invalid file types → Skip in playlist
- Fullscreen denied → Continue playback
- Autoplay blocked → Show manual play prompt
- URL creation failed → Skip file with error log
- Missing DOM elements → Early initialization

## Backend Architecture

### Rust Module Structure

```
lib.rs
├── run() - Main entry point
├── collect_opened_files_from_args() - CLI arg parser
└── build_opened_files_init_script() - File validation & JS init
```

### File Association Flow

```
Windows File Association
    ↓
Launch app.exe with file paths as arguments
    ↓
collect_opened_files_from_args()
    └─ Parse command-line args
    └─ Convert file:// URLs to paths
    └─ Return Vec<PathBuf>
    ↓
build_opened_files_init_script()
    └─ Validate each file exists
    └─ Add to asset protocol scope
    └─ Generate JS init code
    └─ Return JavaScript: `window.openedFiles = [...]`
    ↓
Set initialization script on window
    ↓
WebView executes script before loading app
    ↓
Frontend's initializeFromFileAssociation() runs
```

### Security Implementation

#### Content Security Policy (tauri.conf.json)
```json
"csp": "default-src 'self'; 
         script-src 'self' 'wasm-unsafe-eval'; 
         style-src 'self' 'unsafe-inline'; 
         img-src 'self' data: asset: blob:; 
         media-src 'self' asset: blob:;"
```

**Rationale:**
- `default-src 'self'` - Only local resources by default
- `wasm-unsafe-eval` - Required for Tauri's internal runtime
- `unsafe-inline` for CSS - Needed for element.style mutations
- `data:` URLs - Allow data URIs (fonts, small images)
- `blob:` URLs - Required for File API object URLs
- `asset:` - Tauri's custom protocol for app files

#### Asset Protocol Scope
```json
"scope": ["$HOME/Pictures", "$HOME/Videos", "$HOME/Desktop", "$HOME/Downloads", "$TEMP"]
```

**Why these directories?**
- Prevents access to system files (Windows/)
- Users typically store media in standard locations
- Can be extended later if needed

### Error Handling in Rust

**Before (Unsafe):**
```rust
window.build()?;  // Panic if fails
asset_scope.allow_file(file);  // Silently fail
```

**After (Safe):**
```rust
window.build().map_err(|e| {
    log::error!("Failed to create window: {}", e);
    e
})?;  // Propagate with logging

if !file.exists() {
    log::warn!("File not found: {:?}", file);
    continue;  // Skip validation
}

if let Err(e) = asset_scope.allow_file(file) {
    log::error!("Failed to allow file: {}", e);
    continue;  // Skip file
}
```

## Data Types

### MediaItem Structure
```javascript
{
  kind: 'image'|'video',    // Type determined by validation.js
  src: 'blob:...|asset://...', // Object URL or asset protocol
  name: 'file.jpg',         // Display name
  shouldRevoke: true|false  // Whether to revoke blob URL
}
```

### Validation Result
```javascript
{
  valid: boolean,
  type?: 'image'|'video',
  error?: string
}
```

## Lifecycle Events

### Application Startup
1. `index.html` loads
2. Script import: `/src/main.js`
3. DOM elements cached
4. Event listeners attached (click, keyboard, video end)
5. `initializeFromFileAssociation()` checks `window.openedFiles`
6. If files present → load and play first file
7. Display "Select Files" prompt if no files

### File Selection
1. User clicks "Select Files"
2. File input dialog opens
3. User selects files
4. `'change'` event triggers
5. `validateFile()` checks each
6. `createObjectUrl()` for valid files
7. `playMedia(0)` starts playback
8. Buttons enabled based on playlist length

### Media Playback
1. `playMedia(index)` called
2. `state.play(index)` updates state
3. `displayImage(item)` or `displayVideo(item)` called
4. Media elements configured with src
5. `requestFullscreen()` attempted
6. Status message updated
7. Buttons enabled/disabled based on position

### Cleanup
1. New file selected → Previous blob URLs revoked
2. Page unload → All remaining blob URLs revoked
3. App closed → OS frees all resources

## Testing Strategy

### Unit Tests
Located in `frontend/src/*.test.js`

```javascript
// Example: validation.test.js
describe('validateFile', () => {
  it('should validate image files', () => {
    const result = validateFile('photo.jpg');
    expect(result.valid).toBe(true);
    expect(result.type).toBe('image');
  });

  it('should reject unsupported files', () => {
    const result = validateFile('document.pdf');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Unsupported');
  });
});
```

**Why Vitest?**
- Zero-config out of the box
- Fast by default
- Good jsdom support for DOM testing
- Coverage reporting included
- ESM native (no transpilation needed)

### Integration Testing (Manual)
- [ ] Open single image
- [ ] Open multiple images, navigate with prev/next
- [ ] Double-click video file in File Explorer
- [ ] Verify fullscreen works
- [ ] Verify Escape exits fullscreen
- [ ] Verify memory cleanup (DevTools → Memory → Take heap snapshot)
- [ ] Test autoplay blocked scenario
- [ ] Test with unsupported file type

### Performance Testing
Track these metrics:
- **Time to first paint**: From app launch to showing first file
- **Fullscreen transition**: Time to enter fullscreen
- **Memory growth**: Heap size when adding/removing files
- **CPU during video**: Should be minimal (hardware accelerated)

## Future Architectural Improvements

### 1. State Machine Pattern
```javascript
// Enhanced state handling
const StateMachine = {
  IDLE: 'idle',
  LOADING: 'loading',
  PLAYING: 'playing',
  PAUSED: 'paused',
  ERROR: 'error',
};

state.mode = StateMachine.IDLE;
state.transition(newMode) // Validates allowed transitions
```

### 2. Plugin System
```javascript
// Allow extensibility
class MediaViewerPlugin {
  onMediaLoad(item) {}
  onPlaybackStart() {}
  onError(error) {}
}
```

### 3. Playlist Persistence
```javascript
// Save/load playlists as JSON
const savedPlaylist = {
  name: 'Vacation 2024',
  created: '2024-03-19',
  items: [...]
};
```

### 4. Thumbnail Caching
```javascript
// Generate thumbnails for faster preview
const generateThumbnail = async (file) => {
  // Create small preview image/video frame
};
```

### 5. Advanced Logging
```javascript
// Structured logging with timestamps and context
logger.track('playback', {
  file: 'video.mp4',
  duration: 120,
  currentTime: 45,
  timestamp: Date.now()
});
```

## Performance Considerations

### Memory
- Blob URLs persist until `revokeObjectURL()` called
- Large videos can consume 100MB+ of RAM
- Browser garbage collection can't clean blob URLs
- **Solution**: Strict tracking in `state.urlsToRevoke`

### CPU
- Decoding videos uses GPU acceleration (modern browsers)
- Image scaling handled by browser (object-fit: contain)
- **Tip**: Avoid rotating large images (causes re-rendering)

### Disk I/O
- Asset protocol reads directly from filesystem
- No caching of video files
- Works well with network shares but slower than local drives

## Security Considerations

### What's Protected
✅ System files (restricted scope)
✅ Cross-site scripting (CSP headers)
✅ Path traversal attacks (validation)
✅ Unknown file types (validation)

### What's NOT Protected
⚠️ Malicious video codecs (decoded by OS)
⚠️ Memory bombs (huge files)
⚠️ Corrupted files (no deep validation)

**Recommendations for Production:**
- Add file size limits
- Validate MIME types (not just extensions)
- Sandbox video decoding if possible
- Add antivirus scanning integration

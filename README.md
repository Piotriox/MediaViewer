# MediaViewer

**Fast, lightweight desktop media player for Windows, Linux, and macOS**

MediaViewer is a modern desktop application for viewing images and playing videos with exceptional performance and security. Built with Tauri and Vite, it offers seamless file association integration, native keyboard controls, and a distraction-free viewing experience.

### Why MediaViewer?
- **Lightning Fast** - Opens files instantly with optimized memory usage
- **Secure** - Advanced file validation with magic bytes checking and symlink protection
- **Native Feel** - Deep OS integration with file associations and keyboard shortcuts
- **Lightweight** - Single executable, no bloat, instant launch
- **No Nonsense** - Focus on what matters: your media

## Features

### Image Support
- **Formats**: PNG, JPG, JPEG, GIF, BMP, WebP
- **Performance**: Optimized rendering for large images
- **Controls**: Zoom in/out, pan across canvas
- **Fullscreen**: Immersive full-screen viewing
- **Navigation**: Previous/Next for browsing image collections
- **Validation**: Magic bytes checking to prevent spoofed files

### Video Support
- **Formats**: MP4, WebM, OGG, MOV, MKV, AVI, WMV, M4V
- **Player**: Native HTML5 video with full controls
- **Playback**: Progress bar, play/pause, fullscreen toggle
- **Smart Play**: Auto-advances to next file on completion
- **Keyboard**: Space bar for play/pause
- **Streaming**: Low latency, efficient caching

### System Integration
- **File Association**: Double-click media files → opens in MediaViewer
- **Multi-Select**: Open multiple files at once from file browser
- **Native Integration**: Windows, Linux, and macOS support
- **Command Line**: Open files via terminal: `mediaviewer file.mp4`
- **Drag & Drop**: Drop files directly into the app

### Security & Robustness
- **Content Security Policy**: CSP headers prevent XSS attacks
- **File Validation**: Extension + magic bytes + polyglot detection
- **Symlink Protection**: Resolves symlinks safely, prevents escape
- **Path Isolation**: Limited to user's media directories
- **Memory Safe**: Automatic blob URL cleanup, no memory leaks
- **Input Sanitization**: All file operations validated

### From Source (Development)

For development setup, prerequisites, and build instructions, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Usage

### Opening Files

**Option 1: File Browser**
- Click "Select Files" button → Choose images/videos → Click "Open"

**Option 2: File Association (Recommended)**
- Right-click image/video in Windows Explorer → "Open with" → MediaViewer
- Or double-click a media file directly

**Option 3: Drag & Drop**
- Drag image/video files from folder → Drop into MediaViewer window

**Option 4: Command Line** (after installing)
```cmd
mediaviewer C:\Photos\Vacation\beach.jpg
mediaviewer "C:\Videos\Movie.mp4"
```

### Viewing Controls

**Images**:
- **Zoom In**: Scroll up / Ctrl + Plus
- **Zoom Out**: Scroll down / Ctrl + Minus
- **Pan**: Click & drag across image
- **Fullscreen**: Double-click image or press F
- **Previous/Next**: ← → arrow keys or Previous/Next buttons

**Videos**:
- **Play/Pause**: Space bar or play button
- **Fullscreen**: Double-click video or press F
- **Seek**: Click progress bar or arrow keys
- **Volume**: Click volume icon
- **Next Video**: Auto-plays when current ends

**General**:
- **Escape**: Exit fullscreen
- **Quit**: Close window or press Alt + F4

## Security & Privacy

MediaViewer is designed with security as a core principle:

- **Magic Bytes Validation**: Detects spoofed files
- **Symlink Handling**: Safely resolves symbolic links without sandbox escape
- **Path Isolation**: Access limited to media directories only
- **No Telemetry**: Complete offline operation, no tracking or data collection
- **CSP Headers**: Content Security Policy blocks injection attacks
- **Memory Safe**: Automatic cleanup, no memory leaks

## License

MIT License - Free for commercial and personal use.

---

**Made for media lovers, by developers**

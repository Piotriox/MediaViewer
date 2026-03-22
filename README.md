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

**Prerequisites**:
- Node.js 16+ ([nodejs.org](https://nodejs.org/))
- Rust ([rustup.rs](https://rustup.rs/))
- Windows: Visual Studio Build Tools (download during npm install)

**Setup**:
```cmd
npm install
npm run dev
```

**Build**:
```cmd
npm run release
```

Output goes to `src-tauri/target/release/bundle/`

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

### File Protection
- **Magic Bytes Validation**: Detects spoofed files (e.g., .exe renamed to .jpg)
- **Polyglot Detection**: Identifies files containing multiple embedded formats
- **Symlink Handling**: Safely resolves symbolic links without sandbox escape
- **Path Isolation**: Access limited to Pictures, Videos, Desktop, Downloads folders

### Data Safety
- **No Tracking**: Complete offline operation, no internet connection required
- **No Telemetry**: No data collection or phone-home functionality
- **No Persistence**: Temporary files auto-cleaned on exit
- **CSP Headers**: Content Security Policy blocks inline scripts and injection
- **Memory Cleanup**: Blob URLs revoked immediately after use

### System Integration
- **Minimal Permissions**: Only accesses media directories you choose
- **Full Source**: Open source for independent security audits
- **Signed Builds**: Windows builds digitally signed (when available)

## FAQ & Troubleshooting

### File Won't Open
- **Check**: File is in a supported format (PNG, JPG, MP4, MKV, etc.)
- **Try**: Drag file onto MediaViewer window instead
- **Debug**: Open Windows Explorer → Look for error message in app

### File Association Not Working
- **Windows**: Reinstall MediaViewer → Right-click media file → "Open with" → Choose MediaViewer
- **macOS/Linux**: Check if file is executable and installed in Applications folder

### "Access Denied" or "File Not Found"
- **Check**: File exists and you have read permissions
- **Try**: Close and restart MediaViewer
- **Note**: Limited to: Documents, Pictures, Videos, Desktop, Downloads folders

### Video Won't Play
- **Check**: File is MP4, MKV, WebM, MOV, etc. (not RAW or proprietary codecs)
- **Try**: Play in Windows Media Player / VLC first to verify file integrity
- **Note**: Browser requires user interaction to play (autoplay blocked by design)

### Slow Performance / Stuttering
- **Try**: Close other applications to free up system RAM
- **Check**: File isn't corrupted (try opening elsewhere)
- **Note**: First load may be slower due to file validation

### How to Uninstall
- **Windows**: Settings → Apps → MediaViewer → Uninstall
- **macOS**: Drag MediaViewer from Applications to Trash
- **Linux**: Depends on package manager used for installation

## Project Structure

```
MediaViewer/
├── frontend/               # Vanilla JavaScript + Vite
│   ├── src/
│   │   ├── main.js        # Application logic & state
│   │   ├── validation.js  # File validation, MIME checking
│   │   ├── utils.js       # URL & memory management
│   │   ├── logger.js      # Logging utilities
│   │   └── style.css      # Styling
│   ├── index.html         # App shell
│   └── package.json
│
├── src-tauri/             # Tauri backend (Rust)
│   ├── src/
│   │   ├── main.rs        # Entry point
│   │   └── lib.rs         # Window init, file associations
│   ├── tauri.conf.json    # Security config
│   └── Cargo.toml
│
└── README.md              # This file
```

## Technical Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Vanilla JS + Vite | Fast, minimal dependencies |
| **Backend** | Rust + Tauri 2.x | Native OS integration |
| **Styling** | CSS 3 | Responsive design |
| **Build** | npm + cargo | Cross-platform compilation |

## Support & Contribution

- **Report Bugs**: Create an issue on GitHub
- **Request Features**: Use GitHub Discussions
- **Contribute Code**: Pull requests welcome!
- **Documentation**: See [DEVELOPMENT.md](DEVELOPMENT.md) for setup

## License

MIT License - Free for commercial and personal use.

---

**Made for media lovers, by developers**

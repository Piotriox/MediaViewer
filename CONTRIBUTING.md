# Contributing to MediaViewer

Thank you for your interest in contributing! This guide covers development setup, architecture, and the build process.

## Getting Started

### Prerequisites

**All Platforms:**
- Node.js 16+ ([nodejs.org](https://nodejs.org/))
- Rust 1.77+ ([rustup.rs](https://rustup.rs/))
- Git

**Windows 10+:**
- Visual Studio Build Tools with "Desktop development with C++"

**Linux:**
- Build tools: `build-essential libssl-dev libgtk-3-dev libwebkit2gtk-4.0-dev`
- Ubuntu: `sudo apt-get install -y build-essential libssl-dev libgtk-3-dev libwebkit2gtk-4.0-dev libayatana-appindicator3-dev librsvg2-dev`
- Fedora: `sudo dnf groupinstall "Development Tools"` + dev libraries

**macOS:**
- Xcode Command Line Tools: `xcode-select --install`
- Optional: Homebrew for package management

### Installation

```bash
# Clone repository
git clone <repository-url>
cd MediaViewer

# Install dependencies
npm install
```

## Development Workflow

### Start Development Server

```bash
npm run dev
```

This launches:
- Vite dev server (http://localhost:5173)
- Tauri app with hot-reload
- DevTools available via F12

### Frontend Development

- Code location: `frontend/src/`
- Auto hot-reload on changes
- Check console (F12) for errors

**Key modules:**
- `main.js` - State management & event handlers
- `validation.js` - File validation, magic bytes checking
- `utils.js` - URL & memory management
- `logger.js` - Logging utilities
- `style.css` - UI styling

### Backend Development

- Code location: `src-tauri/src/`
- Changes require app restart
- Use `log::info!()`, `log::error!()` for logging

**Key files:**
- `lib.rs` - Window init, file association, asset protocol
- `main.rs` - Entry point

### Testing

```bash
# Run tests
npm --prefix frontend run test

# Watch mode
npm --prefix frontend run test -- --watch

# Coverage report
npm --prefix frontend run test:coverage
```

## Architecture Overview

### Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vanilla JavaScript + Vite |
| **Backend** | Rust + Tauri 2.x |
| **Styling** | CSS 3 (light/dark mode) |
| **Testing** | Vitest |

### Directory Structure

```
MediaViewer/
├── frontend/                    # Vite + JavaScript
│   ├── src/
│   │   ├── main.js             # App entry & state
│   │   ├── validation.js       # File type checking
│   │   ├── utils.js            # URL management
│   │   ├── logger.js           # Logging
│   │   ├── style.css           # Styling
│   │   └── validation.test.js  # Tests
│   └── package.json
├── backend/                     # Tauri + Rust
│   ├── src/
│   │   ├── main.rs            # Entry point
│   │   └── lib.rs             # Window init & file association
│   ├── Cargo.toml             # Dependencies
│   └── tauri.conf.json        # Security config
└── docs/                        # Platform-specific guides
```

### Data Flow

```
User Action (drag-drop / file select)
    ↓
File Validation (extension, size, magic bytes)
    ↓
Blob URL Creation (memory management)
    ↓
Playlist Build
    ↓
Media Display (image/video)
    ↓
Event Listeners (zoom, pan, play/pause)
```

### State Management

```javascript
state = {
  playlist: [],           // Array of MediaItem objects
  currentIndex: 0,
  currentKind: 'image'|'video'|null,
  urlsToRevoke: Set,      // Blob URL cleanup tracking
  imageZoom: 1,
  imagePanX: 0,
  imagePanY: 0
}
```

### File Validation

Three layers of validation:
1. **Extension Check** - Verify supported format (.jpg, .mp4, etc.)
2. **MIME Type Matching** - Ensure file type matches extension
3. **Magic Bytes** - Deep format validation (PNG IHDR, MP4 ftyp, etc.)

**Supported Formats:**
- Images: PNG, JPG, JPEG, GIF, BMP, WebP, SVG
- Videos: MP4, WebM, OGG, MOV, MKV, AVI, WMV, M4V

## Building

### Development Build

```bash
npm run build
```

Output: `src-tauri/target/debug/app`

### Release Build (Optimized)

```bash
npm run release
```

Generates installers:
- **Windows**: NSIS (.exe) + MSI in `bundle/nsis/` and `bundle/msi/`
- **Linux**: DEB, AppImage, RPM in `bundle/deb/`, `bundle/appimage/`, etc.
- **macOS**: DMG installer in `bundle/dmg/`

### Build Artifacts

```
src-tauri/target/release/bundle/
├── nsis/          # Windows NSIS installer
├── msi/           # Windows MSI installer
├── deb/           # Linux DEB package
├── appimage/      # Linux AppImage
├── rpm/           # Linux RPM package
└── dmg/           # macOS DMG installer
```

## Platform-Specific Notes

### Windows 10+

Installers automatically register file associations. To manually:
1. Right-click media file
2. "Open with" → "Choose another app"
3. Select MediaViewer
4. Check "Always use this app"

### Linux

Manual file association after installation:

```bash
# Create .desktop file
cat > ~/.local/share/applications/MediaViewer.desktop << 'EOF'
[Desktop Entry]
Type=Application
Name=MediaViewer
Exec=/path/to/app
MimeType=image/png;image/jpeg;video/mp4;...
EOF

# Update database
update-desktop-database ~/.local/share/applications
```

### macOS

File associations register automatically. For universal binaries (Intel + Apple Silicon):

```bash
rustup target add aarch64-apple-darwin x86_64-apple-darwin
npm run release
```

## Debugging

### Browser DevTools

Press **F12** in the app to open Chrome DevTools (inspect, console, profiler).

### Console Output

JavaScript:
```javascript
import { logger } from './logger.js';

logger.error('Error', { details });
logger.info('Info');
logger.debug('Debug'); // Dev only
```

Rust:
```rust
log::error!("Error: {}", msg);
log::info!("Info: {}", msg);
```

### Troubleshooting

| Issue | Solution |
|-------|----------|
| "Module not found" | `npm install --prefix frontend` |
| App won't start | Check console for errors, run `npm run dev` |
| Build fails | `cd src-tauri && cargo clean && cargo build` |
| Port 5173 in use | Kill process or wait 30s |
| Rust not found | `source $HOME/.cargo/env` or restart terminal |

## Code Style

### JavaScript

```javascript
// Use imports
import { logger } from './logger.js';

// JSDoc for functions
/**
 * Play media at index
 * @param {number} index - Playlist index
 */
function playMedia(index) { }

// Use const, template strings
const msg = `Error: ${error.message}`;
```

### Rust

```rust
use log::{error, info, warn};

// Descriptive error handling
if let Err(e) = operation() {
    error!("Operation failed: {}", e);
    continue;
}
```

## Performance Notes

- **First build**: 5-10 minutes (dependencies compile)
- **Incremental builds**: Frontend ~5-10s, Rust ~10-30s
- **Release build**: 5-10 minutes (optimized)

Speed up:
- Use SSD (not HDD)
- 8+ GB RAM
- Modern multi-core CPU

## Security Considerations

- **Content Security Policy**: Only local + asset:// + blob: URLs
- **Path Isolation**: Access limited to media directories
- **Magic Bytes Validation**: Detect spoofed files
- **Symlink Resolution**: Safely resolves without escape
- **No Telemetry**: Complete offline operation

## Reporting Issues

- **Bugs**: Describe steps to reproduce, expected vs actual behavior
- **Enhancements**: Explain use case and benefits
- **Performance**: Include OS, RAM, file size, reproduction steps

## Submitting Changes

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test: `npm run test`
3. Commit with descriptive message
4. Push and create Pull Request
5. Ensure CI/CD passes

## Additional Resources

- **Tauri Docs**: https://tauri.app/
- **Vite Docs**: https://vitejs.dev/
- **Rust Book**: https://doc.rust-lang.org/book/
- **MDN Web Docs**: https://developer.mozilla.org/

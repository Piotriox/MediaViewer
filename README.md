# MediaViewer

A lightweight Windows desktop media viewer built with Tauri and Vite. Open, browse, and play image and video files with an intuitive interface.

## 🖥️ Requirements

- **Windows Only**: Windows 10 or later (x86_64)
- .NET Framework or Visual C++ Redistributable

## Features

✅ **Image Support**
- PNG, JPG, JPEG, GIF, BMP, WebP, SVG
- Click to toggle fullscreen
- Memory-efficient display

✅ **Video Support**
- MP4, WebM, Ogg, MOV, MKV, AVI, WMV, M4V
- Native HTML5 video controls
- Autoplay prevention handling
- Auto-advance to next video on end

✅ **File Association**
- Double-click media files to open in MediaViewer
- Windows file association support
- Multi-file opening

✅ **Security**
- Proper Content Security Policy (CSP)
- Limited asset protocol scope
- File path validation
- Input validation for all files

✅ **Developer Experience**
- Clean, modular JavaScript architecture
- Comprehensive error handling and logging
- Unit tests with Vitest
- Documented code with JSDoc

## Project Structure

```
MediaViewer/
├── frontend/                    # Vite + JavaScript frontend
│   ├── src/
│   │   ├── main.js             # Application entry point & initialization
│   │   ├── validation.js       # File type and path validation
│   │   ├── utils.js            # URL management and cleanup
│   │   ├── logger.js           # Logging utilities
│   │   ├── style.css           # UI styling
│   │   ├── validation.test.js  # Unit tests
│   │   └── assets/             # Images and static files
│   ├── index.html              # HTML structure
│   ├── package.json            # Frontend dependencies
│   └── vitest.config.js        # Test configuration
│
├── src-tauri/                  # Rust/Tauri backend
│   ├── src/
│   │   ├── main.rs            # Rust entry point
│   │   └── lib.rs             # Window setup, file association handling
│   ├── Cargo.toml             # Rust dependencies
│   └── tauri.conf.json        # Security config, window settings
│
├── package.json               # Root workspace package
└── README.md                  # This file
```

## Setup & Installation

### Prerequisites (Windows)

- **Windows 10 or later** (x86_64)
- **Visual Studio Build Tools** or **Visual C++ Build Tools**
  - Download from [Microsoft Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/)
  - Install "Desktop development with C++" workload
- **Node.js** 16+ LTS (Windows)
  - Download from [nodejs.org](https://nodejs.org/)
- **Rust** (Windows)
  - Download from [https://rustup.rs/](https://rustup.rs/)
  - Use x64 MSVC version during installation

### Install Dependencies

```cmd
REM Install root and frontend dependencies
npm install

REM Tauri dependencies are downloaded automatically during build
```

## Running the App

### Development Mode (Windows)

```cmd
npm run dev
```

This starts:
- Vite dev server on `http://localhost:5173`
- Tauri app with hot-reload enabled
- Browser DevTools accessible in the app

### Building for Release (Windows)

```cmd
npm run release
```

Creates Windows installer (.exe) and portable version in:
- `src-tauri/target/release/bundle/msi/` (Windows Installer)
- `src-tauri/target/release/bundle/nsis/` (NSIS Setup)

The installer includes file association setup for media files.

## Usage

### Select Files
1. Click "Select Files" button
2. Choose one or more images/videos
3. First file plays automatically in fullscreen

### Controls
- **Play**: Play current media (use if stopped)
- **Previous** / **Next**: Navigate playlist
- **Escape Key**: Exit fullscreen
- **Click Media**: Toggle fullscreen while playing

### File Association (Windows)
1. Build the release version: `npm run release`
2. Run the installer from `src-tauri/target/release/bundle/nsis/`
3. During installation, file associations are configured automatically
4. Media files (.jpg, .png, .mp4, .mkv, etc.) open with MediaViewer by default

## Testing

Run unit tests with coverage:

```cmd
REM Run tests
npm --prefix frontend run test

REM Run tests with coverage
npm --prefix frontend run test:coverage
```

Tests are located in `frontend/src/*.test.js`

## Architecture

### Frontend (JavaScript)
- **State Management**: Centralized state object in `main.js`
- **Validation**: Dedicated module for file type and path checking
- **Error Handling**: Try-catch blocks with detailed error logging
- **Memory Management**: ObjectURL revocation on cleanup
- **Logging**: Console-based logger with levels (error, warn, info, debug)

### Backend (Rust)
- **File Association**: Handles command-line arguments from Windows file associations
- **Security**: Validates file paths exist before allowing asset protocol access
- **Window Management**: Creates window with security config and initialization script
- **Error Propagation**: Proper error handling instead of panics

## Security

### Content Security Policy
Configured in `src-tauri/tauri.conf.json`:
- Scripts: Only from self and wasm-unsafe-eval (required for Tauri)
- Styles: Self + unsafe-inline for styling
- Media: Blob, asset, and local URLs

### Asset Protocol Scope
Limited to user media directories:
- `$HOME/Pictures`
- `$HOME/Videos`
- `$HOME/Desktop`
- `$HOME/Downloads`
- `$TEMP`

### File Validation
- Extension-based type checking
- Path traversal prevention (`..` and `//` rejected)
- File existence validation before opening
- Size limits can be added in `validation.js`

## Troubleshooting

### "npm: command not found"
Install Node.js from [nodejs.org](https://nodejs.org/)

### "Rust not found"
Install from [rustup.rs](https://rustup.rs/)

### Blank window or files won't load
- Check browser DevTools in the app (F12)
- Look for errors in the console
- Verify file paths are valid and accessible

### File association not working
- Rebuild and reinstall: `npm run tauri build`
- Use the generated `.exe` installer, not dev mode
- Restart Windows after installation

### Autoplay blocked
Modern browsers require user interaction for video autoplay. The app shows:
> "Video loaded. Click Play to start"

This is expected behavior.

## Development Guidelines

### Code Style
- **Formatting**: 2-space indentation
- **Language**: English only (comments, strings, variable names)
- **JSDoc**: Required for exported functions
- **Error Handling**: Never silent catch blocks—always log errors

### Adding New Features
1. Create feature in dedicated module (e.g., `src/features/xyz.js`)
2. Add unit tests in `src/*.test.js`
3. Update JSDoc and comments
4. Test in development: `npm run tauri dev`

### Debugging
- Frontend: Press F12 in the app window for DevTools
- Rust: Use `log::info!()` and check console output
- Network: Asset protocol requests visible in DevTools Network tab

## Future Improvements

- [ ] Playlist save/load (JSON format)
- [ ] Thumbnail previews
- [ ] Zoom/pan for large images
- [ ] Video seek bar
- [ ] Keyboard shortcuts customization
- [ ] Dark/light theme toggle
- [ ] Directory/folder browsing
- [ ] Slideshow mode with intervals
- [ ] Rotation/flip controls
- [ ] i18n (internationalization) support

## License

MIT

## Contributing

Contributions welcome! Please ensure:
1. Tests pass: `npm --prefix frontend run test`
2. Code is documented with JSDoc
3. English comments and variable names
4. Error handling is explicit (no silent failures)

## Support

For issues or feature requests, open an issue on GitHub.

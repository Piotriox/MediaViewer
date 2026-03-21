# Build Guide

Complete instructions for building MediaViewer for Windows, Linux, and macOS.

## Quick Start (All Platforms)

```bash
# Install dependencies
npm install

# Development build with hot-reload
npm run dev

# Release build (optimized, platform-specific installer)
npm run release
```

## Platform-Specific Setup

MediaViewer supports three platforms. Choose your platform for detailed setup instructions:

### 🪟 **Windows 10+ (x86_64)**
See [WINDOWS.md](WINDOWS.md) for detailed Windows build setup and troubleshooting.

### 🐧 **Linux (x86_64)**
See [LINUX.md](LINUX.md) for detailed Linux build setup and troubleshooting.

### 🍎 **macOS (x86_64, ARM64)**
See [MACOS.md](MACOS.md) for detailed macOS build setup and troubleshooting.

## General Build Commands

All platforms share these commands:

| Command | Purpose | Output |
|---------|---------|--------|
| `npm run dev` | Development with hot-reload | Dev server + App window |
| `npm run build` | Development/debug build | Binary in `target/debug/` |
| `npm run release` | Production release build | Installer + Binary in `target/release/bundle/` |

## Build Artifacts

### Development Build
```
src-tauri/target/debug/
├── app.exe (Windows)
├── app (Linux/macOS)
└── deps/
```

### Release Build
```
src-tauri/target/release/
├── bundle/
│   ├── nsis/          # Windows NSIS installer (.exe)
│   ├── msi/           # Windows MSI installer
│   ├── deb/           # Linux DEB package
│   ├── appimage/      # Linux AppImage
│   ├── rpm/           # Linux RPM package
│   └── dmg/           # macOS DMG installer
└── app               # Application binary
```

## Environment Variables

The application dynamically adapts to each platform:

- **Windows**: Accesses `$USERPROFILE` (C:\Users\username) and `$TEMP`
- **Linux**: Accesses `$HOME` (/home/username) and `/tmp`
- **macOS**: Accesses `$HOME` (/Users/username) and `/tmp`

File association for media files works natively on all platforms.

## Troubleshooting

### General Issues
- Ensure Rust is installed and up-to-date: `rustup update`
- Ensure Node.js LTS is installed: `node --version`
- Clear build cache: `npm run clean` (if available) or `rm -rf src-tauri/target`

### Platform-Specific Issues
See the platform-specific guide for your OS:
- [Windows Troubleshooting](WINDOWS.md#troubleshooting)
- [Linux Troubleshooting](LINUX.md#troubleshooting)
- [macOS Troubleshooting](MACOS.md#troubleshooting)

### Long build times on first build
**Expected behavior** - First build downloads and compiles dependencies. Subsequent builds are faster.

### Permission denied errors
**Solution**: Run terminal as Administrator (right-click → "Run as administrator")

## Build Outputs

### NSIS Installer (Recommended)
- File: `MediaViewer_0.1.0_x64-setup.exe`
- Size: ~40-60 MB
- Includes: File association setup
- Installation: Requires administrator privileges

### MSI Installer
- File: `MediaViewer_0.1.0_x64.msi`
- Size: ~40-60 MB
- Installation: Enterprise Windows environments

## File Association Setup

The installer automatically:
1. Associates image files (.jpg, .png, .gif, .bmp, .webp, .svg)
2. Associates video files (.mp4, .webm, .mkv, .avi, .mov, .wmv, .m4v, .ogg)
3. Registers context menu "Open with MediaViewer"
4. Creates start menu shortcuts

To manually associate files after installation:
1. Right-click media file
2. Select "Open with..." 
3. Choose MediaViewer
4. Check "Always use this app"

## Development Tips

### Enable Logging in Development

Log output appears in:
- Console (F12 in app)
- Terminal where you ran `npm run dev`

### Hot-reload
- Edit `frontend/src/*.js` files → auto-reload in app
- Edit `src-tauri/src/*.rs` files → requires restart

### Testing

Run frontend tests:
```cmd
npm --prefix frontend run test
```

With coverage:
```cmd
npm --prefix frontend run test:coverage
```

Watch mode (tests rerun on file changes):
```cmd
npm --prefix frontend run test -- --watch
```

## CI/CD

To automate builds, use:
- GitHub Actions (recommended)
- Azure Pipelines
- GitLab CI

Example GitHub Actions workflow template available in `.github/workflows/` (if present).

## Support

For Tauri-specific issues:
- Docs: https://tauri.app/
- GitHub: https://github.com/tauri-apps/tauri

For Node/Vite issues:
- Docs: https://vitejs.dev/
- GitHub: https://github.com/vitejs/vite

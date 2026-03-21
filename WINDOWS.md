# Windows Build Guide

Complete instructions for building MediaViewer on Windows 10+.

## System Requirements

### Minimum Requirements
- **OS**: Windows 10 (Build 1909) or later, x86_64
- **RAM**: 4 GB minimum, 8 GB recommended
- **Disk**: 5 GB free space for build tools

### Required Software

#### 1. Visual Studio Build Tools
Download and install from: https://visualstudio.microsoft.com/downloads/

Select these workloads during installation:
- "Desktop development with C++"
- Include: MSVC, Windows 10 SDK, CMake tools

#### 2. Rust
Install from: https://rustup.rs/

During installation:
- Choose "x64 MSVC" as the default toolchain
- Let installer modify your PATH

Verify installation:
```cmd
rustc --version
cargo --version
```

#### 3. Node.js
Install from: https://nodejs.org/ (LTS version recommended)

Verify installation:
```cmd
node --version
npm --version
```

## Building Steps

### 1. Clone and Install Dependencies

```cmd
cd C:\path\to\MediaViewer
npm install
```

### 2. Development Build (for testing)

```cmd
npm run dev
```

This starts:
- Vite dev server on http://localhost:5173
- Tauri app with hot-reload
- DevTools accessible via F12 in the app

### 3. Release Build

Create optimized installer:

```cmd
npm run release
```

Build artifacts appear in:
```
src-tauri/target/release/bundle/
├── nsis/           # NSIS installer (.exe)
└── msi/            # Windows Installer (.msi)
```

### 4. Building Without NSIS (Direct EXE)

If you only want the application executable without installer:

```cmd
npm run build
```

The executable will be in:
```
src-tauri/target/release/
```

## File Association

### Supported File Types

**Images**:
- `.png`, `.jpg`, `.jpeg`, `.gif`, `.bmp`, `.webp`, `.svg`

**Videos**:
- `.mp4`, `.webm`, `.ogg`, `.mov`, `.mkv`, `.avi`, `.wmv`, `.m4v`

### Registry Integration

When installed, MediaViewer registers:

```
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\FileExts\
  [.jpg, .png, .mp4, etc.]
  UserChoice → MediaViewer
```

Right-click context menu:
```
HKEY_CLASSES_ROOT\[filetype]\shell\
  Open With → MediaViewer
```

### Manual File Association

To manually set file types to open with MediaViewer:

1. Right-click media file
2. "Open with" → "Choose another app"
3. Select "MediaViewer"
4. Check "Always use this app to open [type] files"

To revert:
1. Right-click file
2. "Open with" → "Choose another app"
3. Select preferred application
4. Optionally: "Always use this app"

## Environment Variables

The application uses environment variables in configuration:

```json
// src-tauri/tauri.conf.json
{
  "assetProtocol": {
    "scope": [
      "$USERPROFILE/Pictures",    // Windows
      "$USERPROFILE/Videos", 
      "$USERPROFILE/Desktop",
      "$USERPROFILE/Downloads",
      "$TEMP",
      "$HOME/Pictures",           // Fallback for Unix-like
      "$HOME/Videos",
      "$HOME/Desktop",
      "$HOME/Downloads",
      "/tmp"
    ]
  }
}
```

These map to:
- `$USERPROFILE` → `C:\Users\[YourUsername]` (Windows)
- `$TEMP` → `C:\Users\[YourUsername]\AppData\Local\Temp` (Windows)
- `$HOME` → `/home/[username]` (Linux) / `/Users/[username]` (macOS)
- `/tmp` → Unix system temp directory

### Environment Variables

The application uses environment variables in configuration:

```json
// src-tauri/tauri.conf.json
{
  "assetProtocol": {
    "scope": [
      "$USERPROFILE/Pictures",    // Windows
      "$USERPROFILE/Videos", 
      "$USERPROFILE/Desktop",
      "$USERPROFILE/Downloads",
      "$TEMP",
      "$HOME/Pictures",           // Fallback for Unix-like
      "$HOME/Videos",
      "$HOME/Desktop",
      "$HOME/Downloads",
      "/tmp"
    ]
  }
}
```

These map to:
- `$USERPROFILE` → `C:\Users\[YourUsername]` (Windows)
- `$TEMP` → `C:\Users\[YourUsername]\AppData\Local\Temp` (Windows)
- `$HOME` → `/home/[username]` (Linux) / `/Users/[username]` (macOS)
- `/tmp` → Unix system temp directory

## Troubleshooting

### Build Fails: "Could not find MSVC toolset"
**Solution**: Reinstall Visual Studio Build Tools selecting "Desktop development with C++"

### Build Fails: "Rust toolchain not found"
**Solution**: Reinstall Rust from https://rustup.rs/, ensure x64 MSVC is selected

### "npm: command not found"
**Solution**: Node.js not installed or not in PATH. Restart terminal after installing Node.js
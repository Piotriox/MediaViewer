# Linux Build Guide

Complete instructions for building MediaViewer on Linux (x86_64).

## System Requirements

### Minimum Requirements
- **OS**: Any modern Linux distribution (Ubuntu 20.04+, Debian 11+, Fedora 35+, etc.)
- **Architecture**: x86_64
- **RAM**: 4 GB minimum, 8 GB recommended
- **Disk**: 5 GB free space for build tools

### Required Software

#### 1. Build Tools & Development Headers

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y build-essential libssl-dev libgtk-3-dev libwebkit2gtk-4.0-dev libayatana-appindicator3-dev librsvg2-dev
```

**Fedora/RHEL/CentOS:**
```bash
sudo dnf groupinstall "Development Tools"
sudo dnf install openssl-devel gtk3-devel webkit2gtk3-devel libappindicator-gtk3-devel librsvg2-devel
```

**Arch Linux:**
```bash
sudo pacman -S base-devel gtk3 webkit2gtk openssl libappindicator-gtk3 librsvg
```

#### 2. Rust
Install from: https://rustup.rs/

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

Verify installation:
```bash
rustc --version
cargo --version
```

#### 3. Node.js
Install from: https://nodejs.org/ (LTS version recommended)

Or via package manager:

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Fedora:**
```bash
sudo dnf install nodejs npm
```

Verify installation:
```bash
node --version
npm --version
```

## Building Steps

### 1. Clone and Install Dependencies

```bash
cd ~/path/to/MediaViewer
npm install
```

### 2. Development Build (for testing)

```bash
npm run dev
```

This starts:
- Vite dev server on http://localhost:5173
- Tauri app with hot-reload
- DevTools accessible via F12 in the app

### 3. Release Build

Create optimized release build:

```bash
npm run release
```

Build artifacts appear in:
```
src-tauri/target/release/bundle/
├── deb/           # Debian package (.deb)
├── appimage/      # AppImage executable
└── rpm/           # RPM package (if supported)
```

### 4. Building Just the Binary

If you only want the application executable:

```bash
npm run build
```

The executable will be in:
```
src-tauri/target/release/app
```

## Installation

### From DEB Package
```bash
sudo apt install ./src-tauri/target/release/bundle/deb/mediaviewer_*.deb
```

### From AppImage
```bash
chmod +x ./src-tauri/target/release/bundle/appimage/MediaViewer_*.AppImage
./src-tauri/target/release/bundle/appimage/MediaViewer_*.AppImage
```

### From Binary
```bash
./src-tauri/target/release/app
```

## File Association (MIME Types)

### Automatic (via installer)
When installed via .deb package, file associations are set automatically.

### Manual Registration

**Create MIME type definitions:**

```bash
# Create .desktop file
cat > ~/.local/share/applications/MediaViewer.desktop << 'EOF'
[Desktop Entry]
Version=1.0
Type=Application
Name=MediaViewer
Exec=/path/to/app
Icon=mediaviewer
StartupNotify=true
Categories=Graphics;Viewer;
MimeType=image/png;image/jpeg;image/gif;image/bmp;image/webp;image/svg+xml;video/mp4;video/webm;video/ogg;video/quicktime;video/x-matroska;video/x-msvideo;video/x-ms-wmv;video/mp4v-es;
EOF

# Update database
update-desktop-database ~/.local/share/applications
```

### Verifying File Association

```bash
# Check what opens PNG files
xdg-mime query default image/png

# Set MediaViewer as default for PNG
xdg-mime default MediaViewer.desktop image/png
```

## Environment Variables

The application uses environment variables in configuration:

```json
// src-tauri/tauri.conf.json
{
  "assetProtocol": {
    "scope": [
      "$HOME/Pictures",
      "$HOME/Videos",
      "$HOME/Desktop",
      "$HOME/Downloads",
      "/tmp"
    ]
  }
}
```

These map to:
- `$HOME` → `/home/[username]` (Linux)
- `/tmp` → System temp directory

## Supported File Types

**Images**:
- `.png`, `.jpg`, `.jpeg`, `.gif`, `.bmp`, `.webp`, `.svg`

**Videos**:
- `.mp4`, `.webm`, `.ogg`, `.mov`, `.mkv`, `.avi`, `.wmv`, `.m4v`

## Troubleshooting

### Build Fails: "gtk3-devel not found"
**Solution**: Install required development libraries for your distribution (see above)

### Build Fails: "Could not find openssl-devel"
**Solution**: Install OpenSSL development package:
- Ubuntu: `sudo apt-get install libssl-dev`
- Fedora: `sudo dnf install openssl-devel`

### Build Fails: "Rust toolchain not found"
**Solution**: Run `source $HOME/.cargo/env` to update your PATH, or restart terminal

### "npm: command not found"
**Solution**: Node.js/npm not installed or not in PATH. Reinstall Node.js

### File association not working
**Solution**: Run `update-desktop-database ~/.local/share/applications` after creating .desktop file

### App won't start from menu
**Solution**: Edit the .desktop file and ensure `Exec=` path is absolute and correct

## Desktop Integration

### Creating an Icon
Place a PNG icon (e.g., 256x256) at:
- `~/.local/share/icons/hicolor/256x256/apps/mediaviewer.png`

Then update icon cache:
```bash
gtk-update-icon-cache ~/.local/share/icons/hicolor
```

### Creating a Menu Entry
The .desktop file automatically creates a menu entry after:
```bash
update-desktop-database ~/.local/share/applications
```

It should appear in Applications → Accessories or Graphics menu.

## Performance Notes

- First build will take 5-10 minutes as deps compile
- Subsequent builds are faster due to caching
- Release builds are fully optimized with LTO

## Advanced

### Build for Specific Target

Build for a different architecture (if cross-compiler available):

```bash
# Add target
rustup target add x86_64-unknown-linux-musl

# Build with musl (statically linked)
cd src-tauri
cargo build --release --target x86_64-unknown-linux-musl
```

### AppImage Configuration

To customize AppImage:
Edit `src-tauri/tauri.conf.json` bundle section.

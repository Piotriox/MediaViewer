# macOS Build Guide

Complete instructions for building MediaViewer on macOS (Intel & Apple Silicon).

## System Requirements

### Minimum Requirements
- **OS**: macOS 11 (Big Sur) or later
- **Architecture**: x86_64 or ARM64 (Apple Silicon)
- **RAM**: 4 GB minimum, 8 GB recommended
- **Disk**: 5 GB free space for build tools

### Required Software

#### 1. Xcode Command Line Tools
Install directly:

```bash
xcode-select --install
```

This installs:
- Clang C/C++ compiler
- LLVM toolchain
- macOS SDK headers

Or install full Xcode from App Store:
```
App Store → Xcode
```

#### 2. Rust
Install from: https://rustup.rs/

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

For Apple Silicon, Rust will automatically select the correct target.

Verify installation:
```bash
rustc --version
cargo --version
```

#### 3. Node.js
Install from: https://nodejs.org/ (LTS version recommended)

**Option A: Direct Download**
- https://nodejs.org/ (choose macOS installer)
- Select appropriate version for your Mac (Intel or Apple Silicon)

**Option B: Homebrew**
```bash
brew install node
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

Create optimized DMG installer:

```bash
npm run release
```

Build artifacts appear in:
```
src-tauri/target/release/bundle/
└── dmg/           # macOS DMG installer (.dmg)
```

### 4. Building Just the App Bundle

Build application without creating DMG:

```bash
npm run build
```

The app bundle will be in:
```
src-tauri/target/release/bundle/macos/
└── MediaViewer.app
```

## Installation

### From DMG File
1. Open the generated `.dmg` file
2. Drag MediaViewer.app into Applications folder
3. Launch from Applications or Spotlight

### Direct App Bundle
After running `npm run build`, the app is directly in:
```
src-tauri/target/release/bundle/macos/MediaViewer.app
```

You can run it directly:
```bash
open src-tauri/target/release/bundle/macos/MediaViewer.app
```

## File Association (UTType)

### Automatic (via DMG installer)
When installed via DMG, file associations are registered automatically.

### Manual Registration

MediaViewer automatically registers file types via `tauri.conf.json`. Supported types:

**Images**:
- `public.png`, `public.jpeg`, `com.bmp`, `com.gif`, `image.webp`, `public.svg-image`

**Videos**:
- `public.mpeg-4`, `public.webm`, `com.apple.quicktime-movie`, `public.3gpp`, `com.apple.mpeg-v`, `public.avi`, `public.windows-media-video`

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
- `$HOME` → `/Users/[username]` (macOS)
- `/tmp` → System temp directory

## Supported File Types

**Images**:
- `.png`, `.jpg`, `.jpeg`, `.gif`, `.bmp`, `.webp`, `.svg`

**Videos**:
- `.mp4`, `.webm`, `.ogg`, `.mov`, `.mkv`, `.avi`, `.wmv`, `.m4v`

## Universal Binary (Apple Silicon + Intel)

By default, Rust builds for your current architecture. To build a universal binary covering both architectures:

```bash
# Install additional target
rustup target add aarch64-apple-darwin x86_64-apple-darwin

cd src-tauri

# Build for both architectures
cargo build --release --target aarch64-apple-darwin
cargo build --release --target x86_64-apple-darwin

# Combining is handled by Tauri's build system
npm run release
```

The resulting DMG will work on both Intel and Apple Silicon Macs.

## Troubleshooting

### Build Fails: "Could not find clang/LLVM"
**Solution**: Install Xcode Command Line Tools:
```bash
xcode-select --install
```

### Build Fails: "Rust toolchain not found"
**Solution**: 
1. Run `source $HOME/.cargo/env`
2. Or restart terminal/shell
3. Verify with `rustc --version`

### "npm: command not found"
**Solution**: Node.js not installed or not in PATH. Reinstall Node.js from https://nodejs.org/

### Code Signing Errors
**Solution**: Code signing is automatic with default Apple Development identity. If you need specific signing:
```bash
cd src-tauri
cargo tauri build --release -- --codesign-identity "Developer ID Application"
```

### "App is damaged and can't be opened"
**Solution**: This happens if code signing certificate doesn't match. Either:
1. Right-click app → Open (override security warning)
2. Or resign with your certificate
3. Or disable Gatekeeper (security risk): `sudo spctl --master-disable`

### DMG won't mount
**Solution**: 
1. Try copying file again
2. Try different download method
3. Check disk space

## Testing on Different Architectures

### Intel Mac
```bash
rustup target add x86_64-apple-darwin
npm run release
```

### Apple Silicon Mac
```bash
rustup target add aarch64-apple-darwin
npm run release
```

### Testing Universal Binary
```bash
# Check architecture of compiled binary
file ~/path/to/app

# Should show: Mach-O universal binary with 2 architectures
```

## Code Signing & Notarization (for Distribution)

For distributing outside App Store:

### Code Signing
```bash
# Sign the app
codesign --force --deep --strict --options=runtime \
  --sign "Developer ID Application" \
  src-tauri/target/release/bundle/macos/MediaViewer.app
```

### Notarization (Apple requirement for distribution)
```bash
# Create ZIP for notarization
ditto -c -k --keepParent \
  src-tauri/target/release/bundle/macos/MediaViewer.app \
  mediaviewer-notarize.zip

# Submit to Apple
xcrun altool --notarize-app -f mediaviewer-notarize.zip \
  -t osx -u "apple-id@example.com" -p "@keychain:notary-password"

# Staple ticket to DMG after approval
xcrun altool --staple-notarization mediaviewer.dmg
```

## Performance Notes

- First build takes 5-10 minutes as dependencies compile
- Subsequent builds are much faster due to caching
- Apple Silicon builds are generally faster than Intel
- Release builds are fully optimized

## Gatekeeper & Security

When distributing outside App Store, users may see security warnings:

**Users can work around by**:
1. Control+Click the app (instead of double-click)
2. Select "Open"
3. Click "Open" to confirm

Or:
```bash
sudo spctl --add /Applications/MediaViewer.app
```

This is normal for unsigned/non-notarized apps outside the App Store.

## Advanced: Custom Build Location

To specify build output directory:

```bash
npm run release -- --outDir /path/to/output
```

## Resources

- [Tauri macOS Docs](https://tauri.app/en/docs)
- [Apple Notarization](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
- [Code Signing Guide](https://developer.apple.com/support/code-signing/)

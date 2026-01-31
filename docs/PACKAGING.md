# PyInstaller Configuration

This guide explains how to package the Media Player application as a standalone executable.

## Quick Start

```bash
# 1. Install PyInstaller
pip install pyinstaller

# 2. Create executable
pyinstaller --onefile --windowed main.py

# 3. Run the executable
dist/main.exe  # Windows
dist/main      # Linux/macOS
```

## Detailed Instructions

### Windows

```batch
# Activate virtual environment
.venv\Scripts\activate

# Install PyInstaller
pip install pyinstaller

# Create executable (one file, no console window)
pyinstaller --onefile --windowed main.py

# Executable location
dist\main.exe

# Optional: Add icon
pyinstaller --onefile --windowed --icon=icon.ico main.py
```

### macOS

```bash
# Activate virtual environment
source .venv/bin/activate

# Install PyInstaller
pip install pyinstaller

# Create executable
pyinstaller --onefile --windowed main.py

# Create app bundle (recommended)
pyinstaller --onefile --windowed --osx-bundle-identifier=com.mediaviewer main.py

# Executable location
dist/main
```

### Linux

```bash
# Activate virtual environment
source .venv/bin/activate

# Install PyInstaller
pip install pyinstaller

# Create executable
pyinstaller --onefile --windowed main.py

# Executable location
dist/main

# Make executable (if needed)
chmod +x dist/main
```

## Advanced Configuration

### Using PyInstaller Spec File

Create `main.spec` for more control:

```python
# -*- mode: python ; coding: utf-8 -*-
a = Analysis(
    ['main.py'],
    pathex=[],
    binaries=[],
    datas=[],
    hiddenimports=['PySide6'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludedimports=[],
    noarchive=False,
)
pyz = PYZ(a.pure, a.zipped_data, cipher=None)
exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='MediaPlayer',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
```

Build with spec file:
```bash
pyinstaller main.spec
```

## Optimization Options

### Reduce File Size

```bash
# Use UPX compression
pyinstaller --onefile --windowed --upx-dir=/path/to/upx main.py

# Strip binary (Linux/macOS)
pyinstaller --onefile --windowed --strip main.py
```

### Include Custom Icon

```bash
# Windows
pyinstaller --onefile --windowed --icon=icon.ico main.py

# macOS
pyinstaller --onefile --windowed --icon=icon.icns main.py

# Linux (adds to spec file manually)
```

### Additional Hidden Imports

If you get import errors, add hidden imports:

```bash
pyinstaller --onefile --windowed --hidden-import=PySide6 main.py
```

## Distribution

### Windows

1. Create installer with NSIS or MSI tools
2. Or distribute the `.exe` file directly
3. Users can run without installing Python

### macOS

1. Create DMG file for distribution
2. Use `create-dmg` tool
3. Users can drag to Applications folder

### Linux

1. Create AppImage using `appimagetool`
2. Or distribute as tarball with executable
3. Users may need to install dependencies (uncommon with PyInstaller)

## Troubleshooting

### "Module not found" errors

Add to PyInstaller command:
```bash
--hidden-import=PySide6.QtMultimedia
--hidden-import=PySide6.QtMultimediaWidgets
```

### Video playback not working in bundled app

Ensure multimedia libraries are included. On Linux, you may need:
```bash
--collect-submodules PySide6
```

### File too large

- Use `--strip` option (Linux/macOS)
- Use `--upx` option for compression
- Consider two-file mode (`--onedir`) for development builds

### Application won't start

- Check for runtime errors: `main.exe > error.log 2>&1`
- Ensure all dependencies are listed in hidden imports
- Verify PySide6 multimedia plugins are included

## Output Structure

### One-file mode (`--onefile`)
```
dist/
└── main.exe  (or main on Linux/macOS)
```

### One-directory mode (`--onedir`)
```
dist/
└── main/
    ├── main.exe (or main)
    ├── PySide6/ (libraries)
    └── ... (dependencies)
```

## Verification

After building, test the executable:

1. **Standalone test**: Copy `dist` folder to another machine (same OS)
2. **No Python needed**: Verify Python is not installed on test machine
3. **File operations**: Test opening various media files
4. **Error handling**: Verify error messages display correctly

## Performance

Bundled executables typically run slightly faster than Python scripts because:
- Python bytecode is compiled ahead of time
- No startup delay for module imports
- Optimized library loading

Slight drawbacks:
- Larger file size (typically 100-200 MB with PySide6)
- First launch may show slight delay as file is extracted

## Code Signing (Optional)

### Windows

```bash
# Sign executable with certificate
signtool sign /f certificate.pfx /p password /t http://timestamp.server main.exe
```

### macOS

```bash
# Code sign application
codesign --deep --force --verify --verbose --sign "Developer ID Application" dist/main.app

# Notarize (required for distribution)
xcrun altool --notarize-app --file dist/main.dmg --primary-bundle-id com.mediaviewer
```

## Next Steps

After creating the executable:

1. Test thoroughly on target OS
2. Create installer if distributing widely
3. Add version info (Windows only)
4. Consider code signing for distribution
5. Set up auto-update mechanism (optional)

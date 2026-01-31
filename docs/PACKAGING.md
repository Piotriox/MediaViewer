# PyInstaller Configuration

This guide explains how to package MediaViewer as a standalone executable.

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

## Platform-Specific Instructions

### Windows

```batch
# Activate virtual environment
.venv\Scripts\activate

# Install PyInstaller
pip install pyinstaller

# Create executable
pyinstaller --onefile --windowed main.py

# Find executable
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

# Create app bundle
pyinstaller --onefile --windowed --osx-bundle-identifier=com.mediaviewer main.py

# Find executable
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

# Make executable
chmod +x dist/main
```

## Advanced Configuration

### Using Spec File

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
    runtime_hooks=[],
    excludedimports=[],
)
pyz = PYZ(a.pure, a.zipped_data)
exe = EXE(pyz, a.scripts, a.binaries, a.zipfiles, a.datas,
    name='MediaViewer',
    debug=False,
    windowed=True,
    console=False)
```

Then run:
```bash
pyinstaller main.spec
```

## Optimization

### Add Icon

```bash
# Create icon.ico first, then:
pyinstaller --onefile --windowed --icon=icon.ico main.py
```

### Reduce File Size

```bash
# UPX compression (if available)
pyinstaller --onefile --windowed --upx-dir=/path/to/upx main.py
```

### Include Hidden Imports

If you get import errors:
```bash
pyinstaller --onefile --windowed --hidden-import=PySide6.QtMultimedia main.py
```

## Distribution

### Windows
- Distribute the `.exe` file directly
- Or create installer with NSIS/MSI tools
- Users don't need Python installed

### macOS
- Create DMG file for distribution
- Can be signed and notarized
- Drag-to-install experience

### Linux
- Create AppImage using appimagetool
- Or distribute as tarball with executable

## Performance

- **Executable Size**: 150-180 MB (includes Python runtime)
- **Startup Time**: 2-3 seconds
- **Memory**: 100-200 MB
- **Runtime**: Same as Python version

## Troubleshooting

| Problem | Solution |
|---------|----------|
| PyInstaller not found | Install: `pip install pyinstaller` |
| Missing PySide6 | Install: `pip install PySide6` |
| Icon not showing | Ensure .ico file exists |
| File size too large | Use `--onefile --windowed` and exclude modules |
| Video codecs not working | Ensure system has required codecs |
| Module not found | Add `--hidden-import=MODULE_NAME` |

## See Also

- [START_HERE.md](START_HERE.md) - Quick start
- [FEATURES.md](FEATURES.md) - Features overview
- [USAGE.md](USAGE.md) - Code examples
- [QUICKSTART.txt](QUICKSTART.txt) - Command reference

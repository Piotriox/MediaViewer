# MediaViewer

A native desktop media viewer built with **Python** and **PySide6** (Qt for Python). Supports viewing images and playing videos with hardware-accelerated playback.

## Features

### General
- Single-window desktop application
- Clean, minimal dark UI
- Native OS application behavior
- Cross-platform (Windows, macOS, Linux)

### Image Viewer
- Display images centered and fitted to window
- Mouse wheel zoom in/out (smooth scaling)
- Pan support with left mouse button drag
- Supports: JPG, PNG, GIF, BMP, WebP, TIFF, ICO

### Video Player
- Hardware-accelerated playback
- Play/Pause controls
- Timeline slider with seek support
- Volume control
- Time display (current / total)
- Supports: MP4, MKV, AVI, MOV, FLV, WMV, WebM, M4V, 3GP

## Installation

### Requirements
- Python 3.8+
- PySide6 (automatically installed with pip)

### Setup

1. Clone or download the project
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # On macOS/Linux: source .venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

### Launch without file
```bash
python main.py
```

### Open a media file
```bash
python main.py "path/to/media.jpg"
python main.py "path/to/video.mp4"
```

## Controls

### Image Viewer
- **Mouse Wheel Up**: Zoom in
- **Mouse Wheel Down**: Zoom out
- **Left Click + Drag**: Pan across image

### Video Player
- **Play/Pause Button**: Toggle playback
- **Timeline Slider**: Seek to position
- **Volume Slider**: Adjust volume

## Documentation

All documentation is located in the `docs/` folder:

## Performance Notes

- Image scaling uses Qt's `SmoothTransformation` mode for high quality
- Video playback uses hardware acceleration when available
- Smooth zoom without jank or stuttering
- Efficient memory management

## Supported Formats

### Images
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- BMP (.bmp)
- WebP (.webp)
- TIFF (.tiff)
- ICO (.ico)

### Videos
- MP4 (.mp4)
- Matroska (.mkv)
- AVI (.avi)
- QuickTime (.mov)
- Flash (.flv)
- Windows Media (.wmv)
- WebM (.webm)
- M4V (.m4v)
- 3GP (.3gp)

## License

See LICENSE file for details.

### Dependencies
- **PySide6**: Qt bindings for Python
- **No other external dependencies**

## Troubleshooting

**Application won't start:**
- Ensure PySide6 is installed: `pip install PySide6`
- Check Python version (requires 3.8+)

**Video won't play:**
- Ensure the file format is supported
- On Linux, you may need additional media codecs

**Image won't display:**
- File may be corrupted
- Ensure the file format is supported

## Features

- Open image and video files directly from the file system
- OS-level file association (right-click → open with)
- Image viewer
  - Fit to screen
  - Zoom with mouse wheel
- Video player
  - Play / Pause
  - Timeline control
  - Volume control
- Single-window, minimal UI
- Hardware-accelerated video playback via Qt

---

## Supported Formats

**Images**
- PNG
- JPG / JPEG
- BMP
- GIF (static)

**Videos**
- MP4
- MKV
- AVI
- MOV (codec support depends on OS)

---

## Tech Stack

- Python 3
- PySide6 (Qt for Python)
- Qt Multimedia
- PyInstaller (for distribution)

---

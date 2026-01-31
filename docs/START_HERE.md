# Getting Started with MediaViewer

Welcome to **MediaViewer** - a professional, cross-platform media viewer built with Python and PySide6.

## ⚡ Quick Start (2 minutes)

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the Application
```bash
python main.py
```

### 3. Open a Media File
```bash
python main.py "path/to/photo.jpg"
python main.py "path/to/movie.mp4"
```

## 🎮 Using the Application

### Image Viewer
| Action | Control |
|--------|---------|
| Zoom In | Scroll Mouse Wheel Up |
| Zoom Out | Scroll Mouse Wheel Down |
| Pan | Click & Drag with Left Mouse |

### Video Player
| Action | Control |
|--------|---------|
| Play/Pause | Click Button |
| Seek | Drag Timeline Slider |
| Volume | Drag Volume Slider |

## 📋 Supported Formats

**Images**: JPG, PNG, GIF, BMP, WebP, TIFF, ICO

**Videos**: MP4, MKV, AVI, MOV, FLV, WMV, WebM, M4V, 3GP

## ✨ Features

✅ Single-window native desktop application  
✅ Dark modern theme  
✅ Image viewing with zoom and pan  
✅ Video playback with hardware acceleration  
✅ Command-line file argument support  
✅ Cross-platform (Windows, macOS, Linux)  
✅ PyInstaller ready for distribution  

## 📁 Project Structure

```
MediaViewer/
├── main.py                      Entry point
├── core/
│   ├── file_handler.py         File type detection
│   └── theme.py                Dark theme styling
├── ui/
│   ├── main_window.py          Main application window
│   ├── image_viewer.py         Image display with zoom/pan
│   └── video_player.py         Video playback with controls
└── docs/                        Documentation
```

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [QUICKSTART.txt](QUICKSTART.txt) | Command reference |
| [FEATURES.md](FEATURES.md) | Feature overview |
| [USAGE.md](USAGE.md) | Code examples and API |
| [PACKAGING.md](PACKAGING.md) | PyInstaller guide |
| [README.md](../README.md) | Main documentation |

## 🚀 Next Steps

### To Use the Application
→ Open a media file: `python main.py "file.jpg"`

### To Customize
→ Edit colors in `core/theme.py`  
→ Add formats in `core/file_handler.py`

### To Package
→ Read [PACKAGING.md](PACKAGING.md)  
→ Run: `pyinstaller --onefile --windowed main.py`

## 🐛 Troubleshooting

**Problem**: "ModuleNotFoundError: No module named 'PySide6'"  
**Solution**: `pip install -r requirements.txt`

**Problem**: "Video won't play"  
**Solution**: Check if format is supported, try MP4 format

**Problem**: "Application crashes"  
**Solution**: Ensure Python 3.8+, run `pip install --upgrade PySide6`

---

**Ready?** → Run `python main.py` and enjoy! 🎬 📸

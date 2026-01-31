# MediaViewer - Usage Guide

## Installation & Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Verify installation
python -c "from PySide6.QtWidgets import QApplication; print('PySide6 OK')"
```

## Running the Application

### Command Line

```bash
# Launch without file (shows placeholder)
python main.py

# Open an image file
python main.py "path/to/image.jpg"
python main.py "/home/user/Pictures/photo.png"

# Open a video file
python main.py "path/to/video.mp4"
python main.py "/home/user/Videos/movie.mkv"
```

## Programmatic Usage

### Create Custom Window

```python
from ui.main_window import MainWindow
from PySide6.QtWidgets import QApplication
import sys

def create_window():
    """Create and display MediaViewer window."""
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    window.open_file("example.jpg")
    sys.exit(app.exec())

if __name__ == "__main__":
    create_window()
```

### File Type Detection

```python
from core.file_handler import detect_file_type, FileType, is_valid_file

# Detect file type
file_type = detect_file_type("image.jpg")
if file_type == FileType.IMAGE:
    print("This is an image")
elif file_type == FileType.VIDEO:
    print("This is a video")

# Validate file before opening
if is_valid_file("path/to/file.jpg"):
    print("File is valid")
else:
    print("File not found or format not supported")
```

### Use Image Viewer

```python
from ui.image_viewer import ImageViewer

viewer = ImageViewer()
if viewer.load_image("photo.jpg"):
    print("Image loaded successfully")
    # Zoom in by factor of 1.5
    viewer.zoom(1.5)
```

### Use Video Player

```python
from ui.video_player import VideoPlayer

player = VideoPlayer()
if player.load_video("movie.mp4"):
    print("Video loaded successfully")
    player.play()
```

## API Reference

### MainWindow

```python
class MainWindow(QMainWindow):
    def open_file(file_path: str) -> bool:
        """Open a media file. Returns True if successful."""
        
    def show_placeholder():
        """Show placeholder widget."""
```

### ImageViewer

```python
class ImageViewer(QWidget):
    def load_image(file_path: str) -> bool:
        """Load image. Returns True if successful."""
        
    def zoom(factor: float):
        """Zoom by factor (1.0 = normal, 0.5 = half, 2.0 = double)."""
```

### VideoPlayer

```python
class VideoPlayer(QWidget):
    def load_video(file_path: str) -> bool:
        """Load video. Returns True if successful."""
        
    def play():
        """Start or resume playback."""
        
    def pause():
        """Pause playback."""
        
    def stop():
        """Stop playback and reset position."""
```

### file_handler

```python
class FileType(Enum):
    IMAGE = 1
    VIDEO = 2
    UNSUPPORTED = 3

def detect_file_type(file_path: str) -> FileType:
    """Detect if file is image or video."""
    
def is_valid_file(file_path: str) -> bool:
    """Check if file exists and format is supported."""
```

## Performance Tips

### Large Images
- The viewer uses smooth scaling which is CPU-intensive
- For very large images (>8000x8000), consider pre-scaling

### Video Playback
- Hardware acceleration is enabled by default
- Ensure graphics drivers are up to date
- Some codecs may not be available on all systems

### Memory Usage
- Image viewer keeps full resolution in memory
- Zoomed out images use less processing power
- Videos stream from disk with buffering

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "ModuleNotFoundError: No module named 'PySide6'" | Run `pip install -r requirements.txt` |
| Video won't play | Check codec support, try MP4 format |
| Image loads slowly | Check file size, reduce resolution |
| Application crashes | Ensure Python 3.8+, run `pip install --upgrade PySide6` |

## Code Structure

Each module is self-contained with clear responsibilities:

- **main.py** - Entry point, handles CLI arguments
- **core/file_handler.py** - File validation and type detection
- **core/theme.py** - UI styling and colors
- **ui/main_window.py** - Main window and widget switching
- **ui/image_viewer.py** - Image display with zoom/pan
- **ui/video_player.py** - Video playback with controls

## Future Enhancement Ideas

- Keyboard shortcuts (Space, arrows, etc.)
- Drag & drop file opening
- Recent files menu
- Fullscreen mode
- Playlist support
- Subtitle support

## See Also

- [START_HERE.md](START_HERE.md) - Quick start
- [FEATURES.md](FEATURES.md) - Feature overview
- [PACKAGING.md](PACKAGING.md) - PyInstaller guide
- [QUICKSTART.txt](QUICKSTART.txt) - Command reference

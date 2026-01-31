"""
Example usage and testing guide for the MediaViewer application.

This file demonstrates various ways to run the MediaViewer application.
"""

# =============================================================================
# INSTALLATION & SETUP
# =============================================================================

# 1. Install dependencies:
#    pip install -r requirements.txt

# 2. Verify installation:
#    python -c "from PySide6.QtWidgets import QApplication; print('PySide6 OK')"


# =============================================================================
# RUNNING THE APPLICATION
# =============================================================================

# From command line:

# 1. Launch without a file (shows placeholder)
#    python main.py

# 2. Open an image file
#    python main.py "C:\path\to\image.jpg"
#    python main.py "/home/user/Pictures/photo.png"

# 3. Open a video file
#    python main.py "C:\path\to\video.mp4"
#    python main.py "/home/user/Videos/movie.mkv"


# =============================================================================
# PROGRAMMATIC USAGE
# =============================================================================

# You can also use the application components directly in your own code:

from ui.main_window import MainWindow
from ui.image_viewer import ImageViewer
from ui.video_player import VideoPlayer
from core.file_handler import detect_file_type, FileType, is_valid_file


# Example: Create a custom window with media viewer
def example_custom_window():
    """Create and display the MediaViewer window."""
    from PySide6.QtWidgets import QApplication
    import sys
    
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    
    # Open a file
    window.open_file("example_media.jpg")
    
    sys.exit(app.exec())


# Example: Check file type before opening
def example_file_detection():
    """Demonstrate file type detection."""
    files = [
        "image.jpg",
        "video.mp4",
        "document.pdf"
    ]
    
    for file in files:
        file_type = detect_file_type(file)
        if file_type == FileType.IMAGE:
            print(f"{file} is an image")
        elif file_type == FileType.VIDEO:
            print(f"{file} is a video")
        else:
            print(f"{file} format not supported")


# Example: Validate before opening
def example_validate_file():
    """Validate file before opening."""
    file_path = "C:\\Users\\user\\Pictures\\photo.jpg"
    
    if is_valid_file(file_path):
        # Safe to open
        pass
    else:
        print("File not found or format not supported")


# =============================================================================
# KEYBOARD SHORTCUTS (Future Enhancement)
# =============================================================================

# Planned additions:
# - Space: Toggle play/pause (video)
# - Left/Right Arrow: Seek backward/forward (video)
# - Up/Down Arrow: Volume control (video)
# - Z: Fit to window (image)
# - C: Zoom to actual size (image)
# - F: Fullscreen toggle
# - Q: Quit application


# =============================================================================
# PERFORMANCE TIPS
# =============================================================================

# 1. Large Images
#    - The viewer uses smooth scaling which is CPU-intensive
#    - For very large images (>8000x8000), consider pre-scaling

# 2. Video Playback
#    - Hardware acceleration is enabled by default
#    - Ensure your graphics drivers are up to date
#    - Some codecs may not be available on all systems

# 3. Memory Usage
#    - Image viewer keeps full resolution in memory
#    - Zoomed out images use less processing
#    - Videos stream from disk with buffering


# =============================================================================
# PACKAGING WITH PYINSTALLER
# =============================================================================

# Create a standalone executable:
#
# 1. Install PyInstaller:
#    pip install pyinstaller
#
# 2. Create executable:
#    pyinstaller --onefile --windowed main.py
#
# 3. Find executable in 'dist' folder
#    dist/main.exe (Windows)
#    dist/main (Linux/macOS)
#
# The executable includes:
# - Python interpreter
# - All PySide6 libraries
# - Application code
# - No external dependencies needed


# =============================================================================
# TROUBLESHOOTING
# =============================================================================

# Issue: "ModuleNotFoundError: No module named 'PySide6'"
# Solution: pip install PySide6
#
# Issue: "Video won't play"
# Solutions:
#   - Check video codec support (MP4, H.264, H.265)
#   - Ensure video file is not corrupted
#   - Try converting to MP4 format
#
# Issue: "Image takes long time to load"
# Solutions:
#   - Check file size
#   - Reduce image resolution
#   - Check system memory availability
#
# Issue: "Application crashes on startup"
# Solutions:
#   - Check Python version (3.8+)
#   - Verify PySide6 installation: pip install --upgrade PySide6
#   - Check for corrupted .venv folder (delete and recreate)


if __name__ == "__main__":
    # This is just documentation; don't run it directly
    print(__doc__)

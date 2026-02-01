"""
MediaViewer - A native desktop media viewer built with PySide6.

Supports viewing images and playing videos with hardware acceleration.
Usage: python main.py [file_path]

Version: 1.0.0
Release Date: January 31, 2026
GitHub: https://github.com/your-username/MediaViewer
"""

import sys
from pathlib import Path

from PySide6.QtWidgets import QApplication
from PySide6.QtCore import Qt

from ui.main_window import MainWindow
from core.file_handler import is_valid_file

__version__ = "1.0.0"
__author__ = "Piotriox"
__license__ = "MIT"


def main():
    """Application entry point."""
    app = QApplication(sys.argv)
    
    # High DPI scaling is enabled by default in modern PySide6
    
    window = MainWindow()
    window.show()
    
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
        if is_valid_file(file_path):
            window.open_file(file_path)
        else:
            print(f"Error: Cannot open file '{file_path}'. File not found or format not supported.")
    
    sys.exit(app.exec())


if __name__ == "__main__":
    main()

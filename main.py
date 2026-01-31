"""
MediaViewer - A native desktop media viewer built with PySide6.

Supports viewing images and playing videos with hardware acceleration.
Usage: python main.py [file_path]
"""

import sys
from pathlib import Path

from PySide6.QtWidgets import QApplication
from PySide6.QtCore import Qt

from ui.main_window import MainWindow
from core.file_handler import is_valid_file


def main():
    """Application entry point."""
    app = QApplication(sys.argv)
    
    app.setAttribute(Qt.ApplicationAttribute.AA_EnableHighDpiScaling)
    
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

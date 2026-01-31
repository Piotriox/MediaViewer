"""Main application window."""

from PySide6.QtWidgets import QMainWindow, QStackedWidget, QLabel, QVBoxLayout, QWidget
from PySide6.QtCore import Qt

from core.file_handler import detect_file_type, FileType
from core.theme import get_stylesheet
from ui.image_viewer import ImageViewer
from ui.video_player import VideoPlayer


class MainWindow(QMainWindow):
    """Main application window."""
    
    def __init__(self):
        super().__init__()
        
        self.setWindowTitle("MediaViewer")
        self.setGeometry(100, 100, 1024, 768)
        
        # Create stacked widget to switch between viewers
        self.stacked_widget = QStackedWidget()
        
        # Create image viewer
        self.image_viewer = ImageViewer()
        self.stacked_widget.addWidget(self.image_viewer)
        
        # Create video player
        self.video_player = VideoPlayer()
        self.stacked_widget.addWidget(self.video_player)
        
        # Create placeholder widget
        self.placeholder = QWidget()
        placeholder_layout = QVBoxLayout()
        placeholder_label = QLabel("Open a media file to get started\n(Drag and drop or use command-line argument)")
        placeholder_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        placeholder_label.setStyleSheet("color: #b0b0b0; font-size: 14px;")
        placeholder_layout.addWidget(placeholder_label)
        self.placeholder.setLayout(placeholder_layout)
        self.stacked_widget.addWidget(self.placeholder)
        
        self.setCentralWidget(self.stacked_widget)
        
        # Apply theme
        self.setStyleSheet(get_stylesheet())
        
        # Show placeholder initially
        self.show_placeholder()
    
    def open_file(self, file_path: str) -> bool:
        """
        Open a media file.
        
        Args:
            file_path: Path to the media file
            
        Returns:
            True if file opened successfully, False otherwise
        """
        file_type = detect_file_type(file_path)
        
        if file_type == FileType.IMAGE:
            if self.image_viewer.load_image(file_path):
                self.stacked_widget.setCurrentWidget(self.image_viewer)
                self.setWindowTitle(f"MediaViewer - {file_path}")
                return True
            else:
                self.show_placeholder()
                return False
        
        elif file_type == FileType.VIDEO:
            if self.video_player.load_video(file_path):
                self.stacked_widget.setCurrentWidget(self.video_player)
                self.setWindowTitle(f"MediaViewer - {file_path}")
                return True
            else:
                self.show_placeholder()
                return False
        
        else:
            self.show_placeholder()
            return False
    
    def show_placeholder(self):
        """Show the placeholder widget."""
        self.stacked_widget.setCurrentWidget(self.placeholder)
        self.setWindowTitle("MediaViewer")
    
    def closeEvent(self, event):
        """Clean up when closing the window."""
        self.video_player.stop()
        event.accept()

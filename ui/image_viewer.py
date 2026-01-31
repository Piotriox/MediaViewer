"""Image viewer widget with zoom support."""

from PySide6.QtWidgets import QWidget, QVBoxLayout
from PySide6.QtGui import QPixmap, QWheelEvent, QTransform
from PySide6.QtCore import Qt, QSize, QPoint
from PySide6.QtWidgets import QLabel


class ImageViewer(QWidget):
    """Widget for displaying images with zoom and pan capabilities."""
    
    def __init__(self):
        super().__init__()
        self.image_label = QLabel()
        self.image_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.image_label.setStyleSheet("background-color: #1e1e1e;")
        
        layout = QVBoxLayout()
        layout.setContentsMargins(0, 0, 0, 0)
        layout.addWidget(self.image_label)
        self.setLayout(layout)
        
        self.original_pixmap = None
        self.current_pixmap = None
        self.zoom_level = 1.0
        self.min_zoom = 0.1
        self.max_zoom = 5.0
        self.pan_start = None
        self.pan_offset = QPoint(0, 0)
        
        # Enable mouse tracking for pan functionality
        self.setMouseTracking(True)
        
    def load_image(self, file_path: str) -> bool:
        """
        Load and display an image.
        
        Args:
            file_path: Path to the image file
            
        Returns:
            True if image loaded successfully, False otherwise
        """
        try:
            pixmap = QPixmap(file_path)
            if pixmap.isNull():
                return False
            
            self.original_pixmap = pixmap
            self.zoom_level = 1.0
            self.pan_offset = QPoint(0, 0)
            self.fit_image_to_window()
            return True
        except Exception:
            return False
    
    def fit_image_to_window(self):
        """Fit the image to the window while preserving aspect ratio."""
        if self.original_pixmap is None:
            return
        
        label_size = self.image_label.size()
        if label_size.width() <= 1 or label_size.height() <= 1:
            # Window not properly sized yet, schedule update
            self.image_label.resize(self.size())
            label_size = self.image_label.size()
        
        # Calculate scale to fit image in window
        img_width = self.original_pixmap.width()
        img_height = self.original_pixmap.height()
        
        label_width = label_size.width() - 20  # Some margin
        label_height = label_size.height() - 20
        
        scale_w = label_width / img_width if img_width > 0 else 1
        scale_h = label_height / img_height if img_height > 0 else 1
        
        self.zoom_level = min(scale_w, scale_h)
        self.pan_offset = QPoint(0, 0)
        self._update_display()
    
    def resizeEvent(self, event):
        """Handle window resize."""
        super().resizeEvent(event)
        if self.zoom_level == self.min_zoom and self.original_pixmap is not None:
            # Auto-fit on window resize if at minimum zoom
            self.fit_image_to_window()
    
    def _update_display(self):
        """Update the displayed image based on current zoom and pan."""
        if self.original_pixmap is None:
            return
        
        # Scale the image
        new_width = int(self.original_pixmap.width() * self.zoom_level)
        new_height = int(self.original_pixmap.height() * self.zoom_level)
        
        if new_width > 0 and new_height > 0:
            scaled = self.original_pixmap.scaledToWidth(
                new_width,
                mode=Qt.TransformationMode.SmoothTransformation
            )
            self.current_pixmap = scaled
            self.image_label.setPixmap(self.current_pixmap)
    
    def wheelEvent(self, event: QWheelEvent):
        """Handle mouse wheel zoom."""
        if self.original_pixmap is None:
            return
        
        # Zoom in/out based on scroll direction
        zoom_factor = 1.1
        if event.angleDelta().y() > 0:
            self.zoom_level *= zoom_factor
        else:
            self.zoom_level /= zoom_factor
        
        # Clamp zoom level
        self.zoom_level = max(self.min_zoom, min(self.max_zoom, self.zoom_level))
        self._update_display()
        event.accept()
    
    def mousePressEvent(self, event):
        """Handle mouse press for panning."""
        if event.button() == Qt.MouseButton.LeftButton and self.original_pixmap is not None:
            self.pan_start = event.pos()
    
    def mouseMoveEvent(self, event):
        """Handle mouse move for panning."""
        if self.pan_start is not None and self.original_pixmap is not None:
            delta = event.pos() - self.pan_start
            self.pan_offset += delta
            self.pan_start = event.pos()
            self._update_display()
    
    def mouseReleaseEvent(self, event):
        """Handle mouse release."""
        if event.button() == Qt.MouseButton.LeftButton:
            self.pan_start = None

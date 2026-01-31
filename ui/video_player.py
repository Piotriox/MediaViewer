"""Video player widget with playback controls."""

from PySide6.QtWidgets import QWidget, QVBoxLayout, QHBoxLayout, QPushButton, QSlider, QLabel, QStyle
from PySide6.QtMultimediaWidgets import QVideoWidget
from PySide6.QtMultimedia import QMediaPlayer, QAudioOutput
from PySide6.QtCore import Qt, QUrl, QTime
from PySide6.QtGui import QIcon


class VideoPlayer(QWidget):
    """Widget for playing video files with controls."""
    
    def __init__(self):
        super().__init__()
        
        # Media player setup
        self.media_player = QMediaPlayer()
        self.audio_output = QAudioOutput()
        self.media_player.setAudioOutput(self.audio_output)
        
        # Video widget
        self.video_widget = QVideoWidget()
        self.media_player.setVideoOutput(self.video_widget)
        
        # Create UI
        layout = QVBoxLayout()
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)
        
        # Video display
        layout.addWidget(self.video_widget)
        
        # Control bar
        control_layout = QHBoxLayout()
        control_layout.setContentsMargins(10, 8, 10, 8)
        control_layout.setSpacing(10)
        
        # Play/Pause button
        self.play_button = QPushButton("▶")
        self.play_button.setMaximumWidth(40)
        self.play_button.setMaximumHeight(32)
        self.play_button.clicked.connect(self.toggle_play)
        control_layout.addWidget(self.play_button)
        
        # Time label (current / duration)
        self.time_label = QLabel("00:00 / 00:00")
        self.time_label.setMinimumWidth(100)
        self.time_label.setStyleSheet("color: #b0b0b0; font-size: 12px;")
        control_layout.addWidget(self.time_label)
        
        # Timeline slider
        self.slider = QSlider(Qt.Orientation.Horizontal)
        self.slider.setMinimum(0)
        self.slider.setMaximum(100)
        self.slider.sliderMoved.connect(self.seek)
        self.slider.setStyleSheet("""
            QSlider::groove:horizontal {
                border: 1px solid #3d3d3d;
                height: 4px;
                background: #2d2d2d;
                border-radius: 2px;
            }
            QSlider::handle:horizontal {
                background: #0078d4;
                border: none;
                width: 12px;
                margin: -4px 0;
                border-radius: 6px;
            }
            QSlider::handle:horizontal:hover {
                background: #1084d8;
            }
            QSlider::sub-page:horizontal {
                background: #0078d4;
                border-radius: 2px;
            }
        """)
        control_layout.addWidget(self.slider)
        
        # Volume control label
        volume_label = QLabel("🔊")
        volume_label.setMaximumWidth(20)
        control_layout.addWidget(volume_label)
        
        # Volume slider
        self.volume_slider = QSlider(Qt.Orientation.Horizontal)
        self.volume_slider.setMinimum(0)
        self.volume_slider.setMaximum(100)
        self.volume_slider.setValue(100)
        self.volume_slider.setMaximumWidth(100)
        self.volume_slider.valueChanged.connect(self.change_volume)
        self.volume_slider.setStyleSheet("""
            QSlider::groove:horizontal {
                border: 1px solid #3d3d3d;
                height: 4px;
                background: #2d2d2d;
                border-radius: 2px;
            }
            QSlider::handle:horizontal {
                background: #0078d4;
                border: none;
                width: 10px;
                margin: -3px 0;
                border-radius: 5px;
            }
            QSlider::sub-page:horizontal {
                background: #0078d4;
                border-radius: 2px;
            }
        """)
        control_layout.addWidget(self.volume_slider)
        
        # Control bar background
        control_bar = QWidget()
        control_bar.setStyleSheet("background-color: #2d2d2d; border-top: 1px solid #3d3d3d;")
        control_bar.setLayout(control_layout)
        control_bar.setMaximumHeight(50)
        
        layout.addWidget(control_bar)
        self.setLayout(layout)
        
        # Connect signals
        self.media_player.positionChanged.connect(self.update_position)
        self.media_player.durationChanged.connect(self.update_duration)
        self.media_player.playbackStateChanged.connect(self.on_state_changed)
        
        self.current_duration = 0
    
    def load_video(self, file_path: str) -> bool:
        """
        Load a video file.
        
        Args:
            file_path: Path to the video file
            
        Returns:
            True if video loaded successfully, False otherwise
        """
        try:
            self.media_player.setSource(QUrl.fromLocalFile(file_path))
            return True
        except Exception:
            return False
    
    def toggle_play(self):
        """Toggle play/pause state."""
        if self.media_player.playbackState() == QMediaPlayer.PlaybackState.PlayingState:
            self.media_player.pause()
        else:
            self.media_player.play()
    
    def seek(self, position: int):
        """
        Seek to a specific position in the video.
        
        Args:
            position: Position as slider value (0-100)
        """
        if self.current_duration > 0:
            ms = int(position / 100 * self.current_duration)
            self.media_player.setPosition(ms)
    
    def change_volume(self, value: int):
        """
        Change volume level.
        
        Args:
            value: Volume level (0-100)
        """
        self.audio_output.setVolume(value / 100)
    
    def update_position(self, position: int):
        """Update timeline slider position."""
        if self.current_duration > 0:
            slider_value = int(position / self.current_duration * 100)
            # Only update slider if user is not dragging it
            if not self.slider.isSliderDown():
                self.slider.blockSignals(True)
                self.slider.setValue(slider_value)
                self.slider.blockSignals(False)
        
        self.update_time_label(position)
    
    def update_duration(self, duration: int):
        """Update total duration."""
        self.current_duration = duration
        self.slider.setMaximum(100)
        self.update_time_label(0)
    
    def update_time_label(self, position_ms: int):
        """Update the time label."""
        current_time = self._ms_to_timestring(position_ms)
        total_time = self._ms_to_timestring(self.current_duration)
        self.time_label.setText(f"{current_time} / {total_time}")
    
    @staticmethod
    def _ms_to_timestring(ms: int) -> str:
        """Convert milliseconds to time string (MM:SS)."""
        total_seconds = ms // 1000
        minutes = total_seconds // 60
        seconds = total_seconds % 60
        return f"{minutes:02d}:{seconds:02d}"
    
    def on_state_changed(self, state):
        """Update play button text based on playback state."""
        if state == QMediaPlayer.PlaybackState.PlayingState:
            self.play_button.setText("⏸")
        else:
            self.play_button.setText("▶")
    
    def stop(self):
        """Stop playback."""
        self.media_player.stop()

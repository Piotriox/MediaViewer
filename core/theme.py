"""Application theme and styling."""


# Color palette
DARK_BG = "#1e1e1e"
DARK_PANEL = "#2d2d2d"
DARK_HOVER = "#3d3d3d"
ACCENT_COLOR = "#0078d4"
TEXT_PRIMARY = "#ffffff"
TEXT_SECONDARY = "#b0b0b0"
BORDER_COLOR = "#3d3d3d"


def get_stylesheet() -> str:
    """
    Get the application stylesheet.
    
    Returns:
        QSS stylesheet string
    """
    return f"""
        QMainWindow {{
            background-color: {DARK_BG};
            color: {TEXT_PRIMARY};
        }}
        
        QWidget {{
            background-color: {DARK_BG};
            color: {TEXT_PRIMARY};
        }}
        
        QSlider::groove:horizontal {{
            border: 1px solid {BORDER_COLOR};
            height: 4px;
            background: {DARK_PANEL};
            border-radius: 2px;
        }}
        
        QSlider::handle:horizontal {{
            background: {ACCENT_COLOR};
            border: none;
            width: 12px;
            margin: -4px 0;
            border-radius: 6px;
        }}
        
        QSlider::handle:horizontal:hover {{
            background: #1084d8;
        }}
        
        QSlider::sub-page:horizontal {{
            background: {ACCENT_COLOR};
            border-radius: 2px;
        }}
        
        QPushButton {{
            background-color: {DARK_PANEL};
            color: {TEXT_PRIMARY};
            border: 1px solid {BORDER_COLOR};
            padding: 6px 12px;
            border-radius: 4px;
            font-weight: 500;
        }}
        
        QPushButton:hover {{
            background-color: {DARK_HOVER};
            border: 1px solid {ACCENT_COLOR};
        }}
        
        QPushButton:pressed {{
            background-color: {ACCENT_COLOR};
        }}
        
        QLabel {{
            color: {TEXT_PRIMARY};
        }}
        
        QSpinBox, QDoubleSpinBox {{
            background-color: {DARK_PANEL};
            color: {TEXT_PRIMARY};
            border: 1px solid {BORDER_COLOR};
            border-radius: 4px;
            padding: 4px;
        }}
    """

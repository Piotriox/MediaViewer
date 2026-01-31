"""File type detection and validation."""

from pathlib import Path
from enum import Enum


class FileType(Enum):
    """Supported file types."""
    IMAGE = "image"
    VIDEO = "video"
    UNKNOWN = "unknown"


# Supported file extensions
SUPPORTED_IMAGES = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff', '.ico'}
SUPPORTED_VIDEOS = {'.mp4', '.mkv', '.avi', '.mov', '.flv', '.wmv', '.webm', '.m4v', '.3gp'}


def detect_file_type(file_path: str) -> FileType:
    """
    Detect file type by extension.
    
    Args:
        file_path: Path to the file
        
    Returns:
        FileType enum indicating the file type
    """
    try:
        path = Path(file_path)
        suffix = path.suffix.lower()
        
        if suffix in SUPPORTED_IMAGES:
            return FileType.IMAGE
        elif suffix in SUPPORTED_VIDEOS:
            return FileType.VIDEO
        else:
            return FileType.UNKNOWN
    except Exception:
        return FileType.UNKNOWN


def is_valid_file(file_path: str) -> bool:
    """
    Check if file exists and is a supported type.
    
    Args:
        file_path: Path to the file
        
    Returns:
        True if file exists and is supported, False otherwise
    """
    try:
        path = Path(file_path)
        return path.exists() and path.is_file() and detect_file_type(file_path) != FileType.UNKNOWN
    except Exception:
        return False

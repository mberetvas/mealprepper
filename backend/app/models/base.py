"""Base utilities and imports for SQLModel models."""

from datetime import datetime, timezone


def get_datetime_utc() -> datetime:
    """
    Get the current UTC datetime.
    
    Returns:
        Current datetime in UTC timezone.
    """
    return datetime.now(timezone.utc)

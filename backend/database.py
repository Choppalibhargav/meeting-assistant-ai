"""
SQLite Database setup for AI Meeting Intelligence Backend.
Zero external database dependencies - 100% free and local.
"""

import sqlite3
import os
from typing import List, Optional, Dict, Any

DB_PATH = os.path.join(os.path.dirname(__file__), "meetings.db")

def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db() -> None:
    """Initialize database schema."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS meetings (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            url TEXT,
            platform TEXT NOT NULL,
            start_time TEXT,
            end_time TEXT,
            duration INTEGER NOT NULL DEFAULT 0,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

def save_meeting(data: Dict[str, Any]) -> Dict[str, Any]:
    """Insert or update a meeting record."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO meetings (id, title, url, platform, start_time, end_time, duration, status, created_at)
        VALUES (:id, :title, :url, :platform, :start_time, :end_time, :duration, :status, :created_at)
        ON CONFLICT(id) DO UPDATE SET
            title = excluded.title,
            url = excluded.url,
            platform = excluded.platform,
            start_time = excluded.start_time,
            end_time = excluded.end_time,
            duration = excluded.duration,
            status = excluded.status
    """, data)
    conn.commit()
    conn.close()
    return data

def get_all_meetings() -> List[Dict[str, Any]]:
    """Retrieve all meetings sorted by creation date descending."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, title, url, platform, start_time, end_time, duration, status, created_at
        FROM meetings
        ORDER BY created_at DESC
    """)
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_meeting_by_id(meeting_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve a single meeting by its ID."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, title, url, platform, start_time, end_time, duration, status, created_at
        FROM meetings
        WHERE id = ?
    """, (meeting_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None


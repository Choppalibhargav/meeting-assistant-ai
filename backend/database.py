"""
SQLite Database setup for AI Meeting Intelligence Backend.
Zero external database dependencies - 100% free and local.
"""

import sqlite3
import os
import json
from typing import List, Optional, Dict, Any

DB_PATH = os.path.join(os.path.dirname(__file__), "meetings.db")

def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db() -> None:
    """Initialize database schema with migration support."""
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
            created_at TEXT NOT NULL,
            transcript TEXT,
            outcome_json TEXT
        )
    """)
    conn.commit()

    # Verify column existence in case table already existed from previous run
    cursor.execute("PRAGMA table_info(meetings)")
    columns = [row["name"] for row in cursor.fetchall()]
    if "transcript" not in columns:
        cursor.execute("ALTER TABLE meetings ADD COLUMN transcript TEXT")
    if "outcome_json" not in columns:
        cursor.execute("ALTER TABLE meetings ADD COLUMN outcome_json TEXT")
    conn.commit()
    conn.close()

def save_meeting(data: Dict[str, Any]) -> Dict[str, Any]:
    """Insert or update a meeting record."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO meetings (id, title, url, platform, start_time, end_time, duration, status, created_at, transcript, outcome_json)
        VALUES (:id, :title, :url, :platform, :start_time, :end_time, :duration, :status, :created_at, :transcript, :outcome_json)
        ON CONFLICT(id) DO UPDATE SET
            title = excluded.title,
            url = excluded.url,
            platform = excluded.platform,
            start_time = excluded.start_time,
            end_time = excluded.end_time,
            duration = excluded.duration,
            status = excluded.status
    """, {
        "id": data["id"],
        "title": data["title"],
        "url": data.get("url"),
        "platform": data.get("platform", "Custom"),
        "start_time": data.get("start_time"),
        "end_time": data.get("end_time"),
        "duration": data.get("duration", 0),
        "status": data.get("status", "ended"),
        "created_at": data.get("created_at"),
        "transcript": data.get("transcript"),
        "outcome_json": json.dumps(data["outcome"]) if data.get("outcome") else data.get("outcome_json"),
    })
    conn.commit()
    conn.close()
    return data

def update_transcript(meeting_id: str, transcript: str) -> bool:
    """Save transcript text for a meeting."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE meetings SET transcript = ? WHERE id = ?", (transcript, meeting_id))
    conn.commit()
    rows_affected = cursor.rowcount
    conn.close()
    return rows_affected > 0

def update_outcome(meeting_id: str, outcome: Dict[str, Any]) -> bool:
    """Save structured AI outcome JSON for a meeting."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE meetings SET outcome_json = ? WHERE id = ?", (json.dumps(outcome), meeting_id))
    conn.commit()
    rows_affected = cursor.rowcount
    conn.close()
    return rows_affected > 0

def get_all_meetings() -> List[Dict[str, Any]]:
    """Retrieve all meetings sorted by creation date descending."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, title, url, platform, start_time, end_time, duration, status, created_at, transcript, outcome_json
        FROM meetings
        ORDER BY created_at DESC
    """)
    rows = cursor.fetchall()
    conn.close()
    result = []
    for r in rows:
        d = dict(r)
        if d.get("outcome_json"):
            try:
                d["outcome"] = json.loads(d["outcome_json"])
            except Exception:
                d["outcome"] = None
        result.append(d)
    return result

def get_meeting_by_id(meeting_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve a single meeting by its ID."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, title, url, platform, start_time, end_time, duration, status, created_at, transcript, outcome_json
        FROM meetings
        WHERE id = ?
    """, (meeting_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    d = dict(row)
    if d.get("outcome_json"):
        try:
            d["outcome"] = json.loads(d["outcome_json"])
        except Exception:
            d["outcome"] = None
    return d

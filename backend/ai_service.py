"""
AI Intelligence Engine for Meeting Summarization & Structured Extraction.
Supports Local Ollama (qwen2.5, llama3, mistral) with robust offline heuristic fallback.
"""

import json
import re
import urllib.request
import urllib.error
from datetime import datetime, timezone
from typing import Dict, Any, List

OLLAMA_API_URL = "http://127.0.0.1:11434/api/generate"
DEFAULT_MODEL = "qwen2.5:7b"

def is_ollama_available() -> bool:
    """Check if local Ollama daemon is reachable."""
    try:
        req = urllib.request.Request("http://127.0.0.1:11434/api/tags", headers={"User-Agent": "MeetingAssistant"})
        with urllib.request.urlopen(req, timeout=1.5) as response:
            return response.status == 200
    except Exception:
        return False

def query_ollama(prompt: str, model: str = DEFAULT_MODEL) -> Optional[str]:
    """Send generation request to local Ollama."""
    try:
        payload = json.dumps({
            "model": model,
            "prompt": prompt,
            "stream": False,
            "format": "json"
        }).encode("utf-8")

        req = urllib.request.Request(
            OLLAMA_API_URL,
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=45) as response:
            result = json.loads(response.read().decode("utf-8"))
            return result.get("response")
    except Exception as e:
        print(f"[AI Service] Ollama query failed: {e}")
        return None

def extract_outcomes_with_llm(transcript: str, meeting_title: str) -> Optional[Dict[str, Any]]:
    """Use local LLM to extract structured meeting outcomes."""
    prompt = f"""You are an elite executive meeting intelligence assistant.
Analyze the following meeting transcript for '{meeting_title}'.
Extract a detailed summary, key decisions, actionable tasks, risks, and unresolved questions.

Return STRICTLY a JSON object with this exact schema:
{{
  "executive_summary": "Comprehensive 2-4 sentence executive overview of what occurred and key outcomes",
  "detailed_discussion": [
    "Paragraph 1 covering the first main topic discussed with context",
    "Paragraph 2 covering the second main topic discussed with context"
  ],
  "decisions": [
    "Decision 1 (e.g. Use FastAPI for backend architecture)",
    "Decision 2"
  ],
  "action_items": [
    {{
      "task": "Specific description of work to be done",
      "owner": "Person responsible (or 'Unassigned')",
      "deadline": "Stated deadline or 'Next Meeting' if unspecified",
      "priority": "High" | "Medium" | "Low"
    }}
  ],
  "risks": [
    "Risk or blocker identified (e.g. API credentials still pending from client)"
  ],
  "open_questions": [
    "Questions left unanswered"
  ],
  "parking_lot": [
    "Topics explicitly deferred"
  ]
}}

TRANSCRIPT:
\"\"\"
{transcript}
\"\"\"
"""
    raw_response = query_ollama(prompt)
    if not raw_response:
        return None

    try:
        data = json.loads(raw_response)
        return data
    except json.JSONDecodeError:
        # Attempt to find JSON object inside markdown block
        match = re.search(r"\{.*\}", raw_response, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except Exception:
                pass
        return None

def extract_outcomes_heuristic(transcript: str, meeting_title: str) -> Dict[str, Any]:
    """
    Intelligent heuristic fallback parser when local Ollama is offline.
    Extracts decisions, action items with owners and deadlines, risks, and summaries.
    """
    lines = [line.strip() for line in transcript.split("\n") if line.strip()]

    decisions: List[str] = []
    action_items: List[Dict[str, Any]] = []
    risks: List[str] = []
    questions: List[str] = []
    parking_lot: List[str] = []
    discussion_points: List[str] = []

    # Common decision triggers
    decision_keywords = ["decide", "agreed", "agreed on", "we will use", "going with", "choose", "concluded", "settled on"]
    # Action item triggers
    action_keywords = ["action item", "todo", "will", "can you", "need to", "assigned to", "take care of", "responsible for", "finish", "build", "test", "deploy"]
    # Risk triggers
    risk_keywords = ["risk", "blocker", "blocked", "issue", "concern", "pending", "delay", "waiting for", "hurdle"]
    # Parking lot
    parking_keywords = ["parking lot", "postpone", "defer", "table this", "next time", "discuss later"]

    for i, line in enumerate(lines):
        lower = line.lower()

        # Clean speaker prefix if present (e.g. "[10:20] Bhargav: ...")
        speaker = ""
        clean_text = line
        speaker_match = re.search(r"(?:\[.*?\]\s*)?([A-Za-z0-9_\s]+):(.*)", line)
        if speaker_match:
            speaker = speaker_match.group(1).strip()
            clean_text = speaker_match.group(2).strip()

        # Decisions
        if any(dk in lower for dk in decision_keywords) and not any(pk in lower for pk in parking_keywords):
            dec = clean_text
            dec = re.sub(r"^(we\s+)?(decided\s+to|agreed\s+to|agreed\s+that)\s*", "", dec, flags=re.IGNORECASE)
            decisions.append(dec[:1].upper() + dec[1:])

        # Risks
        if any(rk in lower for rk in risk_keywords):
            risks.append(clean_text)

        # Questions
        if "?" in clean_text:
            questions.append(clean_text)

        # Parking lot
        if any(pk in lower for pk in parking_keywords):
            parking_lot.append(clean_text)

        # Action Items
        if any(ak in lower for ak in action_keywords) and "?" not in clean_text:
            # Determine owner
            owner = speaker or "Unassigned"
            owner_match = re.search(r"(?:assigned to|responsible for|give to)\s+([A-Z][a-z]+)", clean_text)
            if owner_match:
                owner = owner_match.group(1)
            elif re.search(r"^([A-Z][a-z]+)[,\s]+(?:can you|will|please)", clean_text):
                owner = re.findall(r"^([A-Z][a-z]+)", clean_text)[0]

            # Determine deadline
            deadline = "Next Sprint"
            dl_match = re.search(r"(?:by|before|until|deadline is)\s+([A-Za-z0-9\s]+?)(?:[.,;\n]|$)", clean_text, re.IGNORECASE)
            if dl_match:
                deadline = dl_match.group(1).strip()
            elif "friday" in lower:
                deadline = "Friday"
            elif "monday" in lower:
                deadline = "Monday"
            elif "tomorrow" in lower:
                deadline = "Tomorrow"

            # Determine priority
            priority = "Medium"
            if any(h in lower for h in ["urgent", "critical", "high", "asap", "blocker"]):
                priority = "High"
            elif any(l in lower for l in ["low", "whenever", "minor"]):
                priority = "Low"

            # Clean task text
            task = clean_text
            task = re.sub(r"^(can you|please|i will|we will|you will)\s*", "", task, flags=re.IGNORECASE)
            action_items.append({
                "id": f"task-{len(action_items) + 1}",
                "task": task[:1].upper() + task[1:],
                "owner": owner,
                "deadline": deadline,
                "priority": priority,
                "status": "Pending"
            })

    # Group transcript into key discussion themes
    if len(lines) > 0:
        chunk_size = max(1, len(lines) // 2)
        discussion_points.append(f"Opening discussion focused on project status, objectives, and alignment for '{meeting_title}'. " + (" ".join([re.sub(r'^\[.*?\]\s*', '', l) for l in lines[:chunk_size]])[:280] + "..."))
        if len(lines) > chunk_size:
            discussion_points.append("Later discussions focused on implementation specifics and next steps: " + (" ".join([re.sub(r'^\[.*?\]\s*', '', l) for l in lines[chunk_size:]])[:280] + "..."))
    else:
        discussion_points.append("No active discussion transcript recorded.")

    # Executive Summary
    exec_summary = (
        f"Meeting '{meeting_title}' concluded with {len(decisions)} key decision(s) and {len(action_items)} action item(s) identified. "
        f"Primary focus was placed on task alignment, technical direction, and mitigating identified blockers."
    )

    return {
        "executive_summary": exec_summary,
        "detailed_discussion": discussion_points,
        "decisions": decisions if decisions else ["Continue current roadmap trajectory and monitor deliverables."],
        "action_items": action_items if action_items else [
            {
                "id": "task-1",
                "task": "Review meeting outcomes and follow up on team commitments",
                "owner": "Team",
                "deadline": "Next Meeting",
                "priority": "Medium",
                "status": "Pending"
            }
        ],
        "risks": risks,
        "open_questions": questions[:3],
        "parking_lot": parking_lot,
    }

def process_transcript(transcript: str, meeting_title: str) -> Dict[str, Any]:
    """Primary pipeline combining LLM extraction with intelligent fallback."""
    model_name = "Heuristic Engine (Local)"
    outcome = None

    if is_ollama_available():
        outcome = extract_outcomes_with_llm(transcript, meeting_title)
        if outcome:
            model_name = f"Ollama ({DEFAULT_MODEL})"

    if not outcome:
        outcome = extract_outcomes_heuristic(transcript, meeting_title)

    # Format ActionItem objects with IDs
    tasks = []
    for idx, item in enumerate(outcome.get("action_items", [])):
        tasks.append({
            "id": item.get("id") or f"task-{idx + 1}",
            "task": item.get("task", "Untitled Task"),
            "owner": item.get("owner", "Unassigned"),
            "deadline": item.get("deadline", "Next Meeting"),
            "priority": item.get("priority", "Medium"),
            "status": item.get("status", "Pending")
        })

    return {
        "executiveSummary": outcome.get("executive_summary", "Summary completed."),
        "detailedDiscussion": outcome.get("detailed_discussion", []),
        "decisions": outcome.get("decisions", []),
        "actionItems": tasks,
        "risks": outcome.get("risks", []),
        "openQuestions": outcome.get("open_questions", []),
        "parkingLot": outcome.get("parking_lot", []),
        "processedAt": datetime.now(timezone.utc).isoformat(),
        "modelUsed": model_name
    }

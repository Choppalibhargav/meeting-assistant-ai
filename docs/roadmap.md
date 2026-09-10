# AI Meeting Assistant Roadmap
# 🚀 Project: AI Meeting Intelligence & Automation Platform

## Phase 1
- [ ] Chrome Extension
- [ ] Meeting Detection
- [ ] Timer
- [ ] Metadata Storage
### Core Idea

## Phase 2
- [ ] Audio Capture
- [ ] Microphone Selection
- [ ] Recording Controls
A **browser extension first**, eventually becoming a **meeting bot + desktop application**, that turns meetings into structured, actionable project information.

## Phase 3
- [ ] Speech-to-Text
- [ ] Live Transcript
The core promise:

## Phase 4
- [ ] AI Summaries
- [ ] Action Items
- [ ] Meeting Minutes
> **Meeting → Understand → Remember → Create Tasks → Track → Carry Forward**

## Phase 5
- [ ] Jira Integration
- [ ] Ticket Generation
- [ ] Ticket Suggestions
---

## Phase 6
- [ ] Teams Bot
- [ ] Zoom Bot
## 🎯 What the Final Product Should Do

## Phase 7
- [ ] Electron Desktop App
- [ ] Auto Updates
After a meeting, the system should understand:

### 📝 Meeting Summary
* Executive summary
* Detailed discussion
* Important topics

### 👥 Participants & Speaking Analytics
* Who spoke
* How long each person spoke
* When they spoke
* Speaking percentage
* Potentially interruptions / participation patterns

### ✅ Action Items
For every task:

| Task | Owner | Deadline | Priority | Status |
| ---- | ----- | -------- | -------- | ------ |
| Build authentication API | Bhargav | Friday | High | Pending |
| Test API | Rahul | Monday | Medium | Pending |

### 🎯 Decisions
Identify important decisions made during the meeting.
> Example: Decision: Use FastAPI for the backend.

### ⚠️ Risks & Blockers
> Example: API credentials are still pending from the client.

### ❓ Open Questions
Questions that weren't resolved during the meeting.

### 🅿️ Parking Lot
Topics intentionally postponed.

### 🔄 Carry-Forward
Unfinished tasks from previous meetings automatically appear in the next meeting.

---

# 🧠 The RAG Component

Every meeting becomes part of a **persistent meeting knowledge base**.

```text
Meeting 1
    ↓
Transcript
    ↓
Chunks
    ↓
Embeddings
    ↓
Vector Database
```

Then Meeting 2, 3, 4... are added to the same knowledge base.

The user can ask:
> "When did we decide to use FastAPI?"
> "Who was assigned the authentication task?"
> "What tasks are still pending?"
> "What did we discuss about deployment last month?"
> "Why did we change the database?"

The system retrieves relevant information from **previous meetings** and answers using RAG.

---

# 🔗 Jira Integration

One of the major features in the platform.

Meeting:
> "Bhargav, can you finish the authentication API by Friday?"

AI extracts:
```text
Task: Authentication API
Owner: Bhargav
Deadline: Friday
```

Then the extension shows:
```text
AI detected 1 action item
[✓] Create Jira ticket
[Edit]
[Ignore]
```

After confirmation:
```text
AI → Jira API → JIRA-231
```

The Jira ticket can contain:
* Title
* Description
* Assignee
* Deadline
* Priority
* Labels
* Meeting reference

### Important Design Decision
**Don't automatically create Jira tickets without confirmation initially.**
The AI should propose them and let the user approve/edit them to protect against incorrect LLM interpretation.

---

# 🔗 Meeting → Jira Traceability

A Jira ticket should remember **where it came from**:

```text
JIRA-231: Authentication API

Created from: Sprint Planning – 6 Sep 2026
Meeting timestamp: 00:18:42
Decision/context: Authentication API must be completed by Friday.
```

Eventually you can click the reference and jump back to the relevant transcript timestamp.

---

# 🏗️ Architecture

The most important architectural decision: **Don't put the AI logic inside the browser extension.**

```text
                  ┌─────────────────┐
                  │ Browser         │
                  │ Extension       │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ FastAPI Backend │
                  └────────┬────────┘
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
          LLM/RAG       SQLite         Jira
```

Later:
```text
Browser Extension ──┐
                    │
Meeting Bot ────────┼──► Meeting Intelligence Core
                    │
Desktop App ────────┘
```

The **AI core stays the same** regardless of how the meeting data enters the system.

---

# 🧩 Final Modular Architecture

```text
                 MEETING INPUT
                      │
        ┌─────────────┼──────────────┐
        ▼             ▼              ▼
    Browser         Bot          Desktop
    Extension                     App
        │             │              │
        └─────────────┼──────────────┘
                      ▼
             Meeting Intelligence
                      │
        ┌─────────────┼─────────────┐
        ▼             ▼             ▼
   Transcript      Speakers       Metadata
        │
        ▼
       RAG
        │
        ▼
 ┌──────┼────────┬────────┬────────┐
 ▼      ▼        ▼        ▼        ▼
Summary Tasks Decisions Risks Deadlines
        │
        ▼
   Automation Layer
        │
 ┌──────┼────────┐
 ▼      ▼        ▼
Jira   Slack   Calendar
```

---

# 🆓 Entirely Free Stack

The goal is **zero paid AI APIs**.

| Layer | Technology |
| ----- | ---------- |
| **Browser Extension** | Manifest V3, TypeScript, React, Vite, Tailwind CSS |
| **Backend** | Python, FastAPI |
| **LLM** | Ollama (Local Qwen, Gemma, Llama) |
| **Speech-to-Text** | Whisper (Local) |
| **Embeddings** | `BAAI/bge-small-en-v1.5` or `all-MiniLM-L6-v2` |
| **Vector Database** | FAISS |
| **Database** | SQLite |
| **RAG** | Custom pipeline, later LangChain/LlamaIndex |
| **Analytics** | Plotly |
| **Development** | Git, GitHub, Docker |

---

# 🛣️ Development Roadmap

## Phase 0 — Foundations (Current Focus)
* Python, TypeScript, REST APIs, FastAPI, SQLite, Git, Manifest V3
* **Deliverable**: Browser extension communicating with a FastAPI backend.

## Phase 1 — Browser Extension (Current Focus)
* Extension UI → Start Meeting → Meeting Timer → End Meeting
* Store: Meeting title, URL, Start time, End time, Meeting ID.
* No AI yet.

## Phase 2 — Transcript
* Upload transcript OR Paste transcript.
* Avoid the difficult live-audio problem initially.

## Phase 3 — AI Summary
* Local LLM summarizes transcript: Executive summary, Important points, Discussion summary.

## Phase 4 — Structured Extraction
* Return structured JSON: summary, decisions, tasks, deadlines, risks, questions, parking_lot.
* Store structured data in SQLite.

## Phase 5 — RAG
* Chunking → Embeddings → FAISS.
* Ask questions across past meetings using local embeddings + LLM.

## Phase 6 — Meeting Memory
* Persistent memory layer: carry-forward unresolved tasks and context across meetings.

## Phase 7 — Dashboard
* Meetings, Tasks, Decisions, Deadlines, Risks, and analytics (pending, completed, overdue, participation).

## Phase 8 — Jira
* Meeting → AI Tasks → User Approval → Jira API → Ticket.

## Phase 9 — Follow-up Intelligence
* Pre-meeting intelligence: carry-forward items, previous decisions, agenda suggestions.

## Phase 10 — Reports
* Automated weekly project and sprint reports.

## Phase 11 — Audio + Speaker Analytics
* Whisper STT + speaker diarization (speaking time, timeline, participation).

## Phase 12 — Desktop Application
* Standalone desktop input connector (capturing Meet, Teams, Zoom, Discord, Slack).

## Phase 13 — Meeting Bot
* Bot joins meeting directly via invite link for autonomous capture and processing.
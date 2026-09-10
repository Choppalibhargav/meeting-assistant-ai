import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiUploadCloud, FiZap, FiFileText, FiCheck, FiTrash2, FiEdit3 } from "react-icons/fi";
import { useMeetingStore } from "../store/meetingStore";

export const TranscriptModal: React.FC = () => {
  const selectedMeeting = useMeetingStore((state) => state.selectedMeetingForDetails);
  const setActiveView = useMeetingStore((state) => state.setActiveView);
  const setMeetingTranscript = useMeetingStore((state) => state.setMeetingTranscript);
  const generateOutcomes = useMeetingStore((state) => state.generateOutcomes);
  const isProcessingAI = useMeetingStore((state) => state.isProcessingAI);

  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  const sampleTranscript = `[10:00] Bhargav: Welcome team. Let's decide on the technical stack and architecture for our AI meeting intelligence platform.
[10:02] Rahul: I propose using FastAPI for the backend because it provides asynchronous endpoints, automatic Swagger docs, and zero-cost local execution.
[10:05] Bhargav: Agreed. Decision: We will use FastAPI and local SQLite for the core storage architecture.
[10:07] Bhargav: Rahul, can you build and test the authentication and transcript APIs by Friday?
[10:08] Rahul: Yes, I will finish the authentication endpoints and test suite by Friday.
[10:10] Bhargav: I will complete the Chrome extension UI with highlighted decisions and action items by Monday.
[10:12] Rahul: Blocker: client API credentials are still pending from the external infrastructure team.
[10:14] Bhargav: Let's table desktop app audio capture for the next sprint planning.
[10:15] Rahul: What about speech-to-text accuracy in noisy environments?
[10:16] Bhargav: We'll evaluate Whisper local base vs small in Phase 11.`;

  useEffect(() => {
    if (selectedMeeting?.transcript) {
      setText(selectedMeeting.transcript);
    } else {
      if (typeof chrome !== "undefined" && chrome.storage?.local) {
        chrome.storage.local.get("live_meeting_transcript").then((data) => {
          if (data.live_meeting_transcript) {
            setText(String(data.live_meeting_transcript || ""));
          }
        });
      }
    }
  }, [selectedMeeting]);

  if (!selectedMeeting) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleSave = async () => {
    await setMeetingTranscript(selectedMeeting.id, text);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveAndProcess = async () => {
    await setMeetingTranscript(selectedMeeting.id, text);
    await generateOutcomes(selectedMeeting.id, text);
    setActiveView("outcomes");
  };

  return (
    <div className="flex-1 flex flex-col p-3.5 space-y-3 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <button
          onClick={() => setActiveView("outcomes")}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          Back to Outcomes
        </button>
        <span className="text-[11px] text-indigo-400 font-medium flex items-center gap-1">
          <FiFileText className="w-3 h-3" />
          Transcript Manager
        </span>
      </div>

      <div>
        <h3 className="text-xs font-semibold text-white">Meeting Transcript</h3>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Paste conversation notes, upload a transcript, or load a sample conversation.
        </p>
      </div>

      {/* Action shortcuts */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setText(sampleTranscript)}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-[11px] font-medium cursor-pointer transition-colors"
        >
          <FiEdit3 className="w-3 h-3" />
          Insert Sample Transcript
        </button>

        <label className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-[11px] cursor-pointer transition-colors">
          <FiUploadCloud className="w-3 h-3 text-slate-400" />
          Upload .txt
          <input
            type="file"
            accept=".txt,.vtt,.srt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {text && (
          <button
            onClick={() => setText("")}
            className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-900 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Clear text"
          >
            <FiTrash2 className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Textarea */}
      <div className="flex-1 min-h-[160px] flex flex-col">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`[10:15] Bhargav: We agreed to use FastAPI for the backend architecture.\n[10:18] Rahul: I will build and test the authentication API by Friday.\n[10:20] Bhargav: Note that client API credentials are still pending.`}
          className="w-full flex-1 min-h-[160px] p-2.5 bg-slate-900/90 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleSave}
          disabled={!text.trim()}
          className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          {saved ? <FiCheck className="w-3.5 h-3.5 text-emerald-400" /> : null}
          {saved ? "Saved" : "Save Transcript"}
        </button>

        <button
          onClick={handleSaveAndProcess}
          disabled={!text.trim() || isProcessingAI}
          className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-indigo-900/30 transition-all cursor-pointer"
        >
          <FiZap className="w-3.5 h-3.5 fill-current" />
          {isProcessingAI ? "Processing..." : "Generate AI Outcomes"}
        </button>
      </div>
    </div>
  );
};

export default TranscriptModal;

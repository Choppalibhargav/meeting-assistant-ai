import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiUploadCloud, FiZap, FiFileText, FiTrash2, FiEdit3 } from "react-icons/fi";
import { useMeetingStore } from "../store/meetingStore";
import Card from "../../../shared/components/ui/Card";
import AppleButton from "../../../shared/components/ui/AppleButton";
import { useToast } from "../../../shared/components/ui/Toast";

export const TranscriptModal: React.FC = () => {
  const selectedMeeting = useMeetingStore((state) => state.selectedMeetingForDetails);
  const setActiveView = useMeetingStore((state) => state.setActiveView);
  const setMeetingTranscript = useMeetingStore((state) => state.setMeetingTranscript);
  const generateOutcomes = useMeetingStore((state) => state.generateOutcomes);
  const isProcessingAI = useMeetingStore((state) => state.isProcessingAI);

  const { showToast } = useToast();
  const [text, setText] = useState("");

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
        showToast("Transcript file loaded", "info");
      }
    };
    reader.readAsText(file);
  };

  const handleSave = async () => {
    await setMeetingTranscript(selectedMeeting.id, text);
    showToast("Transcript saved successfully", "success");
  };

  const handleSaveAndProcess = async () => {
    await setMeetingTranscript(selectedMeeting.id, text);
    showToast("Analyzing transcript with AI...", "info");
    await generateOutcomes(selectedMeeting.id, text);
    setActiveView("outcomes");
  };

  return (
    <div className="flex-1 flex flex-col p-3.5 space-y-3 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] dark:border-white/[0.08]">
        <button
          onClick={() => setActiveView("outcomes")}
          className="flex items-center gap-1 text-xs font-medium text-[#0071E3] dark:text-[#0A84FF] hover:opacity-80 transition-opacity cursor-pointer select-none"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span>Outcomes</span>
        </button>
        <span className="text-[11px] text-[#86868B] dark:text-[#A1A1A6] font-medium flex items-center gap-1">
          <FiFileText className="w-3 h-3 text-[#0071E3]" />
          Transcript Manager
        </span>
      </div>

      <div>
        <h2 className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
          Meeting Transcript
        </h2>
        <p className="text-[11px] text-[#86868B] dark:text-[#A1A1A6] mt-0.5">
          Paste conversation notes, upload a transcript file, or load sample dialogue.
        </p>
      </div>

      {/* Action shortcuts */}
      <div className="flex items-center gap-2">
        <AppleButton
          variant="secondary"
          size="sm"
          className="flex-1"
          icon={<FiEdit3 className="w-3 h-3 text-[#0071E3]" />}
          onClick={() => {
            setText(sampleTranscript);
            showToast("Sample transcript inserted", "info");
          }}
        >
          Sample Transcript
        </AppleButton>

        <label className="flex-1 h-7 px-3 text-xs rounded-full inline-flex items-center justify-center gap-1.5 font-medium select-none bg-black/[0.05] hover:bg-black/[0.08] dark:bg-white/[0.08] dark:hover:bg-white/[0.12] text-[#1D1D1F] dark:text-[#F5F5F7] border border-black/[0.04] dark:border-white/[0.06] transition-all cursor-pointer">
          <FiUploadCloud className="w-3 h-3 text-[#86868B]" />
          <span>Upload File</span>
          <input
            type="file"
            accept=".txt,.vtt,.srt"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        {text && (
          <button
            onClick={() => {
              setText("");
              showToast("Transcript cleared", "info");
            }}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-black/[0.04] hover:bg-[#FF3B30]/10 hover:text-[#FF3B30] text-[#86868B] dark:text-[#A1A1A6] transition-colors cursor-pointer"
            title="Clear text"
          >
            <FiTrash2 className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Textarea */}
      <Card padding="none" className="flex-1 min-h-[170px] overflow-hidden flex flex-col">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`[10:00] Bhargav: Let's align on next steps.\n[10:02] Rahul: I will finalize the backend API by Friday.\n[10:05] Bhargav: Decision: We will use SQLite for fast local sync.`}
          className="w-full flex-1 p-3 bg-transparent text-xs font-mono text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#86868B] focus:outline-none leading-relaxed resize-none"
        />
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <AppleButton
          variant="secondary"
          size="md"
          className="flex-1"
          disabled={!text.trim()}
          onClick={handleSave}
        >
          Save Transcript
        </AppleButton>

        <AppleButton
          variant="primary"
          size="md"
          className="flex-1 shadow-md shadow-[#0071E3]/25"
          disabled={!text.trim() || isProcessingAI}
          isLoading={isProcessingAI}
          icon={<FiZap className="w-3.5 h-3.5 fill-current" />}
          onClick={handleSaveAndProcess}
        >
          Extract Outcomes
        </AppleButton>
      </div>
    </div>
  );
};

export default TranscriptModal;

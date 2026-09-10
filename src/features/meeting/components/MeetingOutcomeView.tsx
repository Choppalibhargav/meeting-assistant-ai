import React, { useState } from "react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiCheckSquare,
  FiSquare,
  FiAlertTriangle,
  FiHelpCircle,
  FiCopy,
  FiCheck,
  FiZap,
  FiFileText,
  FiRefreshCw
} from "react-icons/fi";
import { useMeetingStore } from "../store/meetingStore";

export const MeetingOutcomeView: React.FC = () => {
  const selectedMeeting = useMeetingStore((state) => state.selectedMeetingForDetails);
  const setSelectedMeeting = useMeetingStore((state) => state.setSelectedMeeting);
  const setActiveView = useMeetingStore((state) => state.setActiveView);
  const generateOutcomes = useMeetingStore((state) => state.generateOutcomes);
  const toggleActionItemStatus = useMeetingStore((state) => state.toggleActionItemStatus);
  const isProcessingAI = useMeetingStore((state) => state.isProcessingAI);

  const [copied, setCopied] = useState(false);

  if (!selectedMeeting) {
    return (
      <div className="p-4 text-center">
        <p className="text-xs text-slate-400">No meeting selected.</p>
        <button
          onClick={() => setSelectedMeeting(null)}
          className="mt-2 text-xs text-indigo-400 hover:underline cursor-pointer"
        >
          Return to home
        </button>
      </div>
    );
  }

  const outcome = selectedMeeting.outcome;
  const hasTranscript = Boolean(selectedMeeting.transcript && selectedMeeting.transcript.trim());

  const copyToClipboard = () => {
    if (!outcome) return;

    const md = `# 📝 Meeting Minutes: ${selectedMeeting.title}
**Date:** ${new Date(selectedMeeting.createdAt).toLocaleDateString()}
**Platform:** ${selectedMeeting.platform} | **Duration:** ${Math.floor(selectedMeeting.duration / 60)}m ${selectedMeeting.duration % 60}s

---

## 🎯 Key Decisions
${outcome.decisions.map((d) => `- [x] **Decision:** ${d}`).join("\n")}

---

## ✅ Action Items
| Task | Owner | Deadline | Priority | Status |
| ---- | ----- | -------- | -------- | ------ |
${outcome.actionItems.map((a) => `| ${a.task} | ${a.owner} | ${a.deadline} | ${a.priority} | ${a.status} |`).join("\n")}

---

## 📋 Executive Summary
${outcome.executiveSummary}

### Detailed Discussion Points
${outcome.detailedDiscussion.map((dp) => `* ${dp}`).join("\n\n")}

${outcome.risks.length > 0 ? `\n---\n## ⚠️ Risks & Blockers\n${outcome.risks.map((r) => `- ⚠️ ${r}`).join("\n")}` : ""}
${outcome.openQuestions.length > 0 ? `\n---\n## ❓ Open Questions\n${outcome.openQuestions.map((q) => `- ❓ ${q}`).join("\n")}` : ""}

*Generated with AI Meeting Intelligence Platform (${outcome.modelUsed})*
`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col space-y-3 p-3.5 overflow-y-auto">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <button
          onClick={() => setSelectedMeeting(null)}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>

        <div className="flex items-center gap-2">
          {outcome && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded border border-slate-700 transition-colors cursor-pointer"
              title="Copy formatted meeting minutes to clipboard"
            >
              {copied ? <FiCheck className="w-3 h-3 text-emerald-400" /> : <FiCopy className="w-3 h-3" />}
              {copied ? "Copied!" : "Export MD"}
            </button>
          )}

          <button
            onClick={() => setActiveView("transcript")}
            className="flex items-center gap-1 text-[11px] bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded border border-indigo-500/30 transition-colors cursor-pointer"
          >
            <FiFileText className="w-3 h-3" />
            {hasTranscript ? "Edit Transcript" : "+ Add Transcript"}
          </button>
        </div>
      </div>

      {/* Title & Metadata */}
      <div>
        <h2 className="text-sm font-bold text-white tracking-tight truncate">{selectedMeeting.title}</h2>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
          <span className="text-indigo-400 font-medium">{selectedMeeting.platform}</span>
          <span>•</span>
          <span>{new Date(selectedMeeting.createdAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
          <span>•</span>
          <span className="flex items-center gap-0.5">
            <FiClock className="w-2.5 h-2.5" />
            {Math.floor(selectedMeeting.duration / 60)}m {selectedMeeting.duration % 60}s
          </span>
          <span>•</span>
          <span className={hasTranscript ? "text-emerald-400 font-medium" : "text-amber-400"}>
            {hasTranscript ? "Transcript Attached" : "No Transcript Yet"}
          </span>
        </div>
      </div>

      {/* No Outcome Yet State */}
      {!outcome ? (
        <div className="p-5 bg-slate-900/60 rounded-xl border border-dashed border-slate-800 text-center space-y-3 my-2">
          <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
            <FiZap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white">Generate Structured Outcomes</h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Extract executive summary, highlighted decisions, action items, and blockers.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <button
              onClick={() => generateOutcomes(selectedMeeting.id)}
              disabled={isProcessingAI}
              className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-900/30 cursor-pointer"
            >
              {isProcessingAI ? (
                <>
                  <FiRefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <FiZap className="w-3.5 h-3.5 fill-current" />
                  {hasTranscript ? "Extract Outcomes from Transcript" : "Extract Outcomes with AI (Sample or Attached)"}
                </>
              )}
            </button>

            <button
              onClick={() => setActiveView("transcript")}
              className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 cursor-pointer"
            >
              {hasTranscript ? "View / Edit Transcript" : "✍️ Paste / Upload Transcript First"}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3.5">
          {/* Engine Pill */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 bg-slate-900/50 px-2.5 py-1.5 rounded-md border border-slate-800/80">
            <span className="flex items-center gap-1">
              <FiZap className="w-3 h-3 text-indigo-400" />
              Engine: <span className="text-slate-300 font-mono">{outcome.modelUsed}</span>
            </span>
            <button
              onClick={() => generateOutcomes(selectedMeeting.id)}
              disabled={isProcessingAI}
              className="text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 cursor-pointer"
            >
              <FiRefreshCw className={`w-2.5 h-2.5 ${isProcessingAI ? "animate-spin" : ""}`} />
              Re-analyze
            </button>
          </div>

          {/* 1. DECISIONS HIGHLIGHTED */}
          <div className="bg-indigo-950/30 rounded-xl border border-indigo-500/30 p-3 shadow-sm shadow-indigo-950/50">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="p-1 rounded bg-indigo-500/20 text-indigo-300">
                <FiCheckCircle className="w-3.5 h-3.5" />
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                Decisions Made ({outcome.decisions.length})
              </h3>
            </div>

            <div className="space-y-1.5">
              {outcome.decisions.map((decision, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 bg-slate-900/80 p-2 rounded-lg border border-indigo-500/20 text-xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                  <p className="text-slate-100 font-medium leading-relaxed">{decision}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. ACTION ITEMS HIGHLIGHTED */}
          <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="p-1 rounded bg-emerald-500/20 text-emerald-400">
                  <FiCheckSquare className="w-3.5 h-3.5" />
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Action Items & Tasks ({outcome.actionItems.length})
                </h3>
              </div>
              <span className="text-[10px] text-slate-400">Click to complete</span>
            </div>

            <div className="space-y-2">
              {outcome.actionItems.map((item) => {
                const isCompleted = item.status === "Completed";
                const priorityColor =
                  item.priority === "High"
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                    : item.priority === "Medium"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    : "bg-slate-700 text-slate-300 border-slate-600";

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleActionItemStatus(selectedMeeting.id, item.id)}
                    className={`p-2.5 rounded-lg border transition-all cursor-pointer select-none ${
                      isCompleted
                        ? "bg-slate-900/40 border-slate-800/80 opacity-60"
                        : "bg-slate-800/60 border-slate-700/80 hover:border-indigo-500/40"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <button className="mt-0.5 text-slate-400 hover:text-white">
                        {isCompleted ? (
                          <FiCheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <FiSquare className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs font-medium leading-snug ${
                            isCompleted ? "line-through text-slate-400" : "text-slate-100"
                          }`}
                        >
                          {item.task}
                        </p>

                        <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 font-medium">
                            👤 {item.owner}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
                            📅 {item.deadline}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${priorityColor}`}>
                            {item.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. DETAILED SUMMARY & DISCUSSION */}
          <div className="bg-slate-900/70 rounded-xl border border-slate-800 p-3 space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded bg-indigo-500/20 text-indigo-400">
                <FiFileText className="w-3.5 h-3.5" />
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Executive Summary
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
              {outcome.executiveSummary}
            </p>

            {outcome.detailedDiscussion.length > 0 && (
              <div className="pt-1 space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400">Discussion Highlights</span>
                {outcome.detailedDiscussion.map((point, idx) => (
                  <p key={idx} className="text-[11px] text-slate-400 leading-relaxed pl-2 border-l-2 border-slate-700">
                    {point}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* 4. RISKS & BLOCKERS */}
          {outcome.risks.length > 0 && (
            <div className="bg-rose-950/20 rounded-xl border border-rose-500/30 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="p-1 rounded bg-rose-500/20 text-rose-400">
                  <FiAlertTriangle className="w-3.5 h-3.5" />
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-300">
                  Risks & Blockers ({outcome.risks.length})
                </h3>
              </div>
              <div className="space-y-1">
                {outcome.risks.map((risk, idx) => (
                  <div key={idx} className="text-xs text-rose-200 flex items-start gap-1.5">
                    <span className="text-rose-400">•</span>
                    <span>{risk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. OPEN QUESTIONS */}
          {outcome.openQuestions.length > 0 && (
            <div className="bg-amber-950/20 rounded-xl border border-amber-500/30 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="p-1 rounded bg-amber-500/20 text-amber-400">
                  <FiHelpCircle className="w-3.5 h-3.5" />
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Open Questions ({outcome.openQuestions.length})
                </h3>
              </div>
              <div className="space-y-1">
                {outcome.openQuestions.map((q, idx) => (
                  <div key={idx} className="text-xs text-amber-200 flex items-start gap-1.5">
                    <span className="text-amber-400">•</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MeetingOutcomeView;

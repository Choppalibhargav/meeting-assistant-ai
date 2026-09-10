import React, { useState } from "react";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiHelpCircle,
  FiCopy,
  FiCheck,
  FiZap,
  FiFileText,
  FiRefreshCw,
  FiCheckSquare,
} from "react-icons/fi";
import { useMeetingStore } from "../store/meetingStore";
import Card from "../../../shared/components/ui/Card";
import Badge from "../../../shared/components/ui/Badge";
import AppleButton from "../../../shared/components/ui/AppleButton";
import { useToast } from "../../../shared/components/ui/Toast";

export const MeetingOutcomeView: React.FC = () => {
  const selectedMeeting = useMeetingStore((state) => state.selectedMeetingForDetails);
  const setSelectedMeeting = useMeetingStore((state) => state.setSelectedMeeting);
  const setActiveView = useMeetingStore((state) => state.setActiveView);
  const generateOutcomes = useMeetingStore((state) => state.generateOutcomes);
  const toggleActionItemStatus = useMeetingStore((state) => state.toggleActionItemStatus);
  const isProcessingAI = useMeetingStore((state) => state.isProcessingAI);

  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  if (!selectedMeeting) {
    return (
      <div className="p-8 text-center">
        <p className="text-xs text-[#86868B] dark:text-[#A1A1A6]">No meeting selected.</p>
        <AppleButton
          variant="secondary"
          size="sm"
          onClick={() => setSelectedMeeting(null)}
          className="mt-3"
        >
          Return to home
        </AppleButton>
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
    showToast("Meeting minutes copied to clipboard", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col space-y-4 w-full">
      {/* Top Bar with Back Button & Actions */}
      <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
        <button
          onClick={() => setSelectedMeeting(null)}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#0071E3] dark:text-[#0A84FF] hover:opacity-80 transition-opacity cursor-pointer select-none"
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          {outcome && (
            <AppleButton
              variant="secondary"
              size="sm"
              onClick={copyToClipboard}
              icon={copied ? <FiCheck className="w-3 h-3 text-[#34C759]" /> : <FiCopy className="w-3 h-3" />}
            >
              {copied ? "Copied" : "Export MD"}
            </AppleButton>
          )}

          <AppleButton
            variant="secondary"
            size="sm"
            onClick={() => setActiveView("transcript")}
            icon={<FiFileText className="w-3 h-3 text-[#0071E3]" />}
          >
            {hasTranscript ? "Edit Transcript" : "Add Transcript"}
          </AppleButton>
        </div>
      </div>

      {/* Meeting Title & Meta Card */}
      <Card padding="md" className="space-y-1.5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] truncate">
              {selectedMeeting.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-[#86868B] dark:text-[#A1A1A6] mt-1 flex-wrap">
              <Badge variant="blue" size="sm">
                {selectedMeeting.platform}
              </Badge>
              <span>•</span>
              <span>
                {new Date(selectedMeeting.createdAt).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <FiClock className="w-3 h-3" />
                {Math.floor(selectedMeeting.duration / 60)}m {selectedMeeting.duration % 60}s
              </span>
            </div>
          </div>

          <Badge variant={hasTranscript ? "green" : "orange"} size="md">
            {hasTranscript ? "Transcript Available" : "No Transcript"}
          </Badge>
        </div>
      </Card>

      {/* No Outcome Yet State */}
      {!outcome ? (
        <Card variant="inset" padding="lg" className="text-center space-y-4 my-2">
          <div className="w-12 h-12 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] dark:text-[#0A84FF] flex items-center justify-center mx-auto shadow-sm">
            <FiZap className="w-6 h-6 fill-current" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Extract Structured Outcomes
            </h3>
            <p className="text-xs text-[#86868B] dark:text-[#A1A1A6] mt-1 leading-normal max-w-md mx-auto">
              Automatically identify key decisions, assigned tasks with owners & deadlines, risks, and a comprehensive executive summary.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2 max-w-md mx-auto w-full">
            <AppleButton
              variant="primary"
              size="md"
              className="w-full sm:w-auto"
              isLoading={isProcessingAI}
              icon={<FiZap className="w-3.5 h-3.5 fill-current" />}
              onClick={() => generateOutcomes(selectedMeeting.id)}
            >
              {hasTranscript
                ? "Extract Outcomes from Transcript"
                : "Extract Outcomes with AI"}
            </AppleButton>

            <AppleButton
              variant="secondary"
              size="md"
              className="w-full sm:w-auto"
              onClick={() => setActiveView("transcript")}
            >
              {hasTranscript ? "View / Edit Transcript" : "Paste or Upload Transcript"}
            </AppleButton>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* AI Engine Banner */}
          <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-black/[0.025] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06] text-xs text-[#86868B] dark:text-[#A1A1A6]">
            <span className="flex items-center gap-1.5">
              <FiZap className="w-3.5 h-3.5 text-[#AF52DE]" />
              Intelligence Engine: <span className="font-mono font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">{outcome.modelUsed}</span>
            </span>
            <button
              onClick={() => generateOutcomes(selectedMeeting.id)}
              disabled={isProcessingAI}
              className="text-[#0071E3] dark:text-[#0A84FF] hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <FiRefreshCw className={`w-3 h-3 ${isProcessingAI ? "animate-spin" : ""}`} />
              Re-analyze
            </button>
          </div>

          {/* Side-by-Side Grid for Decisions & Action Items on Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {/* 1. KEY DECISIONS (Apple Purple Accent) */}
            <Card padding="md" className="space-y-2.5 border-l-4 border-l-[#AF52DE] h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#AF52DE]/10 text-[#AF52DE] dark:bg-[#BF5AF2]/20 dark:text-[#BF5AF2]">
                    <FiCheckCircle className="w-4 h-4" />
                  </span>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F] dark:text-[#F5F5F7]">
                    Key Decisions
                  </h3>
                </div>
                <Badge variant="purple" size="sm">
                  {outcome.decisions.length}
                </Badge>
              </div>

              <div className="space-y-2 pt-1">
                {outcome.decisions.map((decision, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05] text-xs leading-relaxed"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#AF52DE] mt-1.5 flex-shrink-0" />
                    <p className="text-[#1D1D1F] dark:text-[#F5F5F7] font-medium">{decision}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* 2. ACTION ITEMS & TASKS (Apple Reminders Style) */}
            <Card padding="md" className="space-y-2.5 border-l-4 border-l-[#0071E3] h-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#0071E3]/10 text-[#0071E3] dark:bg-[#0A84FF]/20 dark:text-[#0A84FF]">
                    <FiCheckSquare className="w-4 h-4" />
                  </span>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F] dark:text-[#F5F5F7]">
                    Action Items & Tasks
                  </h3>
                </div>
                <Badge variant="blue" size="sm">
                  {outcome.actionItems.length}
                </Badge>
              </div>

              <div className="space-y-2 pt-1">
                {outcome.actionItems.map((item) => {
                  const isCompleted = item.status === "Completed";
                  const priorityVariant =
                    item.priority === "High"
                      ? "red"
                      : item.priority === "Medium"
                      ? "orange"
                      : "gray";

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        toggleActionItemStatus(selectedMeeting.id, item.id);
                        showToast(
                          isCompleted
                            ? `Marked "${item.task.slice(0, 20)}..." pending`
                            : `Completed "${item.task.slice(0, 20)}..."`,
                          "info"
                        );
                      }}
                      className={`p-3 rounded-xl border transition-all duration-150 cursor-pointer select-none flex items-start gap-2.5 ${
                        isCompleted
                          ? "bg-black/[0.015] dark:bg-white/[0.02] border-black/[0.03] dark:border-white/[0.04] opacity-50"
                          : "bg-black/[0.02] dark:bg-white/[0.03] border-black/[0.04] dark:border-white/[0.06] hover:border-[#0071E3]/30"
                      }`}
                    >
                      {/* Apple Style Circular Checkbox */}
                      <button
                        className={`w-4 h-4 mt-0.5 rounded-full border flex items-center justify-center transition-all flex-shrink-0 ${
                          isCompleted
                            ? "bg-[#34C759] border-[#34C759] text-white"
                            : "border-black/30 dark:border-white/30 hover:border-[#0071E3]"
                        }`}
                      >
                        {isCompleted && <FiCheck className="w-2.5 h-2.5 stroke-[3]" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-xs font-medium leading-snug transition-all ${
                            isCompleted
                              ? "line-through text-[#86868B] dark:text-[#A1A1A6]"
                              : "text-[#1D1D1F] dark:text-[#F5F5F7]"
                          }`}
                        >
                          {item.task}
                        </p>

                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.07] text-[#1D1D1F] dark:text-[#F5F5F7] font-medium">
                            👤 {item.owner}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.07] text-[#86868B] dark:text-[#A1A1A6]">
                            📅 {item.deadline}
                          </span>
                          <Badge variant={priorityVariant} size="sm">
                            {item.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* 3. EXECUTIVE SUMMARY & DISCUSSION */}
          <Card padding="lg" className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-black/[0.05] dark:bg-white/[0.08] text-[#1D1D1F] dark:text-[#F5F5F7]">
                <FiFileText className="w-4 h-4" />
              </span>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1D1D1F] dark:text-[#F5F5F7]">
                Executive Summary
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-[#1D1D1F] dark:text-[#E5E5EA] leading-relaxed p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.05]">
              {outcome.executiveSummary}
            </p>

            {outcome.detailedDiscussion.length > 0 && (
              <div className="pt-2 space-y-2">
                <span className="text-xs font-semibold text-[#86868B] dark:text-[#A1A1A6]">
                  Discussion Highlights
                </span>
                <div className="space-y-1.5">
                  {outcome.detailedDiscussion.map((point, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-[#86868B] dark:text-[#A1A1A6] leading-relaxed pl-3 border-l-2 border-[#0071E3]/40"
                    >
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* 4. RISKS & OPEN QUESTIONS ROW */}
          {(outcome.risks.length > 0 || outcome.openQuestions.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Risks & Blockers */}
              {outcome.risks.length > 0 && (
                <Card padding="md" className="space-y-2 border-l-4 border-l-[#FF3B30] bg-[#FF3B30]/[0.02]">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#FF3B30]/10 text-[#FF3B30]">
                      <FiAlertTriangle className="w-4 h-4" />
                    </span>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#D70015] dark:text-[#FF453A]">
                      Risks & Blockers ({outcome.risks.length})
                    </h3>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    {outcome.risks.map((risk, idx) => (
                      <div key={idx} className="text-xs text-[#D70015] dark:text-[#FF6961] flex items-start gap-1.5">
                        <span>•</span>
                        <span className="leading-snug">{risk}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Open Questions */}
              {outcome.openQuestions.length > 0 && (
                <Card padding="md" className="space-y-2 border-l-4 border-l-[#FF9500] bg-[#FF9500]/[0.02]">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#FF9500]/10 text-[#FF9500]">
                      <FiHelpCircle className="w-4 h-4" />
                    </span>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#C93400] dark:text-[#FF9F0A]">
                      Open Questions ({outcome.openQuestions.length})
                    </h3>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    {outcome.openQuestions.map((q, idx) => (
                      <div key={idx} className="text-xs text-[#C93400] dark:text-[#FFB340] flex items-start gap-1.5">
                        <span>•</span>
                        <span className="leading-snug">{q}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MeetingOutcomeView;

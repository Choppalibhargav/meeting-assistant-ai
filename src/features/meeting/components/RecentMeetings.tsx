import React, { useState } from "react";
import { FiChevronDown, FiChevronRight, FiClock, FiCheck, FiZap, FiFileText } from "react-icons/fi";
import { useMeetingStore } from "../store/meetingStore";

export const RecentMeetings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const recentMeetings = useMeetingStore((state) => state.recentMeetings);
  const syncMeeting = useMeetingStore((state) => state.syncMeeting);
  const backendOnline = useMeetingStore((state) => state.backendOnline);
  const setSelectedMeeting = useMeetingStore((state) => state.setSelectedMeeting);

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}m ${s}s`;
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString([], { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  };

  return (
    <div className="border-t border-slate-800 pt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-slate-400 hover:text-slate-200 text-xs font-medium py-1 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-1.5">
          {isOpen ? <FiChevronDown className="w-3.5 h-3.5" /> : <FiChevronRight className="w-3.5 h-3.5" />}
          Meeting History & Outcomes
          <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-400">
            {recentMeetings.length}
          </span>
        </span>
        <span className="text-[10px] text-indigo-400 font-medium">Click to view details</span>
      </button>

      {isOpen && (
        <div className="mt-2 space-y-2 max-h-56 overflow-y-auto pr-1">
          {recentMeetings.length === 0 ? (
            <p className="text-[11px] text-slate-500 text-center py-3 bg-slate-900/40 rounded border border-slate-800/60">
              No meetings recorded yet. Start a session above!
            </p>
          ) : (
            recentMeetings.map((m) => {
              const hasOutcome = Boolean(m.outcome);
              const hasTranscript = Boolean(m.transcript);

              return (
                <div
                  key={m.id}
                  className="bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg p-2.5 transition-all text-xs space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1 pr-2">
                      <h4 className="font-semibold text-slate-200 truncate">{m.title}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="text-indigo-400 font-medium">{m.platform}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <FiClock className="w-2.5 h-2.5" />
                          {formatDuration(m.duration)}
                        </span>
                        <span>•</span>
                        <span>{formatDate(m.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {m.syncStatus === "synced" ? (
                        <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-0.5">
                          <FiCheck className="w-2.5 h-2.5" />
                          SQLite
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            syncMeeting(m.id);
                          }}
                          disabled={!backendOnline}
                          className="text-[9px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 cursor-pointer"
                        >
                          Sync
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Badges & Actions */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                    <div className="flex items-center gap-1.5">
                      {hasOutcome ? (
                        <span className="text-[9px] font-medium text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20 flex items-center gap-1">
                          <FiZap className="w-2.5 h-2.5 text-indigo-400" />
                          Outcomes Ready
                        </span>
                      ) : hasTranscript ? (
                        <span className="text-[9px] font-medium text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
                          <FiFileText className="w-2.5 h-2.5 text-amber-400" />
                          Transcript Added
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-500">No transcript yet</span>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedMeeting(m)}
                      className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/80 hover:bg-slate-800"
                    >
                      {hasOutcome ? "View Outcomes →" : "Add Transcript / AI →"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default RecentMeetings;

import React, { useState } from "react";
import { FiChevronDown, FiChevronRight, FiClock, FiCheck, FiAlertCircle, FiUploadCloud } from "react-icons/fi";
import { useMeetingStore } from "../store/meetingStore";

export const RecentMeetings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const recentMeetings = useMeetingStore((state) => state.recentMeetings);
  const syncMeeting = useMeetingStore((state) => state.syncMeeting);
  const backendOnline = useMeetingStore((state) => state.backendOnline);

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
          Meeting History
          <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-400">
            {recentMeetings.length}
          </span>
        </span>
        <span className="text-[10px] text-slate-500">Local & SQLite</span>
      </button>

      {isOpen && (
        <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {recentMeetings.length === 0 ? (
            <p className="text-[11px] text-slate-500 text-center py-3 bg-slate-900/40 rounded border border-slate-800/60">
              No meetings recorded yet.
            </p>
          ) : (
            recentMeetings.map((m) => (
              <div
                key={m.id}
                className="bg-slate-900/60 border border-slate-800 rounded-lg p-2 flex items-center justify-between text-xs"
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-slate-200 truncate">{m.title}</span>
                  </div>
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

                <div className="flex items-center gap-1 flex-shrink-0">
                  {m.syncStatus === "synced" ? (
                    <span className="flex items-center gap-0.5 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      <FiCheck className="w-2.5 h-2.5" />
                      Synced
                    </span>
                  ) : (
                    <button
                      onClick={() => syncMeeting(m.id)}
                      disabled={!backendOnline}
                      title={backendOnline ? "Sync to FastAPI" : "Backend offline"}
                      className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border ${
                        backendOnline
                          ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20 cursor-pointer"
                          : "bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed"
                      }`}
                    >
                      {backendOnline ? (
                        <>
                          <FiUploadCloud className="w-2.5 h-2.5" />
                          Sync
                        </>
                      ) : (
                        <>
                          <FiAlertCircle className="w-2.5 h-2.5" />
                          Local
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RecentMeetings;


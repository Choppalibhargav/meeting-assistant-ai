const ActionButtons = () => {
import React from "react";
import { FiPlay, FiSquare, FiRotateCcw, FiUploadCloud, FiCheck } from "react-icons/fi";
import { useMeetingStore } from "../../../features/meeting/store/meetingStore";

export const ActionButtons: React.FC = () => {
  const status = useMeetingStore((state) => state.status);
  const currentMeeting = useMeetingStore((state) => state.currentMeeting);
  const startMeeting = useMeetingStore((state) => state.startMeeting);
  const endMeeting = useMeetingStore((state) => state.endMeeting);
  const resetMeeting = useMeetingStore((state) => state.resetMeeting);
  const syncMeeting = useMeetingStore((state) => state.syncMeeting);
  const backendOnline = useMeetingStore((state) => state.backendOnline);

  if (status === "active") {
    return (
      <div className="space-y-2">
        <button
          onClick={() => endMeeting()}
          className="w-full py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-900/30 active:scale-[0.99] transition-all cursor-pointer"
        >
          <FiSquare className="w-3.5 h-3.5 fill-current" />
          End Meeting & Save
        </button>
      </div>
    );
  }

  if (status === "ended") {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {currentMeeting?.syncStatus !== "synced" ? (
            <button
              onClick={() => currentMeeting && syncMeeting(currentMeeting.id)}
              disabled={!backendOnline}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                backendOnline
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
              }`}
            >
              <FiUploadCloud className="w-3.5 h-3.5" />
              {backendOnline ? "Sync to Backend" : "Backend Offline"}
            </button>
          ) : (
            <div className="flex-1 py-2 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center justify-center gap-1.5">
              <FiCheck className="w-3.5 h-3.5 text-emerald-400" />
              Synced to SQLite
            </div>
          )}

          <button
            onClick={() => resetMeeting()}
            className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <FiRotateCcw className="w-3.5 h-3.5" />
            New Session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button>Action</button>
      <button
        onClick={() => startMeeting()}
        className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 active:scale-[0.99] transition-all cursor-pointer"
      >
        <FiPlay className="w-3.5 h-3.5 fill-current" />
        Start Meeting Capture
      </button>
    </div>
  )
}
  );
};

export default ActionButtons
export default ActionButtons;

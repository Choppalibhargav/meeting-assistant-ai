import React from "react";
import { FiEdit2, FiLink, FiLayers, FiHash } from "react-icons/fi";
import { useMeetingStore } from "../store/meetingStore";

export const MeetingInfo: React.FC = () => {
  const currentMeeting = useMeetingStore((state) => state.currentMeeting);
  const setTitle = useMeetingStore((state) => state.setTitle);
  const status = useMeetingStore((state) => state.status);

  if (!currentMeeting) {
    return (
      <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-800 text-center py-4">
        <p className="text-xs text-slate-400">Navigate to a meeting tab to populate metadata.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/60 rounded-lg border border-slate-700/60 p-3.5 space-y-3">
      <div>
        <label className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5 mb-1">
          <FiEdit2 className="w-3 h-3 text-slate-500" />
          Meeting Title
        </label>
        <input
          type="text"
          value={currentMeeting.title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Sprint Planning, Architecture Review"
          disabled={status === "ended"}
          className="w-full text-xs font-medium bg-slate-900/80 border border-slate-700 rounded px-2.5 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-75"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="bg-slate-900/50 rounded border border-slate-800 p-2">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <FiLayers className="w-3 h-3 text-indigo-400" />
            Platform
          </span>
          <p className="text-white font-medium mt-0.5 truncate">{currentMeeting.platform}</p>
        </div>

        <div className="bg-slate-900/50 rounded border border-slate-800 p-2">
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <FiHash className="w-3 h-3 text-cyan-400" />
            Session ID
          </span>
          <p className="text-white font-mono text-[10px] mt-0.5 truncate" title={currentMeeting.id}>
            {currentMeeting.id.slice(0, 8)}...
          </p>
        </div>
      </div>

      {currentMeeting.url && (
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-900/40 px-2 py-1.5 rounded border border-slate-800/80">
          <FiLink className="w-3 h-3 text-slate-500 flex-shrink-0" />
          <span className="truncate font-mono">{currentMeeting.url}</span>
        </div>
      )}
    </div>
  );
};

export default MeetingInfo;

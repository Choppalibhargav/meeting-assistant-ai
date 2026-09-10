import React from "react";
import { FiVideo, FiActivity, FiCheckCircle, FiInfo } from "react-icons/fi";
import { useMeetingStore } from "../store/meetingStore";

export const StatusCard: React.FC = () => {
  const status = useMeetingStore((state) => state.status);
  const currentMeeting = useMeetingStore((state) => state.currentMeeting);

  const getStatusConfig = () => {
    switch (status) {
      case "active":
        return {
          bg: "bg-rose-500/10 border-rose-500/30 text-rose-300",
          dot: "bg-rose-500 animate-ping",
          icon: <FiActivity className="w-4 h-4 text-rose-400" />,
          title: "Meeting In Progress",
          subtitle: "Tracking duration and metadata in background",
        };
      case "detected":
        return {
          bg: "bg-indigo-500/10 border-indigo-500/30 text-indigo-300",
          dot: "bg-indigo-400",
          icon: <FiVideo className="w-4 h-4 text-indigo-400" />,
          title: `${currentMeeting?.platform || "Meeting"} Detected`,
          subtitle: "Tab recognized. Ready to start capture session.",
        };
      case "ended":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
          dot: "bg-emerald-400",
          icon: <FiCheckCircle className="w-4 h-4 text-emerald-400" />,
          title: "Session Completed",
          subtitle: "Metadata and duration recorded successfully",
        };
      case "idle":
      default:
        return {
          bg: "bg-slate-800/80 border-slate-700/60 text-slate-300",
          dot: "bg-slate-500",
          icon: <FiInfo className="w-4 h-4 text-slate-400" />,
          title: "No Active Meeting Detected",
          subtitle: "Open Google Meet, Teams, Zoom, or start ad-hoc",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`p-3 rounded-lg border ${config.bg} flex items-start gap-3 transition-all`}>
      <div className="relative mt-0.5">
        <div className="p-1.5 rounded-md bg-slate-900/60 border border-white/5">
          {config.icon}
        </div>
        {status === "active" && (
          <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${config.dot}`} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide uppercase">{config.title}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900/60 border border-white/10 font-mono text-slate-400">
            {status.toUpperCase()}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{config.subtitle}</p>
      </div>
    </div>
  );
};

export default StatusCard;

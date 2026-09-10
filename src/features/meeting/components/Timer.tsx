import React, { useEffect } from "react";
import { FiClock } from "react-icons/fi";
import { useMeetingStore } from "../store/meetingStore";

export const Timer: React.FC = () => {
  const elapsedSeconds = useMeetingStore((state) => state.elapsedSeconds);
  const status = useMeetingStore((state) => state.status);
  const currentMeeting = useMeetingStore((state) => state.currentMeeting);
  const tick = useMeetingStore((state) => state.tick);

  useEffect(() => {
    if (status !== "active") return;

    tick();
    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [status, tick]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => String(n).padStart(2, "0");

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  const formatTimestamp = (epochMs: number | null) => {
    if (!epochMs) return "--:--";
    return new Date(epochMs).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="bg-slate-900/80 rounded-lg border border-slate-800 p-4 flex flex-col items-center justify-center relative overflow-hidden">
      {status === "active" && (
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-[9px] uppercase tracking-wider text-rose-400 font-bold">REC</span>
        </div>
      )}

      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
        <FiClock className="w-3.5 h-3.5 text-indigo-400" />
        <span className="font-medium uppercase tracking-wider text-[10px]">
          {status === "ended" ? "Total Duration" : "Session Timer"}
        </span>
      </div>

      <div className="font-mono text-3xl font-bold tracking-tight text-white my-1 tabular-nums">
        {formatTime(status === "ended" ? currentMeeting?.duration || elapsedSeconds : elapsedSeconds)}
      </div>

      <div className="flex items-center gap-4 text-[10px] text-slate-400 mt-1">
        <span>Started: {formatTimestamp(currentMeeting?.startTime || null)}</span>
        {status === "ended" && (
          <span>Ended: {formatTimestamp(currentMeeting?.endTime || null)}</span>
        )}
      </div>
    </div>
  );
};

export default Timer;

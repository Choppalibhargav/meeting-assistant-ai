import React, { useEffect } from "react";
import { FiClock } from "react-icons/fi";
import { useMeetingStore } from "../store/meetingStore";
import Card from "../../../shared/components/ui/Card";

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

  const displaySeconds =
    status === "ended" ? currentMeeting?.duration || elapsedSeconds : elapsedSeconds;

  return (
    <Card
      padding="md"
      className="relative flex flex-col items-center justify-center text-center overflow-hidden transition-all duration-300"
    >
      {/* Live Recording Indicator */}
      {status === "active" && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FF3B30]/10 border border-[#FF3B30]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-ping" />
          <span className="text-[9px] uppercase tracking-wider text-[#FF3B30] font-bold">
            REC
          </span>
        </div>
      )}

      {/* Header Label */}
      <div className="flex items-center gap-1.5 text-[#86868B] dark:text-[#A1A1A6] mb-1 select-none">
        <FiClock className="w-3.5 h-3.5 text-[#0071E3] dark:text-[#0A84FF]" />
        <span className="font-semibold uppercase tracking-wider text-[10px]">
          {status === "ended" ? "Total Session Duration" : "Meeting Timer"}
        </span>
      </div>

      {/* Large Tabular Digits */}
      <div className="font-mono text-4xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#FFFFFF] my-1 tabular-nums">
        {formatTime(displaySeconds)}
      </div>

      {/* Meta Timestamps */}
      <div className="flex items-center gap-3 text-[11px] text-[#86868B] dark:text-[#A1A1A6] mt-1 select-none">
        <span>Started: {formatTimestamp(currentMeeting?.startTime || null)}</span>
        {status === "ended" && (
          <>
            <span>•</span>
            <span>Ended: {formatTimestamp(currentMeeting?.endTime || null)}</span>
          </>
        )}
      </div>
    </Card>
  );
};

export default Timer;

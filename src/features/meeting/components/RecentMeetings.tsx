import React, { useState } from "react";
import {
  FiChevronDown,
  FiChevronRight,
  FiClock,
  FiCheck,
  FiZap,
  FiFileText,
  FiUploadCloud,
} from "react-icons/fi";
import { useMeetingStore } from "../store/meetingStore";
import Card from "../../../shared/components/ui/Card";
import Badge from "../../../shared/components/ui/Badge";

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
    <div className="pt-2">
      {/* Group Header Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-[#F5F5F7] text-xs font-semibold py-1.5 transition-colors cursor-pointer select-none"
      >
        <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
          {isOpen ? (
            <FiChevronDown className="w-3.5 h-3.5 text-[#86868B]" />
          ) : (
            <FiChevronRight className="w-3.5 h-3.5 text-[#86868B]" />
          )}
          <span>Meeting History & Outcomes</span>
          <Badge variant="gray" size="sm">
            {recentMeetings.length}
          </Badge>
        </span>
        <span className="text-[10px] text-[#0071E3] dark:text-[#0A84FF] font-medium lowercase">
          {isOpen ? "hide" : "show"}
        </span>
      </button>

      {isOpen && (
        <div className="mt-1.5">
          {recentMeetings.length === 0 ? (
            <Card variant="inset" padding="md" className="text-center">
              <p className="text-xs text-[#86868B] dark:text-[#A1A1A6]">
                No meetings recorded yet. Start a session above!
              </p>
            </Card>
          ) : (
            <Card padding="none" className="overflow-hidden divide-y divide-black/[0.05] dark:divide-white/[0.06]">
              <div className="max-h-56 overflow-y-auto divide-y divide-black/[0.05] dark:divide-white/[0.06]">
                {recentMeetings.map((m) => {
                  const hasOutcome = Boolean(m.outcome);
                  const hasTranscript = Boolean(m.transcript);

                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMeeting(m)}
                      className="p-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors cursor-pointer flex flex-col gap-2 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] truncate group-hover:text-[#0071E3] dark:group-hover:text-[#0A84FF] transition-colors">
                            {m.title}
                          </h3>

                          <div className="flex items-center gap-2 text-[10px] text-[#86868B] dark:text-[#A1A1A6] mt-0.5">
                            <span className="font-medium text-[#0071E3] dark:text-[#0A84FF]">
                              {m.platform}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <FiClock className="w-2.5 h-2.5" />
                              {formatDuration(m.duration)}
                            </span>
                            <span>•</span>
                            <span>{formatDate(m.createdAt)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                          {m.syncStatus === "synced" ? (
                            <Badge variant="green" size="sm">
                              <FiCheck className="w-2.5 h-2.5" />
                              SQLite
                            </Badge>
                          ) : (
                            <button
                              onClick={() => syncMeeting(m.id)}
                              disabled={!backendOnline}
                              title="Sync to SQLite"
                              className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-black/[0.05] hover:bg-black/[0.08] dark:bg-white/[0.08] dark:hover:bg-white/[0.12] text-[#1D1D1F] dark:text-[#F5F5F7] disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <FiUploadCloud className="w-2.5 h-2.5" />
                              Sync
                            </button>
                          )}
                          <FiChevronRight className="w-3.5 h-3.5 text-[#86868B] group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>

                      {/* Bottom row pills */}
                      <div className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1.5">
                          {hasOutcome ? (
                            <Badge variant="purple" size="sm">
                              <FiZap className="w-2.5 h-2.5" />
                              Outcomes Ready
                            </Badge>
                          ) : hasTranscript ? (
                            <Badge variant="orange" size="sm">
                              <FiFileText className="w-2.5 h-2.5" />
                              Transcript Added
                            </Badge>
                          ) : (
                            <span className="text-[#86868B] dark:text-[#A1A1A6] text-[10px]">
                              No transcript
                            </span>
                          )}
                        </div>

                        <span className="text-[#0071E3] dark:text-[#0A84FF] font-medium text-[10px] group-hover:underline">
                          {hasOutcome ? "View Outcomes" : "Add Transcript"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default RecentMeetings;

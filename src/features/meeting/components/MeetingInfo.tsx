import React from "react";
import { FiEdit2, FiLink, FiLayers, FiHash } from "react-icons/fi";
import { useMeetingStore } from "../store/meetingStore";
import Card from "../../../shared/components/ui/Card";
import Badge from "../../../shared/components/ui/Badge";

export const MeetingInfo: React.FC = () => {
  const currentMeeting = useMeetingStore((state) => state.currentMeeting);
  const setTitle = useMeetingStore((state) => state.setTitle);
  const status = useMeetingStore((state) => state.status);

  if (!currentMeeting) {
    return (
      <Card variant="inset" padding="sm" className="text-center py-5">
        <p className="text-xs text-[#86868B] dark:text-[#A1A1A6]">
          Navigate to a meeting tab to automatically populate metadata.
        </p>
      </Card>
    );
  }

  return (
    <Card padding="md" className="space-y-3">
      {/* Title Input */}
      <div>
        <label className="text-[11px] font-medium text-[#86868B] dark:text-[#A1A1A6] flex items-center gap-1.5 mb-1.5">
          <FiEdit2 className="w-3 h-3 text-[#86868B]" />
          Meeting Title
        </label>
        <input
          type="text"
          value={currentMeeting.title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Architecture Alignment, Sprint Review"
          disabled={status === "ended"}
          className="w-full text-xs font-medium bg-black/[0.03] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] rounded-xl px-3 py-2 text-[#1D1D1F] dark:text-[#F5F5F7] placeholder-[#86868B] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/30 focus:border-[#0071E3] transition-all disabled:opacity-60"
        />
      </div>

      {/* Grouped Metadata Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-xl bg-black/[0.025] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06]">
          <span className="text-[10px] text-[#86868B] dark:text-[#A1A1A6] font-medium flex items-center gap-1">
            <FiLayers className="w-3 h-3 text-[#0071E3]" />
            Platform
          </span>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] truncate">
              {currentMeeting.platform}
            </span>
            <Badge variant="blue" size="sm">
              Live
            </Badge>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-black/[0.025] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06]">
          <span className="text-[10px] text-[#86868B] dark:text-[#A1A1A6] font-medium flex items-center gap-1">
            <FiHash className="w-3 h-3 text-[#AF52DE]" />
            Session ID
          </span>
          <p
            className="text-[11px] font-mono font-medium text-[#1D1D1F] dark:text-[#F5F5F7] mt-1 truncate"
            title={currentMeeting.id}
          >
            {currentMeeting.id.slice(0, 10)}...
          </p>
        </div>
      </div>

      {/* URL Row */}
      {currentMeeting.url && (
        <div className="flex items-center gap-1.5 text-[11px] text-[#86868B] dark:text-[#A1A1A6] bg-black/[0.02] dark:bg-white/[0.03] px-2.5 py-1.5 rounded-xl border border-black/[0.04] dark:border-white/[0.06]">
          <FiLink className="w-3 h-3 flex-shrink-0 text-[#86868B]" />
          <span className="truncate font-mono text-[10px] select-all">
            {currentMeeting.url}
          </span>
        </div>
      )}
    </Card>
  );
};

export default MeetingInfo;

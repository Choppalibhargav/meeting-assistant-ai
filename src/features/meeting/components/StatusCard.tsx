import React from "react";
import { FiVideo, FiActivity, FiCheckCircle, FiInfo } from "react-icons/fi";
import { useMeetingStore } from "../store/meetingStore";
import Badge from "../../../shared/components/ui/Badge";

export const StatusCard: React.FC = () => {
  const status = useMeetingStore((state) => state.status);
  const currentMeeting = useMeetingStore((state) => state.currentMeeting);

  const getStatusConfig = () => {
    switch (status) {
      case "active":
        return {
          cardBg: "bg-[#FF3B30]/[0.06] border-[#FF3B30]/20 text-[#1D1D1F] dark:text-white",
          iconBg: "bg-[#FF3B30] text-white shadow-[0_2px_8px_rgba(255,59,48,0.35)]",
          icon: <FiActivity className="w-4 h-4 animate-pulse" />,
          title: "Session In Progress",
          subtitle: "Recording audio/captions and tracking duration",
          badgeVariant: "red" as const,
          badgeText: "RECORDING",
        };
      case "detected":
        return {
          cardBg: "bg-[#0071E3]/[0.05] border-[#0071E3]/20 text-[#1D1D1F] dark:text-white",
          iconBg: "bg-[#0071E3] text-white shadow-[0_2px_8px_rgba(0,113,227,0.35)]",
          icon: <FiVideo className="w-4 h-4" />,
          title: `${currentMeeting?.platform || "Meeting"} Detected`,
          subtitle: "Active tab recognized. Ready to start capture.",
          badgeVariant: "blue" as const,
          badgeText: "READY",
        };
      case "ended":
        return {
          cardBg: "bg-[#34C759]/[0.06] border-[#34C759]/20 text-[#1D1D1F] dark:text-white",
          iconBg: "bg-[#34C759] text-white shadow-[0_2px_8px_rgba(52,199,89,0.35)]",
          icon: <FiCheckCircle className="w-4 h-4" />,
          title: "Session Completed",
          subtitle: "Duration and metadata logged. Ready for AI extraction.",
          badgeVariant: "green" as const,
          badgeText: "FINISHED",
        };
      case "idle":
      default:
        return {
          cardBg: "bg-black/[0.025] dark:bg-white/[0.04] border-black/[0.04] dark:border-white/[0.06] text-[#1D1D1F] dark:text-white",
          iconBg: "bg-black/[0.08] dark:bg-white/[0.12] text-[#86868B] dark:text-[#F5F5F7]",
          icon: <FiInfo className="w-4 h-4" />,
          title: "Standby Mode",
          subtitle: "Open Google Meet, Teams, Zoom, or run an ad-hoc session.",
          badgeVariant: "gray" as const,
          badgeText: "IDLE",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-start gap-3 select-none ${config.cardBg}`}
    >
      <div className={`p-2 rounded-xl flex-shrink-0 flex items-center justify-center ${config.iconBg}`}>
        {config.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <h2 className="text-xs font-semibold tracking-tight truncate">
            {config.title}
          </h2>
          <Badge variant={config.badgeVariant} size="sm" dot={status === "active"}>
            {config.badgeText}
          </Badge>
        </div>
        <p className="text-[11px] text-[#86868B] dark:text-[#A1A1A6] mt-0.5 leading-snug">
          {config.subtitle}
        </p>
      </div>
    </div>
  );
};

export default StatusCard;

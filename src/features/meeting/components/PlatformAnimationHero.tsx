import React, { useEffect, useState } from "react";
import { FiCheck } from "react-icons/fi";
import { useMeetingStore } from "../store/meetingStore";

interface PlatformConfig {
  id: string;
  name: string;
  badge: string;
  domain: string;
  description: string;
  accentColor: string;
  bgTint: string;
  renderLogo: () => React.ReactNode;
}

const PLATFORMS: PlatformConfig[] = [
  {
    id: "Google Meet",
    name: "Google Meet",
    badge: "Live Captions Ready",
    domain: "meet.google.com",
    description: "DOM caption observer & speaker tracking",
    accentColor: "#00AC47",
    bgTint: "from-[#00AC47]/10 to-transparent",
    renderLogo: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path
          d="M15 8.5V4.5C15 3.67 14.33 3 13.5 3H3.5C2.67 3 2 3.67 2 4.5V19.5C2 20.33 2.67 21 3.5 21H13.5C14.33 21 15 20.33 15 19.5V15.5L20.5 20C21.05 20.45 22 20.05 22 19.34V4.66C22 3.95 21.05 3.55 20.5 4L15 8.5Z"
          fill="#00AC47"
        />
        <path d="M15 8.5L22 4.66V19.34L15 15.5V8.5Z" fill="#00832D" />
        <path d="M2 15.5V19.5C2 20.33 2.67 21 3.5 21H13.5V15.5H2Z" fill="#2684FC" />
        <path d="M13.5 3H3.5C2.67 3 2 3.67 2 4.5V8.5H13.5V3Z" fill="#EA4335" />
        <path d="M2 8.5H13.5V15.5H2V8.5Z" fill="#FFBA00" />
      </svg>
    ),
  },
  {
    id: "Microsoft Teams",
    name: "Microsoft Teams",
    badge: "Meeting Intelligence",
    domain: "teams.microsoft.com",
    description: "Enterprise task & transcript extraction",
    accentColor: "#6264A7",
    bgTint: "from-[#6264A7]/10 to-transparent",
    renderLogo: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="14" height="14" rx="3" fill="#505AC9" />
        <circle cx="17.5" cy="7.5" r="3.5" fill="#7B83EB" />
        <path
          d="M16 13C14.34 13 13 14.34 13 16V18H22V16C22 14.34 20.66 13 19 13H16Z"
          fill="#7B83EB"
        />
        <text
          x="9"
          y="13"
          textAnchor="middle"
          fill="white"
          fontSize="9"
          fontWeight="bold"
          fontFamily="system-ui"
        >
          T
        </text>
      </svg>
    ),
  },
  {
    id: "Zoom",
    name: "Zoom Meetings",
    badge: "Cloud Audio Sync",
    domain: "zoom.us",
    description: "Dual-channel recording & outcome pipeline",
    accentColor: "#2D8CFF",
    bgTint: "from-[#2D8CFF]/10 to-transparent",
    renderLogo: () => (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#2D8CFF" />
        <path
          d="M6.5 9.5C6.5 8.67 7.17 8 8 8H13C13.83 8 14.5 8.67 14.5 9.5V14.5C14.5 15.33 13.83 16 13 16H8C7.17 16 6.5 15.33 6.5 14.5V9.5Z"
          fill="white"
        />
        <path
          d="M15.5 11L18.2 8.95C18.67 8.6 19.5 8.93 19.5 9.55V14.45C19.5 15.07 18.67 15.4 18.2 15.05L15.5 13V11Z"
          fill="white"
        />
      </svg>
    ),
  },
];

export const PlatformAnimationHero: React.FC = () => {
  const currentMeeting = useMeetingStore((state) => state.currentMeeting);
  const status = useMeetingStore((state) => state.status);

  // Cycling active index every 3.2 seconds
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // If a platform is actually detected in current tab, anchor on that platform
    if (currentMeeting?.platform) {
      const idx = PLATFORMS.findIndex(
        (p) => p.name.toLowerCase().includes(currentMeeting.platform.toLowerCase()) ||
               currentMeeting.platform.toLowerCase().includes(p.id.toLowerCase())
      );
      if (idx !== -1) {
        setActiveIndex(idx);
        return;
      }
    }

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PLATFORMS.length);
    }, 3200);

    return () => clearInterval(timer);
  }, [currentMeeting?.platform]);

  return (
    <div className="w-full select-none">
      {/* Mini Tagline */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#0071E3] dark:bg-[#0A84FF] animate-pulse" />
          <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-[#86868B] dark:text-[#A1A1A6]">
            Supported Platforms
          </span>
        </div>
        <span className="text-[10px] sm:text-xs text-[#0071E3] dark:text-[#0A84FF] font-medium">
          Auto-Detection Active
        </span>
      </div>

      {/* Sequential Animated Platform Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {PLATFORMS.map((platform, index) => {
          const isHighlighted = activeIndex === index;
          const isDetected =
            currentMeeting?.platform &&
            (platform.name.toLowerCase().includes(currentMeeting.platform.toLowerCase()) ||
              currentMeeting.platform.toLowerCase().includes(platform.id.toLowerCase()));

          // Staggered entrance animation delay: 0.1s, 0.28s, 0.46s
          const animationDelay = `${index * 0.18}s`;

          return (
            <div
              key={platform.id}
              onClick={() => setActiveIndex(index)}
              style={{ animationDelay }}
              className={`relative p-3 sm:p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden animate-in fade-in slide-in-from-bottom-3 fill-mode-both ${
                isHighlighted
                  ? "bg-white dark:bg-[#1C1C1E] border-black/15 dark:border-white/20 shadow-[0_6px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_6px_24px_rgba(0,0,0,0.45)] sm:scale-[1.02]"
                  : "bg-black/[0.02] dark:bg-white/[0.03] border-black/[0.04] dark:border-white/[0.06] hover:bg-white/60 dark:hover:bg-white/[0.06] opacity-80 hover:opacity-100"
              }`}
            >
              {/* Subtle top brand tint gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${platform.bgTint} pointer-events-none transition-opacity duration-300 ${
                  isHighlighted ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Header Icon + Radar Indicator */}
              <div className="relative flex items-center justify-between mb-2">
                <div className="flex-shrink-0 transition-transform duration-300 transform group-hover:scale-110">
                  {platform.renderLogo()}
                </div>

                {isDetected && status === "active" ? (
                  <span className="flex items-center gap-1 text-[9px] font-bold text-[#FF3B30] bg-[#FF3B30]/10 px-2 py-0.5 rounded-full border border-[#FF3B30]/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-ping" />
                    LIVE
                  </span>
                ) : isHighlighted ? (
                  <span className="relative flex h-2.5 w-2.5">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ backgroundColor: platform.accentColor }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-2.5 w-2.5"
                      style={{ backgroundColor: platform.accentColor }}
                    />
                  </span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-black/15 dark:bg-white/20" />
                )}
              </div>

              {/* Title & Badge */}
              <div className="relative z-10 min-w-0">
                <h4 className="text-xs sm:text-sm font-semibold text-[#1D1D1F] dark:text-[#F5F5F7] tracking-tight truncate">
                  {platform.name}
                </h4>
                <p className="text-[10px] sm:text-xs text-[#86868B] dark:text-[#A1A1A6] truncate mt-0.5">
                  {platform.domain}
                </p>
              </div>

              {/* Bottom active pill */}
              <div className="relative z-10 mt-3 pt-2 border-t border-black/[0.04] dark:border-white/[0.06] flex items-center justify-between">
                <span
                  className="text-[10px] font-medium tracking-tight truncate"
                  style={{ color: isHighlighted ? platform.accentColor : undefined }}
                >
                  {platform.badge}
                </span>
                {isHighlighted && (
                  <FiCheck
                    className="w-3 h-3 flex-shrink-0 ml-1"
                    style={{ color: platform.accentColor }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlatformAnimationHero;

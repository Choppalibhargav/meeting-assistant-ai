import React from "react";
import { FiSun, FiMoon, FiRefreshCw, FiZap } from "react-icons/fi";
import { useMeetingStore } from "../../../features/meeting/store/meetingStore";

export const Header: React.FC = () => {
  const backendOnline = useMeetingStore((state) => state.backendOnline);
  const checkBackendStatus = useMeetingStore((state) => state.checkBackendStatus);
  const theme = useMeetingStore((state) => state.theme);
  const toggleTheme = useMeetingStore((state) => state.toggleTheme);

  return (
    <header className="px-4 py-3 bg-white/80 dark:bg-[#1C1C1E]/85 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between transition-colors">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-[10px] bg-gradient-to-b from-[#0071E3] to-[#0055B3] text-white shadow-[0_2px_6px_rgba(0,113,227,0.35)] flex items-center justify-center">
          <FiZap className="w-4 h-4 fill-white/20 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-xs font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
              Meeting Intelligence
            </h1>
            <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-full bg-black/[0.05] dark:bg-white/[0.1] text-[#86868B] dark:text-[#A1A1A6]">
              v1.0
            </span>
          </div>
          <p className="text-[10px] text-[#86868B] dark:text-[#A1A1A6] font-normal leading-tight">
            Capture • Outcomes • Sync
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* API Status Pill */}
        <button
          onClick={() => checkBackendStatus()}
          title="FastAPI & SQLite Backend Status (http://localhost:8000)"
          className="flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-full bg-black/[0.04] hover:bg-black/[0.07] dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-[#1D1D1F] dark:text-[#F5F5F7] transition-all cursor-pointer active:scale-95"
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              backendOnline
                ? "bg-[#34C759] dark:bg-[#30D158] shadow-[0_0_6px_rgba(52,199,89,0.5)]"
                : "bg-[#86868B]"
            }`}
          />
          <span className="text-[10px]">{backendOnline ? "API Ready" : "API Offline"}</span>
          <FiRefreshCw className="w-2.5 h-2.5 opacity-50 hover:opacity-100 ml-0.5" />
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="w-7 h-7 rounded-full flex items-center justify-center bg-black/[0.04] hover:bg-black/[0.07] dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-[#1D1D1F] dark:text-[#F5F5F7] transition-all cursor-pointer active:scale-90"
        >
          {theme === "dark" ? (
            <FiSun className="w-3.5 h-3.5 text-[#FFD60A]" />
          ) : (
            <FiMoon className="w-3.5 h-3.5 text-[#1D1D1F]" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;

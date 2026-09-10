export default function Header() {
import React from "react";
import { FiCpu, FiServer, FiRefreshCw } from "react-icons/fi";
import { useMeetingStore } from "../../../features/meeting/store/meetingStore";

export const Header: React.FC = () => {
  const backendOnline = useMeetingStore((state) => state.backendOnline);
  const checkBackendStatus = useMeetingStore((state) => state.checkBackendStatus);

  return (
    <header className="border-b p-4">
      <h1 className="text-lg font-bold">
        🤖 Meeting Assistant
      </h1>
    <header className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
          <FiCpu className="w-4 h-4" />
        </div>
        <div>
          <h1 className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
            Meeting Intelligence
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              v1.0
            </span>
          </h1>
          <p className="text-[11px] text-slate-400">Capture • Track • Automate</p>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        AI Meeting Companion
      </p>
      <button
        onClick={() => checkBackendStatus()}
        title="Check FastAPI Backend Connection (http://localhost:8000)"
        className={`flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-md transition-colors border ${
          backendOnline
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
            : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-300"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            backendOnline ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
          }`}
        />
        <FiServer className="w-3 h-3" />
        <span>{backendOnline ? "API Online" : "API Offline"}</span>
        <FiRefreshCw className="w-2.5 h-2.5 opacity-60 ml-0.5 hover:opacity-100" />
      </button>
    </header>
  );
}
};

export default Header;
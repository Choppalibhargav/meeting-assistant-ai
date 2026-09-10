import React from "react";
import { FiPlay, FiSquare, FiRotateCcw, FiUploadCloud, FiCheck, FiZap } from "react-icons/fi";
import { useMeetingStore } from "../../../features/meeting/store/meetingStore";
import AppleButton from "./AppleButton";

export const ActionButtons: React.FC = () => {
  const status = useMeetingStore((state) => state.status);
  const currentMeeting = useMeetingStore((state) => state.currentMeeting);
  const startMeeting = useMeetingStore((state) => state.startMeeting);
  const endMeeting = useMeetingStore((state) => state.endMeeting);
  const resetMeeting = useMeetingStore((state) => state.resetMeeting);
  const syncMeeting = useMeetingStore((state) => state.syncMeeting);
  const backendOnline = useMeetingStore((state) => state.backendOnline);
  const setSelectedMeeting = useMeetingStore((state) => state.setSelectedMeeting);

  if (status === "active") {
    return (
      <div className="space-y-2">
        <AppleButton
          variant="destructive"
          size="lg"
          className="w-full"
          icon={<FiSquare className="w-4 h-4 fill-current" />}
          onClick={() => endMeeting()}
        >
          End Meeting & Extract Outcomes
        </AppleButton>
      </div>
    );
  }

  if (status === "ended") {
    return (
      <div className="space-y-2.5">
        {/* Prominent View Outcomes Button */}
        <AppleButton
          variant="primary"
          size="lg"
          className="w-full shadow-md shadow-[#0071E3]/25"
          icon={<FiZap className="w-4 h-4 fill-current" />}
          onClick={() => currentMeeting && setSelectedMeeting(currentMeeting)}
        >
          View AI Summary & Outcomes
        </AppleButton>

        <div className="flex items-center gap-2">
          {currentMeeting?.syncStatus !== "synced" ? (
            <AppleButton
              variant="secondary"
              size="md"
              className="flex-1"
              disabled={!backendOnline}
              icon={<FiUploadCloud className="w-3.5 h-3.5" />}
              onClick={() => currentMeeting && syncMeeting(currentMeeting.id)}
            >
              {backendOnline ? "Sync SQLite" : "API Offline"}
            </AppleButton>
          ) : (
            <div className="flex-1 h-9 px-4 rounded-full bg-[#34C759]/10 text-[#248A3D] dark:text-[#30D158] text-xs font-medium flex items-center justify-center gap-1.5 border border-[#34C759]/20">
              <FiCheck className="w-3.5 h-3.5 text-[#34C759] dark:text-[#30D158]" />
              <span>Saved in SQLite</span>
            </div>
          )}

          <AppleButton
            variant="secondary"
            size="md"
            className="flex-1"
            icon={<FiRotateCcw className="w-3.5 h-3.5" />}
            onClick={() => resetMeeting()}
          >
            New Session
          </AppleButton>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AppleButton
        variant="apple-dark"
        size="lg"
        className="w-full shadow-sm"
        icon={<FiPlay className="w-4 h-4 fill-current" />}
        onClick={() => startMeeting()}
      >
        Start Meeting Capture
      </AppleButton>
    </div>
  );
};

export default ActionButtons;

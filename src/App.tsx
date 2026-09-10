import React, { useEffect } from "react";
import Header from "./shared/components/layout/Header";
import StatusCard from "./features/meeting/components/StatusCard";
import MeetingInfo from "./features/meeting/components/MeetingInfo";
import Timer from "./features/meeting/components/Timer";
import ActionButtons from "./shared/components/ui/ActionButtons";
import RecentMeetings from "./features/meeting/components/RecentMeetings";
import MeetingOutcomeView from "./features/meeting/components/MeetingOutcomeView";
import TranscriptModal from "./features/meeting/components/TranscriptModal";
import { useMeetingStore } from "./features/meeting/store/meetingStore";

export const App: React.FC = () => {
  const init = useMeetingStore((state) => state.init);
  const isLoading = useMeetingStore((state) => state.isLoading);
  const activeView = useMeetingStore((state) => state.activeView);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="w-[380px] min-h-[500px] max-h-[580px] bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-hidden">
      <Header />

      <main className="flex-1 flex flex-col overflow-y-auto">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 text-slate-500">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2" />
            <span className="text-xs">Detecting active session...</span>
          </div>
        ) : activeView === "outcomes" ? (
          <MeetingOutcomeView />
        ) : activeView === "transcript" ? (
          <TranscriptModal />
        ) : (
          <div className="p-3.5 flex flex-col space-y-3">
            <StatusCard />
            <MeetingInfo />
            <Timer />
            <ActionButtons />
            <RecentMeetings />
          </div>
        )}
      </main>

      <footer className="px-3.5 py-1.5 border-t border-slate-900 bg-slate-950 text-center">
        <span className="text-[10px] text-slate-500 font-mono">
          Phase 2-4: Transcript & Outcomes Intelligence
        </span>
      </footer>
    </div>
  );
};

export default App;

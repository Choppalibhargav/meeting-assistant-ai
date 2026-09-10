import React, { useEffect } from "react";
import Header from "./shared/components/layout/Header";
import StatusCard from "./features/meeting/components/StatusCard";
import MeetingInfo from "./features/meeting/components/MeetingInfo";
import Timer from "./features/meeting/components/Timer";
import ActionButtons from "./shared/components/ui/ActionButtons";
import RecentMeetings from "./features/meeting/components/RecentMeetings";
import MeetingOutcomeView from "./features/meeting/components/MeetingOutcomeView";
import TranscriptModal from "./features/meeting/components/TranscriptModal";
import PlatformAnimationHero from "./features/meeting/components/PlatformAnimationHero";
import ToastProvider from "./shared/components/ui/Toast";
import { useMeetingStore } from "./features/meeting/store/meetingStore";

const AppContent: React.FC = () => {
  const init = useMeetingStore((state) => state.init);
  const isLoading = useMeetingStore((state) => state.isLoading);
  const activeView = useMeetingStore((state) => state.activeView);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="min-h-screen w-full bg-[#F5F5F7] dark:bg-[#000000] text-[#1D1D1F] dark:text-[#F5F5F7] flex flex-col font-sans select-none transition-colors duration-200 antialiased">
      {/* Apple macOS Style Header */}
      <Header />

      {/* Main Responsive Content Area - Full Page on Desktop, Compact on Popup */}
      <main className="w-full max-w-5xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6 flex-1 flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-28 text-[#86868B] dark:text-[#A1A1A6]">
            <div className="w-8 h-8 border-2 border-[#0071E3] border-t-transparent rounded-full animate-spin mb-3" />
            <span className="text-xs sm:text-sm font-medium">Detecting active meeting session...</span>
          </div>
        ) : activeView === "outcomes" ? (
          <MeetingOutcomeView />
        ) : activeView === "transcript" ? (
          <TranscriptModal />
        ) : (
          <div className="space-y-4">
            {/* Animated Platform Showcase: Google Meet, Microsoft Teams, Zoom */}
            <PlatformAnimationHero />

            {/* Responsive Desktop Grid (Side-by-Side on wide screens, stacked on popup) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
              {/* Left Column: Active Session, Timer & Controls */}
              <div className="lg:col-span-7 space-y-3 sm:space-y-4">
                <StatusCard />
                <Timer />
                <ActionButtons />
                <MeetingInfo />
              </div>

              {/* Right Column: Meeting History & Outcomes */}
              <div className="lg:col-span-5 space-y-3 sm:space-y-4">
                <RecentMeetings />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Subtle Apple Footer */}
      <footer className="px-4 py-3 border-t border-black/[0.05] dark:border-white/[0.06] bg-white/40 dark:bg-[#1C1C1E]/40 backdrop-blur-md text-center mt-auto">
        <div className="flex items-center justify-center gap-2 text-[11px] text-[#86868B] dark:text-[#A1A1A6]">
          <span className="font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
            AI Meeting Intelligence
          </span>
          <span>•</span>
          <span>Google Meet, Microsoft Teams & Zoom</span>
          <span>•</span>
          <span className="text-[#34C759] dark:text-[#30D158] font-medium">Local & Private</span>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;

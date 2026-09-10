import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import React, { useEffect } from "react";
import Header from "./shared/components/layout/Header";
import StatusCard from "./features/meeting/components/StatusCard";
import MeetingInfo from "./features/meeting/components/MeetingInfo";
import Timer from "./features/meeting/components/Timer";
import ActionButtons from "./shared/components/ui/ActionButtons";
import RecentMeetings from "./features/meeting/components/RecentMeetings";
import { useMeetingStore } from "./features/meeting/store/meetingStore";

function App() {
  const [count, setCount] = useState(0)
export const App: React.FC = () => {
  const init = useMeetingStore((state) => state.init);
  const isLoading = useMeetingStore((state) => state.isLoading);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>
    <div className="w-[380px] min-h-[480px] bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      <Header />

      <div className="ticks"></div>
      <main className="p-3.5 flex-1 flex flex-col space-y-3">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 text-slate-500">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2" />
            <span className="text-xs">Detecting active session...</span>
          </div>
        ) : (
          <>
            <StatusCard />
            <MeetingInfo />
            <Timer />
            <ActionButtons />
            <RecentMeetings />
          </>
        )}
      </main>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>
      <footer className="px-3.5 py-2 border-t border-slate-900 bg-slate-950 text-center">
        <span className="text-[10px] text-slate-500 font-mono">
          Phase 1: Extension Core • Zero Paid APIs
        </span>
      </footer>
    </div>
  );
};

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
export default App;

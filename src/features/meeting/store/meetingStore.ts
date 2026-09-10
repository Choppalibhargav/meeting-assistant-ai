import { create } from 'zustand'
import { create } from "zustand";
import type { Meeting, MeetingStatus } from "../types/meeting";
import { detectPlatformFromUrl, isSupportedMeetingUrl } from "../../../shared/constants/routes";
import { meetingApi } from "../services/meetingApi";

export type MeetingStatus = 'not-started' | 'in-progress' | 'paused' | 'completed'
export interface MeetingState {
  currentMeeting: Meeting | null;
  status: MeetingStatus;
  elapsedSeconds: number;
  backendOnline: boolean;
  recentMeetings: Meeting[];
  isLoading: boolean;

export interface MeetingState {
  title: string
  durationMinutes: number
  status: MeetingStatus
  setTitle: (title: string) => void
  setDuration: (minutes: number) => void
  setStatus: (status: MeetingStatus) => void
  // Actions
  init: () => Promise<void>;
  detectTab: () => Promise<void>;
  setTitle: (title: string) => void;
  startMeeting: () => Promise<void>;
  endMeeting: () => Promise<void>;
  resetMeeting: () => Promise<void>;
  tick: () => void;
  syncMeeting: (meetingId: string) => Promise<void>;
  checkBackendStatus: () => Promise<void>;
}

export const useMeetingStore = create<MeetingState>((set) => ({
  title: 'Daily Standup',
  durationMinutes: 30,
  status: 'not-started',
  setTitle: (title) => set({ title }),
  setDuration: (durationMinutes) => set({ durationMinutes }),
  setStatus: (status) => set({ status }),
}))
const STORAGE_KEY_ACTIVE = "meeting_assistant_active";
const STORAGE_KEY_HISTORY = "meeting_assistant_history";

// Helper for chrome.storage with fallback to localStorage
async function getStorageItem<T>(key: string): Promise<T | null> {
  if (typeof chrome !== "undefined" && chrome.storage?.local) {
    const result = await chrome.storage.local.get(key);
    return result[key] || null;
  }
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

async function setStorageItem<T>(key: string, value: T | null): Promise<void> {
  if (typeof chrome !== "undefined" && chrome.storage?.local) {
    if (value === null) {
      await chrome.storage.local.remove(key);
    } else {
      await chrome.storage.local.set({ [key]: value });
    }
    return;
  }
  try {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // Ignore storage quota errors in non-browser environments
  }
}

export const useMeetingStore = create<MeetingState>((set, get) => ({
  currentMeeting: null,
  status: "idle",
  elapsedSeconds: 0,
  backendOnline: false,
  recentMeetings: [],
  isLoading: true,

  checkBackendStatus: async () => {
    const isOnline = await meetingApi.checkHealth();
    set({ backendOnline: isOnline });
  },

  detectTab: async () => {
    if (typeof chrome !== "undefined" && chrome.tabs?.query) {
      try {
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (activeTab?.url) {
          const url = activeTab.url;
          const platform = detectPlatformFromUrl(url);
          const isMeeting = isSupportedMeetingUrl(url);

          // Only override if not already in an active meeting
          const { status, currentMeeting } = get();
          if (status !== "active" && status !== "ended") {
            const rawTitle = activeTab.title || "";
            const cleanTitle = rawTitle.replace(/\s*-\s*Google Meet.*$/, "").trim() || `${platform} Session`;

            const meetingData: Meeting = {
              id: currentMeeting?.id || (typeof crypto !== "undefined" ? crypto.randomUUID() : String(Date.now())),
              title: cleanTitle,
              url: url,
              platform: platform,
              status: isMeeting ? "detected" : "idle",
              startTime: null,
              endTime: null,
              duration: 0,
              createdAt: new Date().toISOString(),
              syncStatus: "pending",
            };

            set({
              currentMeeting: meetingData,
              status: isMeeting ? "detected" : "idle",
            });
          }
          return;
        }
      } catch (err) {
        console.warn("Could not query active tab:", err);
      }
    }

    // Default mock when not running inside Chrome tab context
    const { status, currentMeeting } = get();
    if (status !== "active" && status !== "ended" && !currentMeeting) {
      set({
        currentMeeting: {
          id: typeof crypto !== "undefined" ? crypto.randomUUID() : String(Date.now()),
          title: "Ad-hoc Meeting",
          url: "https://meet.google.com/abc-defg-hij",
          platform: "Google Meet",
          status: "detected",
          startTime: null,
          endTime: null,
          duration: 0,
          createdAt: new Date().toISOString(),
          syncStatus: "pending",
        },
        status: "detected",
      });
    }
  },

  init: async () => {
    set({ isLoading: true });

    // 1. Check backend status
    await get().checkBackendStatus();

    // 2. Load meeting history
    const history = (await getStorageItem<Meeting[]>(STORAGE_KEY_HISTORY)) || [];
    set({ recentMeetings: history });

    // 3. Check for an active running meeting in storage
    const savedActive = await getStorageItem<Meeting>(STORAGE_KEY_ACTIVE);
    if (savedActive && savedActive.status === "active" && savedActive.startTime) {
      const elapsed = Math.max(0, Math.floor((Date.now() - savedActive.startTime) / 1000));
      set({
        currentMeeting: savedActive,
        status: "active",
        elapsedSeconds: elapsed,
        isLoading: false,
      });
      return;
    }

    // 4. Otherwise detect current tab
    await get().detectTab();
    set({ isLoading: false });
  },

  setTitle: (title: string) => {
    const { currentMeeting } = get();
    if (!currentMeeting) return;
    const updated = { ...currentMeeting, title };
    set({ currentMeeting: updated });
    if (get().status === "active") {
      setStorageItem(STORAGE_KEY_ACTIVE, updated);
    }
  },

  startMeeting: async () => {
    const { currentMeeting } = get();
    const now = Date.now();
    const newMeeting: Meeting = {
      id: currentMeeting?.id || (typeof crypto !== "undefined" ? crypto.randomUUID() : String(now)),
      title: currentMeeting?.title || "Meeting Session",
      url: currentMeeting?.url || "https://meet.google.com",
      platform: currentMeeting?.platform || "Google Meet",
      status: "active",
      startTime: now,
      endTime: null,
      duration: 0,
      createdAt: new Date(now).toISOString(),
      syncStatus: "pending",
    };

    set({
      currentMeeting: newMeeting,
      status: "active",
      elapsedSeconds: 0,
    });

    await setStorageItem(STORAGE_KEY_ACTIVE, newMeeting);
  },

  tick: () => {
    const { status, currentMeeting } = get();
    if (status === "active" && currentMeeting?.startTime) {
      const elapsed = Math.max(0, Math.floor((Date.now() - currentMeeting.startTime) / 1000));
      set({ elapsedSeconds: elapsed });
    }
  },

  endMeeting: async () => {
    const { currentMeeting, elapsedSeconds, backendOnline } = get();
    if (!currentMeeting) return;

    const endTime = Date.now();
    const finalDuration = elapsedSeconds || (currentMeeting.startTime ? Math.floor((endTime - currentMeeting.startTime) / 1000) : 0);

    const finishedMeeting: Meeting = {
      ...currentMeeting,
      status: "ended",
      endTime,
      duration: finalDuration,
      syncStatus: backendOnline ? "pending" : "offline",
    };

    // Attempt backend sync
    let syncSuccess = false;
    if (backendOnline) {
      syncSuccess = await meetingApi.saveMeeting(finishedMeeting);
    }
    finishedMeeting.syncStatus = syncSuccess ? "synced" : backendOnline ? "failed" : "offline";

    // Save to history (keep top 20 recent)
    const currentHistory = get().recentMeetings;
    const updatedHistory = [finishedMeeting, ...currentHistory.filter((m) => m.id !== finishedMeeting.id)].slice(0, 20);

    await setStorageItem(STORAGE_KEY_HISTORY, updatedHistory);
    await setStorageItem(STORAGE_KEY_ACTIVE, null);

    set({
      currentMeeting: finishedMeeting,
      status: "ended",
      recentMeetings: updatedHistory,
    });
  },

  resetMeeting: async () => {
    await setStorageItem(STORAGE_KEY_ACTIVE, null);
    set({
      currentMeeting: null,
      status: "idle",
      elapsedSeconds: 0,
    });
    await get().detectTab();
  },

  syncMeeting: async (meetingId: string) => {
    const { recentMeetings, currentMeeting } = get();
    const target = recentMeetings.find((m) => m.id === meetingId) || (currentMeeting?.id === meetingId ? currentMeeting : null);
    if (!target) return;

    const success = await meetingApi.saveMeeting(target);
    const updatedStatus = success ? "synced" : "failed";

    const updatedHistory = recentMeetings.map((m) => (m.id === meetingId ? { ...m, syncStatus: updatedStatus as any } : m));

    await setStorageItem(STORAGE_KEY_HISTORY, updatedHistory);

    set({
      recentMeetings: updatedHistory,
      currentMeeting: currentMeeting?.id === meetingId ? { ...currentMeeting, syncStatus: updatedStatus as any } : currentMeeting,
    });
  },
}));

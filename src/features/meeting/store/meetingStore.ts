import { create } from 'zustand'

export type MeetingStatus = 'not-started' | 'in-progress' | 'paused' | 'completed'

export interface MeetingState {
  title: string
  durationMinutes: number
  status: MeetingStatus
  setTitle: (title: string) => void
  setDuration: (minutes: number) => void
  setStatus: (status: MeetingStatus) => void
}

export const useMeetingStore = create<MeetingState>((set) => ({
  title: 'Daily Standup',
  durationMinutes: 30,
  status: 'not-started',
  setTitle: (title) => set({ title }),
  setDuration: (durationMinutes) => set({ durationMinutes }),
  setStatus: (status) => set({ status }),
}))

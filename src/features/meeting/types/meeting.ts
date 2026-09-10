export type MeetingPlatform =
  | "Google Meet"
  | "Microsoft Teams"
  | "Zoom"
  | "Custom";

export type MeetingStatus =
  | "idle"
  | "detected"
  | "active"
  | "ended";

export type BackendSyncStatus =
  | "synced"
  | "pending"
  | "failed"
  | "offline";

export interface Meeting {
  id: string;
  title: string;
  url: string;
  platform: MeetingPlatform;
  status: MeetingStatus;
  startTime: number | null;
  endTime: number | null;
  duration: number;
  duration: number; // in seconds
  createdAt: string;
  syncStatus: BackendSyncStatus;
}
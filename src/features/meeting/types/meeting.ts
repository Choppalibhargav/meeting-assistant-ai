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

export type PriorityLevel = "High" | "Medium" | "Low";

export interface ActionItem {
  id: string;
  task: string;
  owner: string;
  deadline: string;
  priority: PriorityLevel;
  status: "Pending" | "Completed";
}

export interface MeetingOutcome {
  executiveSummary: string;
  detailedDiscussion: string[];
  decisions: string[];
  actionItems: ActionItem[];
  risks: string[];
  openQuestions: string[];
  parkingLot: string[];
  processedAt: string;
  modelUsed: string;
}

export interface Meeting {
  id: string;
  title: string;
  url: string;
  platform: MeetingPlatform;
  status: MeetingStatus;
  startTime: number | null;
  endTime: number | null;
  duration: number; // in seconds
  createdAt: string;
  syncStatus: BackendSyncStatus;
  transcript?: string;
  outcome?: MeetingOutcome;
}

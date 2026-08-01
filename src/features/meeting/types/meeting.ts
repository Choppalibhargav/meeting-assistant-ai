export type MeetingStatus =
  | "idle"
  | "detected"
  | "active"
  | "ended";

export interface Meeting {
  id: string;
  title: string;
  url: string;
  status: MeetingStatus;
  startTime: number | null;
  endTime: number | null;
  duration: number;
}
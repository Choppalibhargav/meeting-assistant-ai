export interface MeetingData {
  title: string;
  url: string;
  status: "idle" | "active";
  duration: number;
}
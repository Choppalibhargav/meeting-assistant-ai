import type { Meeting } from "../types/meeting";

const API_BASE_URL = "http://localhost:8000/api";

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
}

export const meetingApi = {
  async checkHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${API_BASE_URL}/health`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return res.ok;
    } catch {
      return false;
    }
  },

  async saveMeeting(meeting: Meeting): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`${API_BASE_URL}/meetings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: meeting.id,
          title: meeting.title,
          url: meeting.url,
          platform: meeting.platform,
          start_time: meeting.startTime ? new Date(meeting.startTime).toISOString() : null,
          end_time: meeting.endTime ? new Date(meeting.endTime).toISOString() : null,
          duration: meeting.duration,
          status: meeting.status,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return res.ok;
    } catch (err) {
      console.warn("Failed to sync meeting to backend:", err);
      return false;
    }
  },

  async fetchMeetings(): Promise<Meeting[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${API_BASE_URL}/meetings`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) return [];
      const data = await res.json();
      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        url: item.url,
        platform: item.platform,
        status: item.status,
        startTime: item.start_time ? new Date(item.start_time).getTime() : null,
        endTime: item.end_time ? new Date(item.end_time).getTime() : null,
        duration: item.duration || 0,
        createdAt: item.created_at || new Date().toISOString(),
        syncStatus: "synced" as const,
      }));
    } catch {
      return [];
    }
  },
};


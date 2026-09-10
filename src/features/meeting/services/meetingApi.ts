import type { Meeting, MeetingOutcome } from "../types/meeting";

const API_BASE_URL = "http://localhost:8000/api";

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  ollama_online?: boolean;
}

export const meetingApi = {
  async checkHealth(): Promise<{ online: boolean; ollamaOnline: boolean }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${API_BASE_URL}/health`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) return { online: false, ollamaOnline: false };
      const data: HealthResponse = await res.json();
      return { online: true, ollamaOnline: Boolean(data.ollama_online) };
    } catch {
      return { online: false, ollamaOnline: false };
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
          transcript: meeting.transcript || null,
          outcome: meeting.outcome || null,
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

  async uploadTranscript(meetingId: string, transcript: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/meetings/${meetingId}/transcript`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      return res.ok;
    } catch (err) {
      console.warn("Failed to upload transcript:", err);
      return false;
    }
  },

  async processMeetingAI(meetingId: string, transcript?: string): Promise<MeetingOutcome | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/meetings/${meetingId}/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      if (!res.ok) return null;
      return (await res.json()) as MeetingOutcome;
    } catch (err) {
      console.warn("Failed to process meeting intelligence:", err);
      return null;
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
        transcript: item.transcript || undefined,
        outcome: item.outcome || undefined,
      }));
    } catch {
      return [];
    }
  },
};

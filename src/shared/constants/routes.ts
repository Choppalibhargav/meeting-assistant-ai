export const SUPPORTED_MEETING_HOSTS = [
  "meet.google.com",
  "teams.microsoft.com",
  "zoom.us",
] as const;

export type SupportedHost = (typeof SUPPORTED_MEETING_HOSTS)[number];

export function detectPlatformFromUrl(url?: string): "Google Meet" | "Microsoft Teams" | "Zoom" | "Custom" {
  if (!url) return "Custom";
  if (url.includes("meet.google.com")) return "Google Meet";
  if (url.includes("teams.microsoft.com")) return "Microsoft Teams";
  if (url.includes("zoom.us")) return "Zoom";
  return "Custom";
}

export function isSupportedMeetingUrl(url?: string): boolean {
  if (!url) return false;
  return SUPPORTED_MEETING_HOSTS.some((host) => url.includes(host));
}

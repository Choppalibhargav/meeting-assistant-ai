console.log("Content Script loaded");
// AI Meeting Assistant - Content Script
// Injected into Google Meet, Microsoft Teams, and Zoom

console.log("[Meeting Assistant] Meeting content script active on:", window.location.hostname);

// Detect page title or meet code
function getMeetingDetails() {
  const host = window.location.hostname;
  const title = document.title;

  if (host.includes("meet.google.com")) {
    const codeMatch = window.location.pathname.match(/\/([a-z]{3}-[a-z]{4}-[a-z]{3})/);
    const code = codeMatch ? codeMatch[1] : "";
    return {
      platform: "Google Meet",
      code,
      title: title || `Google Meet (${code})`,
    };
  }

  if (host.includes("teams.microsoft.com")) {
    return {
      platform: "Microsoft Teams",
      title: title || "Teams Meeting",
    };
  }

  if (host.includes("zoom.us")) {
    return {
      platform: "Zoom",
      title: title || "Zoom Meeting",
    };
  }

  return {
    platform: "Custom",
    title,
  };
}

// Respond to title queries from popup if requested
chrome.runtime.onMessage.addListener(
  (
    message: { type?: string },
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void
  ) => {
    if (message?.type === "GET_MEETING_INFO") {
      sendResponse(getMeetingDetails());
      return true;
    }
    return false;
  }
);
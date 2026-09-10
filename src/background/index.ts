console.log("Background Service Worker Started");
// AI Meeting Assistant - Background Service Worker (Manifest V3)

console.log("[Meeting Assistant] Service Worker initialized");

chrome.runtime.onInstalled.addListener(async (details: chrome.runtime.InstalledDetails) => {
  console.log("[Meeting Assistant] Installed/Updated:", details.reason);
  // Initialize storage defaults if not present
  const storage = await chrome.storage.local.get(["meeting_assistant_history"]);
  if (!storage.meeting_assistant_history) {
    await chrome.storage.local.set({ meeting_assistant_history: [] });
  }
});

// Listen for tab URL updates to assist with meeting state
chrome.tabs.onUpdated.addListener(async (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const isMeeting =
      tab.url.includes("meet.google.com") ||
      tab.url.includes("teams.microsoft.com") ||
      tab.url.includes("zoom.us");

    if (isMeeting) {
      console.log(`[Meeting Assistant] Meeting URL detected on tab ${tabId}: ${tab.url}`);
    }
  }
});

// Handle incoming messages from popup or content scripts
chrome.runtime.onMessage.addListener(
  (
    message: { type?: string },
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void
  ) => {
    if (message?.type === "PING") {
      sendResponse({ status: "PONG" });
      return true;
    }
    return false;
  }
);
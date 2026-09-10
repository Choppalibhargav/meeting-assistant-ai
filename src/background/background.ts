// AI Meeting Assistant - Background Service Worker (Manifest V3)

console.log("[Meeting Assistant] Service Worker initialized");

chrome.runtime.onInstalled.addListener(async (details) => {
  console.log("[Meeting Assistant] Installed/Updated:", details.reason);
  const storage = await chrome.storage.local.get(["meeting_assistant_history"]);
  if (!storage.meeting_assistant_history) {
    await chrome.storage.local.set({ meeting_assistant_history: [] });
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
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

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "PING") {
    sendResponse({ status: "PONG" });
    return true;
  }
  return false;
});

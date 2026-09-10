// AI Meeting Assistant - Content Script
// Injected into Google Meet, Microsoft Teams, and Zoom

console.log("[Meeting Assistant] Content script active on:", window.location.hostname);

let liveTranscriptBuffer: Array<{ speaker: string; text: string; time: string }> = [];

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

// Live caption observer for Google Meet
function initMeetCaptionObserver() {
  if (!window.location.hostname.includes("meet.google.com")) return;

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            // Google Meet caption element queries
            const captionBlock = node.closest('[jsname="tgaKEf"]') || node.closest('.a4bMb') || (node.classList.contains('a4bMb') ? node : null);
            if (captionBlock) {
              const speakerEl = captionBlock.querySelector('.NWadbe') || captionBlock.querySelector('.zs75Bm') || captionBlock.parentElement?.querySelector('.NWadbe');
              const textEl = captionBlock.querySelector('.ygicle') || captionBlock;

              const speaker = speakerEl?.textContent?.trim() || "Speaker";
              const text = textEl?.textContent?.trim() || "";

              if (text && text.length > 1) {
                const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                // Avoid rapid duplicates
                const last = liveTranscriptBuffer[liveTranscriptBuffer.length - 1];
                if (!last || last.text !== text) {
                  liveTranscriptBuffer.push({ speaker, text, time: nowTime });
                  // Store in chrome storage
                  if (typeof chrome !== "undefined" && chrome.storage?.local) {
                    const formatted = liveTranscriptBuffer.map(item => `[${item.time}] ${item.speaker}: ${item.text}`).join("\n");
                    chrome.storage.local.set({ live_meeting_transcript: formatted });
                  }
                }
              }
            }
          }
        });
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  console.log("[Meeting Assistant] Google Meet live caption observer attached.");
}

// Initialize observer if on Meet
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMeetCaptionObserver);
} else {
  initMeetCaptionObserver();
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "GET_MEETING_INFO") {
    sendResponse(getMeetingDetails());
    return true;
  }

  if (message?.type === "GET_LIVE_TRANSCRIPT") {
    const formatted = liveTranscriptBuffer.map(item => `[${item.time}] ${item.speaker}: ${item.text}`).join("\n");
    sendResponse({ transcript: formatted, entries: liveTranscriptBuffer });
    return true;
  }

  if (message?.type === "CLEAR_LIVE_TRANSCRIPT") {
    liveTranscriptBuffer = [];
    if (typeof chrome !== "undefined" && chrome.storage?.local) {
      chrome.storage.local.remove("live_meeting_transcript");
    }
    sendResponse({ success: true });
    return true;
  }

  return false;
});

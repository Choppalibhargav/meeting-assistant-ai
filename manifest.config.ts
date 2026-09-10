import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,

  name: "Meeting Assistant",

  version: "1.0.0",

  description: "AI Meeting Assistant - Capture, Track, and Automate",

  action: {
    default_popup: "index.html"
  },

  permissions: [
    "storage",
    "tabs",
    "activeTab"
  ],

  host_permissions: [
    "https://meet.google.com/*",
    "https://teams.microsoft.com/*",
    "https://*.zoom.us/*"
  ],

  background: {
    service_worker: "src/background/background.ts",
    type: "module"
  },

  content_scripts: [
    {
      matches: [
        "https://meet.google.com/*",
        "https://teams.microsoft.com/*",
        "https://*.zoom.us/*"
      ],
      js: [
        "src/content/content.ts"
      ]
    }
  ]
});

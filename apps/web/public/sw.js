// No-op service worker placeholder.
// Some preview browsers keep asking for /sw.js from an older session; serving
// this file avoids noisy 404s without enabling offline behavior.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => undefined);

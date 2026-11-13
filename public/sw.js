/* Sanaa service worker: fast repeat visits and an offline fallback. */
const VERSION = "sanaa-v1";
const STATIC_CACHE = `${VERSION}-static`;
const PAGE_CACHE = `${VERSION}-pages`;
const OFFLINE_URL = "/offline";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PAGE_CACHE).then((cache) => cache.addAll([OFFLINE_URL, "/icons/icon-192.png"])).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Built assets never change for a given URL: cache first.
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            if (res.ok) caches.open(STATIC_CACHE).then((c) => c.put(request, res.clone()));
            return res;
          }),
      ),
    );
    return;
  }

  // Pages: always try the network for fresh prices; fall back to cache, then the offline page.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok && !url.pathname.startsWith("/account") && !url.pathname.startsWith("/admin")) {
            caches.open(PAGE_CACHE).then((c) => c.put(request, res.clone()));
          }
          return res;
        })
        .catch(() => caches.match(request).then((hit) => hit || caches.match(OFFLINE_URL))),
    );
  }
});

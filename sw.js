const CACHE = "jessica-bookshelf-v1.4";
const COVER_CACHE = "jessica-bookshelf-covers-v1";
const PRIORITY_COVER_COUNT = 20;
const COVER_CHUNK_SIZE = 20;
const COVER_CHUNK_PAUSE = 400;
const COVER_HOSTS = new Set([
  "covers.openlibrary.org"
]);
const SHELL = [
  ".",
  "index.html",
  "css/styles.css",
  "js/covers.js",
  "js/data.js",
  "js/app.js",
  "manifest.webmanifest",
  "covers/b25.jpg",
  "covers/b26.jpg",
  "covers/worstchildren2.jpg",
  "icons/icon.svg",
  "icons/icon-maskable.svg"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  const currentCaches = new Set([CACHE, COVER_CACHE]);
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => !currentCaches.has(k)).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isCoverUrl(value) {
  try {
    return COVER_HOSTS.has(new URL(value).hostname);
  } catch {
    return false;
  }
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchCoverForCache(cache, url) {
  if (await cache.match(url)) return;

  const hostname = new URL(url).hostname;
  const mode = hostname === "play.google.com" ? "no-cors" : "cors";
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { mode, credentials: "omit" });
      const isImage = response.type === "opaque" || response.headers.get("content-type")?.startsWith("image/");
      if ((response.ok || response.type === "opaque") && isImage) {
        await cache.put(url, response);
        return;
      }
    } catch { /* retry temporary network and throttling failures */ }
    await wait(500 * (attempt + 1));
  }
}

async function cacheCovers(urls) {
  const queue = [...new Set(urls.filter(isCoverUrl))];
  const cache = await caches.open(COVER_CACHE);

  async function cacheChunk(chunk, concurrency) {
    let next = 0;
    const workers = Array.from({ length: concurrency }, async () => {
      while (next < chunk.length) {
        await fetchCoverForCache(cache, chunk[next++]);
      }
    });
    await Promise.all(workers);
  }

  await cacheChunk(queue.slice(0, PRIORITY_COVER_COUNT), 5);

  const remaining = queue.slice(PRIORITY_COVER_COUNT);
  for (let start = 0; start < remaining.length; start += COVER_CHUNK_SIZE) {
    await cacheChunk(remaining.slice(start, start + COVER_CHUNK_SIZE), 3);
    await wait(COVER_CHUNK_PAUSE);
  }
}

let coverCacheJob = null;
self.addEventListener("message", e => {
  if (e.data?.type !== "CACHE_COVERS" || !Array.isArray(e.data.urls)) return;
  if (!coverCacheJob) {
    coverCacheJob = cacheCovers(e.data.urls).finally(() => { coverCacheJob = null; });
  }
  e.waitUntil(coverCacheJob);
});

// Serve pre-cached covers without contacting their hosts again.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  if (e.request.destination === "image" && isCoverUrl(e.request.url)) {
    e.respondWith(
      caches.open(COVER_CACHE)
        .then(cache => cache.match(e.request))
        .then(hit => hit || fetch(e.request))
    );
    return;
  }

  // Cache-first for the app shell; runtime-cache fonts and other assets.
  e.respondWith(
    caches.match(e.request).then(hit => {
      if (hit) return hit;
      return fetch(e.request).then(res => {
        if (res.ok || res.type === "opaque") {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() => e.request.mode === "navigate" ? caches.match("index.html") : Response.error());
    })
  );
});

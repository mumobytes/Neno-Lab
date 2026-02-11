const CACHE_NAME = "nenolab-v1";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/words.js",
  "/css/base.css",
  "/css/theme.css",
  "/css/navbar.css",
  "/css/board.css",
  "/css/keyboard.css",
  "/css/popups.css",
  "/css/landing.css",
  "/css/settings.css",
  "/css/animations.css",
  "/js/globals.js",
  "/js/dailyWord.js",
  "/js/stats.js",
  "/js/board.js",
  "/js/gameLogic.js",
  "/js/popups.js",
  "/js/landing.js",
  "/js/input.js",
  "/js/theme.js",
  "/js/main.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

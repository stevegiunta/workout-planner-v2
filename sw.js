const CACHE_NAME = 'workout-planner-v2-cache-v3';
const urlsToCache = [
  '/workout-planner-v2/',
  '/workout-planner-v2/index.html',
  '/workout-planner-v2/styles.css',
  '/workout-planner-v2/main.js',
  '/workout-planner-v2/manifest.json',
  '/workout-planner-v2/icon-192x192.png',
  '/workout-planner-v2/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
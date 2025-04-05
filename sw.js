const CACHE_NAME = 'splitt-kalkulator-v1';
const urlsToCache = [
  '/telenorbutikken/',
  '/telenorbutikken/index.html',
  '/telenorbutikken/style.css', // Replace with your actual CSS file name
  '/telenorbutikken/script.js'  // Replace with your actual JS file name
];

// Install the service worker and cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

const CACHE_NAME = 'telenor-calculator-v1'; // Increment version (e.g., v2) on update

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/telenorbutikken/',
        '/telenorbutikken/index.html',
        '/telenorbutikken/sw.js',
        'https://www.telenor.no/telenorlogo.svg'
        // Add other assets if needed
      ]);
    })
  );
  // Force the new Service Worker to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  // Take control of clients immediately
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

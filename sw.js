self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('splitt-v1').then((cache) => {
      return cache.addAll([
        '/telenorbutikken/',
        '/telenorbutikken/index.html'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

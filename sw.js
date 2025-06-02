const CACHE_NAME = 'telenor-splitt-kalkulator-v20250602'; // Unikt navn for hver versjon
const urlsToCache = [
  '/',
  '/telenorbutikken/manifest.json',
  'https://www.telenor.no/telenorlogo.svg'
  // Legg til andre kritiske ressurser om nødvendig
];

// Installerer ny Service Worker og cacher ressurser
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()) // Tvinger ny Service Worker til å aktiveres umiddelbart
  );
});

// Aktiverer ny Service Worker og sletter gamle cacher
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // Sletter gamle cacher
          }
        })
      );
    }).then(() => self.clients.claim()) // Tar kontroll over alle faner/app-instanser
  );
});

// Håndterer fetch-forespørsler
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Returner fra cache hvis tilgjengelig, ellers hent fra nettverket
        return response || fetch(event.request).then(networkResponse => {
          // Oppdater cachen med ny respons for fremtidig bruk
          if (event.request.method === 'GET') {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          }
          return networkResponse;
        });
      })
  );
});

// Lytt etter meldinger for å tvinge oppdatering
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'UPDATE') {
    self.skipWaiting(); // Tvinger aktivering av ny Service Worker
  }
});

const CACHE_NAME = 'balkan2026-v2';
const MAP_CACHE_NAME = 'balkan2026-map-v1';
const BASE_PATH = new URL('./', self.location.href).pathname;

const APP_SHELL = [
  '',
  'index.html',
  'routekaart.html',
  'detailplanning.html',
  'balkan_route_definitief_donderdag_2026.html',
  'routekaart.css',
  'styles.css',
  'routekaart-data.js',
  'routekaart-app.js',
  'app.js',
  'pwa.js',
  'offline.html',
  'manifest.webmanifest',
  'assets/vendor/leaflet/leaflet.css',
  'assets/vendor/leaflet/leaflet.js',
  'assets/vendor/leaflet/images/layers.png',
  'assets/vendor/leaflet/images/layers-2x.png',
  'assets/vendor/leaflet/images/marker-icon.png',
  'assets/vendor/leaflet/images/marker-icon-2x.png',
  'assets/vendor/leaflet/images/marker-shadow.png',
  'assets/icons/balkan2026-icon.svg',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/apple-touch-icon.png'
];

function localUrl(path) {
  return new URL(`${BASE_PATH}${path}`, self.location.origin).toString();
}

function isMapTileRequest(url) {
  return url.hostname.endsWith('tile.openstreetmap.org');
}

function isRouteGeometryRequest(url) {
  return url.hostname === 'router.project-osrm.org';
}

function cacheFirst(request, cacheName) {
  return caches.match(request).then((cached) => {
    if (cached) return cached;

    return fetch(request).then((response) => {
      const copy = response.clone();
      caches.open(cacheName).then((cache) => cache.put(request, copy));
      return response;
    });
  });
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL.map(localUrl)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names
          .filter((name) => name.startsWith('balkan2026-') && ![CACHE_NAME, MAP_CACHE_NAME].includes(name))
          .map((name) => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isLocalAppRequest = url.origin === self.location.origin && url.pathname.startsWith(BASE_PATH);

  if (isMapTileRequest(url) || isRouteGeometryRequest(url)) {
    event.respondWith(cacheFirst(request, MAP_CACHE_NAME));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request)
          .then((cached) => cached || caches.match(localUrl('routekaart.html')) || caches.match(localUrl('offline.html'))))
    );
    return;
  }

  if (isLocalAppRequest) {
    event.respondWith(
      caches.match(request)
        .then((cached) => cached || fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        }))
        .catch(() => caches.match(localUrl('offline.html')))
    );
  }
});

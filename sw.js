const cacheName = 'village-v1';
const staticAssets = [
  './',
  './index.html',
  './agriculture.html',
  './schemes.html',
  './manifest.json'
];

// Install the Service Worker
self.addEventListener('install', async e => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

// Serve the app from cache when offline
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
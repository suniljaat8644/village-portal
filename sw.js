const cacheName = 'village-v1';
const staticAssets = [
  './',
  './index.html',
  './agriculture.html',
  './schemes.html',
  './scholarships.html',
  './healthcare.html',
  './support.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'
];

// 1. Install the Service Worker and Cache all pages
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('Service Worker: Caching Files');
      return cache.addAll(staticAssets);
    })
  );
  self.skipWaiting();
});

// 2. Activate and Clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activated');
});

// 3. Serve the app from cache when offline (Network First approach)
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

// 4. Listen for the push event from Firebase/Server
self.addEventListener('push', function(event) {
    let data = { title: 'Village Update', body: 'New Mandi Rates are live!' };
    
    try {
        if (event.data) {
            data = event.data.json();
        }
    } catch (e) {
        console.log('Push data was not JSON, using default.');
    }

    const options = {
        body: data.body,
        icon: 'icon.png', 
        badge: 'badge.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: '1'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});
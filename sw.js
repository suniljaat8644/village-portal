const cacheName = 'village-v2'; // Incremented version
const staticAssets = [
  './',
  './index.html',
  './login.html',            // Added for Officer Login
  './admin-dashboard.html',  // Added for Dashboard
  './agriculture.html',
  './schemes.html',
  './scholarships.html',
  './healthcare.html',
  './support.html',
  './manifest.json',
  './logo.png',              // Added your logo to cache
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js' // Added Chart.js for offline dashboard
];

// 1. Install & Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('SW: Caching All Assets');
      return cache.addAll(staticAssets);
    })
  );
  self.skipWaiting();
});

// 2. Activate & Cleanup Old Caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== cacheName).map(key => caches.delete(key))
      );
    })
  );
  console.log('SW: Activated & Cleaned');
});

// 3. Smart Fetch Strategy (Network First, then Cache)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(res => {
        // Update cache with the latest version from network
        const resClone = res.clone();
        caches.open(cacheName).then(cache => cache.put(event.request, resClone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});

// 4. Push Notifications
self.addEventListener('push', event => {
    let data = { title: 'Gram Suvidha Update', body: 'New village updates are live!' };
    
    try {
        if (event.data) {
            data = event.data.json();
        }
    } catch (e) {
        console.log('Push data not JSON');
    }

    const options = {
        body: data.body,
        icon: 'logo.png', // Using your logo as the icon
        badge: 'logo.png',
        vibrate: [200, 100, 200],
        tag: 'village-news', // Prevents multiple notifications stacking
        data: { url: './index.html' }
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
});

// 5. Handle Notification Click
self.onnotificationclick = function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
};
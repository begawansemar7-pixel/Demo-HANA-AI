// Service Worker for AI Halal Advisor - PWA Edition

const STATIC_CACHE_NAME = 'ai-halal-advisor-static-v1';
const DYNAMIC_CACHE_NAME = 'ai-halal-advisor-dynamic-v1';

// App Shell: files that are essential for the app's first load.
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json'
];

// Install a service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching app shell');
      return cache.addAll(urlsToCache);
    })
    .then(() => self.skipWaiting())
  );
});

// Activate the service worker and clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME)
          .map(cacheName => {
            console.log('Service Worker: Clearing old cache', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
    .then(() => clients.claim())
  );
});

// Fetching content using Service Worker
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Use a stale-while-revalidate strategy for dynamic content like images and translations.
  // This serves content from cache immediately if available, then updates the cache from the network.
  if (url.pathname.startsWith('/locales/') || url.hostname === 'picsum.photos') {
    event.respondWith(
      caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
          // Return cached response immediately, and the fetch promise will update the cache in the background.
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Use a cache-first strategy for all other requests (app shell, static assets like JS, CSS, fonts).
  // It checks the cache first and falls back to the network if the asset is not found.
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      // If not in cache, fetch from network and add to dynamic cache for future offline use.
      return fetch(request).then(networkResponse => {
        return caches.open(DYNAMIC_CACHE_NAME).then(cache => {
          // Don't cache chrome-extension requests or non-GET requests
          if (request.url.startsWith('chrome-extension://') || request.method !== 'GET') {
            return networkResponse;
          }
          cache.put(request, networkResponse.clone());
          return networkResponse;
        });
      });
    }).catch(error => {
        console.error('Service Worker fetch error:', error);
        // Optional: return an offline fallback page.
        // For now, we'll let the browser handle the offline error.
    })
  );
});


// Handles incoming push notifications from a server.
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push Received.');
  
  // Parse the data from the push event, with a fallback for empty data.
  const data = event.data ? event.data.json() : { title: 'AI Halal Advisor', body: 'You have a new update.' };
  
  const title = data.title;
  const options = {
    body: data.body,
    icon: '/favicon.svg', // Main icon for the notification
    badge: '/favicon.svg', // Smaller icon, often used in the status bar
  };

  // Display the notification to the user.
  event.waitUntil(self.registration.showNotification(title, options));
});

// Handles user clicks on a displayed notification.
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked.');
  
  // Close the notification that was clicked.
  event.notification.close();

  // Focus an existing app window or open a new one.
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If there's an open window, focus it.
      if (clientList.length > 0) {
        let client = clientList[0];
        // Find a focused client if available
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      // Otherwise, open a new window to the app's root URL.
      return clients.openWindow('/');
    })
  );
});
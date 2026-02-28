const CACHE_NAME = 'bhekthink-v5';
const urlsToCache = [
  '/BhekThink/',
  '/BhekThink/index.html',
  '/BhekThink/manifest.json',
  '/BhekThink/icon-192.png',
  '/BhekThink/icon-512.png',
  'https://js.puter.com/v2/',
  'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/tokyo-night-dark.min.css',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
  'https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css',
  'https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.js',
  'https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/contrib/auto-render.min.js'
];

// Install – cache essential assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate – clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch – stale-while-revalidate (serve from cache, update in background)
self.addEventListener('fetch', event => {
  // Skip cross-origin requests that are not in our allowlist
  if (!event.request.url.startsWith(self.location.origin) && 
      !event.request.url.startsWith('https://js.puter.com') &&
      !event.request.url.startsWith('https://cdn.jsdelivr.net') &&
      !event.request.url.startsWith('https://cdnjs.cloudflare.com') &&
      !event.request.url.startsWith('https://fonts.googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          // Return cached and update in background
          event.waitUntil(
            fetch(event.request).then(networkResponse => {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, networkResponse.clone());
              });
            }).catch(() => {})
          );
          return response;
        }
        // Not cached – fetch from network and cache
        return fetch(event.request).then(networkResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
  );
});

// Background Sync (for offline actions, e.g., saving archives)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-archives') {
    event.waitUntil(syncArchives());
  }
});

async function syncArchives() {
  // Example: retry sending queued archive saves
  console.log('Background sync for archives triggered');
  // You would read from IndexedDB and send to Puter
  const clients = await self.clients.matchAll();
  clients.forEach(client => client.postMessage({ type: 'ARCHIVES_SYNCED' }));
}

// Periodic Background Sync (every 24 hours)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-cache') {
    event.waitUntil(refreshCache());
  }
});

async function refreshCache() {
  const cache = await caches.open(CACHE_NAME);
  const requests = urlsToCache.map(url => new Request(url));
  await Promise.all(requests.map(request => 
    fetch(request).then(response => cache.put(request, response))
  ));
  console.log('Periodic cache update completed');
}

// Push Notifications (placeholder)
self.addEventListener('push', event => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/BhekThink/icon-192.png',
    badge: '/BhekThink/icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: data.url }
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.notification.data.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});

// Message from page to skip waiting (for updates)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

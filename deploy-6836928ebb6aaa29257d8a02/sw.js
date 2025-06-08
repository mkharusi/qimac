const CACHE_NAME = 'v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const IMAGE_CACHE = 'image-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/style.css',
  '/script.js',
  '/head.html',
  'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS)),
      caches.open(IMAGE_CACHE).then(cache => cache.addAll([
        '/images/logo.png',
        '/images/hero-bg.jpg',
        '/images/about-image.jpg'
      ]))
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name.startsWith('static-') || name.startsWith('dynamic-') || name.startsWith('image-'))
          .filter(name => name !== STATIC_CACHE && name !== DYNAMIC_CACHE && name !== IMAGE_CACHE)
          .map(name => caches.delete(name))
      );
    })
  );
});

// Fetch event - handle different types of requests
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clonedResponse = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, clonedResponse);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request).then(response => {
            if (response) return response;
            return new Response(JSON.stringify({ error: 'Offline' }), {
              headers: { 'Content-Type': 'application/json' }
            });
          });
        })
    );
    return;
  }

  // Handle image requests with cache-first strategy
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request).then(networkResponse => {
          const clonedResponse = networkResponse.clone();
          caches.open(IMAGE_CACHE).then(cache => {
            cache.put(request, clonedResponse);
          });
          return networkResponse;
        });
      })
    );
    return;
  }

  // Handle other requests with stale-while-revalidate strategy
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      const fetchPromise = fetch(request).then(networkResponse => {
        const clonedResponse = networkResponse.clone();
        caches.open(DYNAMIC_CACHE).then(cache => {
          cache.put(request, clonedResponse);
        });
        return networkResponse;
      });

      return cachedResponse || fetchPromise.catch(() => {
        // If offline and requesting a page, return offline page
        if (request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'submit-form') {
    event.waitUntil(
      caches.open('outbox').then(cache => {
        return cache.matchAll().then(requests => {
          return Promise.all(
            requests.map(request => {
              return fetch(request).then(response => {
                if (response.ok) {
                  return cache.delete(request);
                }
              });
            })
          );
        });
      })
    );
  }
});

// Push notification handling
self.addEventListener('push', event => {
  const options = {
    body: event.data.text(),
    icon: '/images/logo.png',
    badge: '/images/badge.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/images/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Oman Energy & Business Consultancy', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
}); 
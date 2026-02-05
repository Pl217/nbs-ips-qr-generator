const CACHE_NAME = 'ips-qr-generator-v1';
const urlsToCache = ['/index.html', '/'];

// Инсталација Service Worker-а
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache opened');
      return cache.addAll(urlsToCache);
    })
  );
});

// Активација Service Worker-а
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch евент - Cache First стратегија
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Ако постоји у cache-у, врати из cache-а
      if (response) {
        return response;
      }

      // Иначе, преузми са мреже
      return fetch(event.request).then((response) => {
        // Не кеширај ако није валидан одговор
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Клонирај одговор
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

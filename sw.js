// ── Service Worker for Offline Access ──
const CACHE_NAME = 'cake-maker-v1';

const ASSETS_TO_CACHE = [
  './',
  'stickerUpdate2.html',
  'botanical-bg.png',

  // Fonts
  'TAN_MON_CHERI/Web/TAN-MONCHERI.woff2',
  'TAN_MON_CHERI/Web/TAN-MONCHERI.woff',

  // Images
  'Images/cake.jpeg',
  'Images/stickers/yujisticker1.png',
  'Images/stickers/yujisticker2.png',
  'Images/stickers/yujisticker3.png',
  'Images/stickers/yujisticker4.png',
  'Images/stickers/yujisticker5.png',
  'Images/stickers/yujisticker6.png',

  // Music
  'music/Harleys in Hawaii.mp3',
  'music/Teenage Dream.mp3',
  'music/Treehouse.mp3',
  'music/her.mp3',

  // PWA
  'manifest.json',
  'icon-192.png',
];

// Install — cache all assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching all assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch — cache-first strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Cache any new requests dynamically (e.g. Google Fonts)
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(() => {
        // Offline fallback — return nothing for uncached requests
      });
    })
  );
});

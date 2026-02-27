// Black Hole Sultan V 1.0.0 Service Worker – Offline Caching Only
// © Caleb Beardsley 2026  All Rights Reserved

const CACHE_NAME = 'blackhole-sultan-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/sultan.css',
  '/js/core.js',
  '/js/hud.js',
  '/js/presets.json',
  '/media/icons/icon-192.png',
  '/media/icons/icon-512.png'
];

// Install event – cache shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate event – clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => { if (k !== CACHE_NAME) return caches.delete(k); })
    ))
  );
  self.clients.claim();
  // Signal ready state
  self.clients.matchAll({ includeUncontrolled: true }).then(clients =>
    clients.forEach(c => c.postMessage('Service Worker Active – Offline Ready'))
  );
});

// Fetch – cache‑first strategy
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(resp => resp || fetch(e.request))
  );
});

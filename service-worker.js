const CACHE_NAME = 'sultan-v1-checksum';
const ASSETS = ['./', './index.html', './manifest.json', 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'];

self.addEventListener('install', (e) => e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))));
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null)))));
self.addEventListener('fetch', (e) => e.respondWith(caches.match(e.request).then(res => res || fetch(e.request))));

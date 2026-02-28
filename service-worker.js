const CACHE_NAME = 'sultan-v1-checksum';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './beethoven_5.mp3',
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
];

// Header 1: Install & Cache
self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

// Footer 1: Cleanup old caches
self.addEventListener('activate', (e) => {
    e.waitUntil(caches.keys().then(keys => Promise.all(
        keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null)
    )));
});

// Header 2: Fetch Intercept
self.addEventListener('fetch', (e) => {
    e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});

// Footer 2: Final Loop Checksum
self.addEventListener('message', (e) => {
    if (e.data === 'ping') e.source.postMessage('pong-checksum-v1');
});

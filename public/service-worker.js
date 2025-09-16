/* eslint-disable no-restricted-globals */

const CACHE_NAME = "mangometro-v1";
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/main.bundle.js',
  '/static/css/main.bundle.css',
  '/manifest.json',
  '/mango-192.png',
  '/mango-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

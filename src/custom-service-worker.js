/* eslint-disable no-restricted-globals */

// This is needed for workbox
self.addEventListener('install', event => {
  console.log('Service worker installed');
});

self.addEventListener('activate', event => {
  console.log('Service worker activated');
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

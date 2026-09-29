const CACHE_NAME = "hema-calculates-v6";

const FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES);
    })
  );

  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    self.clients.claim()
  );
});

self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request).then(cached => {

      if (cached) {
        return cached;
      }

      return fetch(event.request)
        .then(response => {

          const copy = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, copy);
            });

          return response;

        })
        .catch(() => {
          return caches.match("./index.html");
        });

    })

  );

});
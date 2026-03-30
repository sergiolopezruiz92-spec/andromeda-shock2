const CACHE = 'andromeda-shock2-v1';
const FILES = [
  '/andromeda-shock2/',
  '/andromeda-shock2/index.html',
  '/andromeda-shock2/icon.png',
  '/andromeda-shock2/manifest.json'
];

// Instalar: guardar ficheros en caché
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting();
});

// Activar: borrar cachés antiguas
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: red primero, caché como fallback
// Si hay versión nueva en red, actualiza la caché
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, copy));
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});

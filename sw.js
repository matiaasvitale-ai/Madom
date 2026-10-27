// Guarda la app para que abra aunque no haya internet. Los datos siempre vienen de Drive.
const VERSION = "madom-v12";
const ARCHIVOS = ["./", "index.html", "manifest.webmanifest", "logo.png", "favicon.png", "apple-touch-icon.png", "icon-192.png", "icon-512.png", "icon-maskable-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;     // Google y Drive: directo
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(VERSION).then(ca => ca.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});

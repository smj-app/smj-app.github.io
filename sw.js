/* SMJ 3D : l'application fonctionne sans Internet (tout est gardé sur le téléphone). */
const CACHE = "smj3d-v1.0.1";
const FICHIERS = ["./", "index.html", "style.css", "app.js", "manifest.webmanifest", "confidentialite.html",
  "icones/icone-192.png", "icones/icone-512.png", "icones/masquable-192.png", "icones/masquable-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(L => Promise.all(L.filter(k => k.startsWith("smj3d-v") && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  // « Partager » un fichier .smj3d vers SMJ 3D (Android) : on le garde, puis on ouvre l'application
  if (e.request.method === "POST" && u.pathname.endsWith("/partage")){
    e.respondWith((async () => {
      try {
        const f = (await e.request.formData()).get("f");
        if (f){ const c = await caches.open("smj3d-partage"); await c.put("fichier", new Response(await f.text())); }
      } catch (err) { /* rien */ }
      return Response.redirect("./?partage=1", 303);
    })());
    return;
  }
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(r => r || fetch(e.request).then(rep => {
    if (rep.ok){ const cp = rep.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); }
    return rep;
  }).catch(() => caches.match("index.html"))));
});

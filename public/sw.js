/* Service worker — app shell offline-first.
 * - install: pré-armazena todos os arquivos do build (lista injetada por vite.config.ts)
 * - navegação: rede primeiro (sem cache HTTP) e cai para o index.html em cache
 * - demais arquivos do mesmo domínio: cache primeiro, atualiza em segundo plano
 */
const VERSION = 'kenzo-' + /*__VERSION__*/ 'dev';
const ASSETS = /*__PRECACHE__*/ [];
/* ignoreVary: pedidos de módulo/CORS não podem falhar contra a cópia guardada só por causa de um cabeçalho Vary */
const MATCH = { ignoreVary: true };
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll([...new Set([...SHELL, ...ASSETS])]))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      // no-cache: ignora o cache HTTP (o GitHub Pages guarda o HTML por ~10 min) e sempre revalida
      fetch(request, { cache: 'no-cache' })
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html', MATCH).then((r) => r || caches.match('./', MATCH))),
    );
    return;
  }

  event.respondWith(
    caches.match(request, MATCH).then((cached) => {
      const network = fetch(request)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});

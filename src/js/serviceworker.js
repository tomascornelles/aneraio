importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0-alpha.6/workbox-sw.js')

self.addEventListener('install', event => {
  const urls = [
    'apple-icon-120x120.29b8f989.png',
    'apple-icon-144x144.d1cc30ac.png',
    'apple-icon-152x152.699ab4aa.png',
    'apple-icon-180x180.28f658bb.png',
    'favicon-16x16.87e8dfe3.png',
    'favicon-32x32.7a9a1a64.png',
    'favicon-96x96.4e93736f.png',
    'index.html',
    'manifest.58582306.js',
    'ms-icon-144x144.bfefe17b.png',
    'style.4a4c13ca.css',
    'style.4a4c13ca.js',
    'style.4a4c13ca.map',
    'android-icon-192x192.703cc36a.png',
    'app.5f9ff3d1.js',
    'app.5f9ff3d1.map',
    'apple-icon-57x57.05fd9122.png',
    'apple-icon-60x60.c5986035.png',
    'apple-icon-72x72.26632ac1.png',
    'apple-icon-76x76.28ee0ba4.png',
    'apple-icon-114x114.d27c6fbb.png',
    '/'
  ]
  const cacheName = workbox.core.cacheNames.runtime
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(urls)))
})

workbox.routing.registerRoute(/index\.html/, args => {
  return workbox.strategies.networkFirst().handle(args).then(response => {
    return response
  })
})

workbox.routing.registerRoute(/\.(?:js|css|png|gif|jpg|svg)$/,
  workbox.strategies.cacheFirst()
)

workbox.routing.registerRoute(/(.*)cdn\.ampproject\.org(.*)/,
  workbox.strategies.staleWhileRevalidate()
)

// Service Worker for Tamagotchi PWA
const CACHE_NAME = "tamagotchi-v1"
const urlsToCache = ["/", "/manifest.json"]

// Install event - cache essential resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting()),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request)
      })
      .catch(() => {
        // If both cache and network fail, could return a custom offline page
        return caches.match("/")
      }),
  )
})

// Push notification event
self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {}
  const title = data.title || "Tamagotchi"
  const options = {
    body: data.body || "Votre Tamagotchi a besoin de vous!",
    icon: data.icon || "/icon-192x192.png",
    badge: "/icon-192x192.png",
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: data.actions || [],
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it
      for (const client of clientList) {
        if (client.url === "/" && "focus" in client) {
          return client.focus()
        }
      }
      // Otherwise, open a new window
      if (clients.openWindow) {
        return clients.openWindow("/")
      }
    }),
  )
})

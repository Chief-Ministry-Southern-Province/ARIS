/* Global service-worker code loaded by Vite PWA's generated worker. */
self.addEventListener("push", (event) => {
  let payload = {};

  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = {};
  }

  const unreadCount = Number(payload.unread_count || 0);
  const title = payload.title || "ARIS notification";
  const options = {
    body: payload.body || "You have a new ARIS notification. Open ARIS to view it securely.",
    icon: "/pwa-192x192-icon.png",
    badge: "/pwa-192x192-icon.png",
    tag: payload.tag || "aris-notification",
    data: { url: payload.url || "/notifications" },
  };

  event.waitUntil(Promise.all([
    self.registration.showNotification(title, options),
    typeof self.navigator.setAppBadge === "function"
      ? self.navigator.setAppBadge(unreadCount).catch(() => undefined)
      : Promise.resolve(),
  ]));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = new URL(event.notification.data?.url || "/notifications", self.location.origin).href;

  event.waitUntil((async () => {
    const clients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    const existingClient = clients.find((client) => client.url.startsWith(self.location.origin));

    if (existingClient) {
      await existingClient.navigate(targetUrl);
      await existingClient.focus();
      return;
    }

    await self.clients.openWindow(targetUrl);
  })());
});

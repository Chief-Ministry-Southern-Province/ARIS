import api from "@/services/api";

const publicKey = import.meta.env.VITE_WEB_PUSH_PUBLIC_KEY as string | undefined;

const urlBase64ToUint8Array = (value: string): Uint8Array<ArrayBuffer> => {
  const padded = value.padEnd(value.length + ((4 - (value.length % 4)) % 4), "=");
  const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
  const bytes = atob(base64);

  return Uint8Array.from(bytes, (character) => character.charCodeAt(0));
};

export const supportsWebPush = () =>
  "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

export const enableWebPush = async (): Promise<void> => {
  if (!supportsWebPush()) {
    throw new Error("Background push notifications are not supported by this browser.");
  }

  if (!publicKey) {
    throw new Error("Push notifications are not configured for this environment.");
  }

  const permission = await window.Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }

  try {
    await api.post("/push-subscriptions", subscription.toJSON());
  } catch (error) {
    await subscription.unsubscribe().catch(() => false);
    throw error;
  }
};

export const disableWebPush = async (): Promise<void> => {
  if (!supportsWebPush()) return;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();

  if (!subscription) return;

  await api.delete("/push-subscriptions", { data: { endpoint: subscription.endpoint } });
  await subscription.unsubscribe();
};

export const isWebPushEnabled = async (): Promise<boolean> => {
  if (!supportsWebPush() || window.Notification.permission !== "granted") return false;

  const registration = await navigator.serviceWorker.ready;
  return (await registration.pushManager.getSubscription()) !== null;
};

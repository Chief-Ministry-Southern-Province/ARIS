import api from "@/services/api";
import type { AppNotification, NotificationPage } from "@/types/notification.type";

export const getNotifications = async (page = 1): Promise<NotificationPage> =>
  (await api.get("/notifications", { params: { page } })).data;

export const getUnreadNotificationCount = async (): Promise<number> =>
  (await api.get("/notifications/unread-count")).data.count;

export const markNotificationAsRead = async (id: string | number): Promise<AppNotification> =>
  (await api.patch(`/notifications/${id}/read`)).data.data;

export const markAllNotificationsAsRead = async (): Promise<number> =>
  (await api.patch("/notifications/read-all")).data.count;

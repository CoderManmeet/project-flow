import axiosInstance from '../api/axiosInstance';
import type { Notification } from '../types/notification.types';

export const getNotifications = async (): Promise<{ notifications: Notification[]; unreadCount: number }> => {
  const res = await axiosInstance.get('/notifications');
  return res.data;
};

export const markAsRead = async (id: string): Promise<void> => {
  await axiosInstance.patch(`/notifications/${id}/read`);
};

export const markAllAsRead = async (): Promise<void> => {
  await axiosInstance.patch('/notifications/read-all');
};
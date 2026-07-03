import Notification from '../models/Notification.js';

export const createNotification = async ({ recipient, type, message, relatedProject, relatedTask }) => {
  try {
    await Notification.create({ recipient, type, message, relatedProject, relatedTask });
  } catch (error) {
    console.error('Failed to create notification:', error.message);
  }
};
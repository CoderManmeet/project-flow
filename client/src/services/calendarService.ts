import axiosInstance from '../api/axiosInstance';
import type { Task } from '../types/task.types';

export const getAllUserTasks = async (): Promise<Task[]> => {
  const res = await axiosInstance.get('/tasks/all');
  return res.data.tasks;
};
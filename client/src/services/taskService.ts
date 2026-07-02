import axiosInstance from '../api/axiosInstance';
import type { Task } from '../types/task.types';

export const getTasksByProject = async (projectId: string): Promise<Task[]> => {
  const res = await axiosInstance.get(`/tasks/project/${projectId}`);
  return res.data.tasks;
};

export const createTask = async (data: Partial<Task>): Promise<Task> => {
  const res = await axiosInstance.post('/tasks', data);
  return res.data.task;
};

export const updateTask = async (id: string, data: Partial<Task>): Promise<Task> => {
  const res = await axiosInstance.put(`/tasks/${id}`, data);
  return res.data.task;
};

export const moveTask = async (id: string, status: string, order: number): Promise<Task> => {
  const res = await axiosInstance.patch(`/tasks/${id}/move`, { status, order });
  return res.data.task;
};

export const deleteTask = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/tasks/${id}`);
};
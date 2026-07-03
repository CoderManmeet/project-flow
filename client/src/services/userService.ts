import axiosInstance from '../api/axiosInstance';
import type { User } from '../types/user.types';

export const getUsers = async (): Promise<User[]> => {
  const res = await axiosInstance.get('/users');
  return res.data.users;
};

export const updateUserRole = async (id: string, role: string): Promise<User> => {
  const res = await axiosInstance.put(`/users/${id}/role`, { role });
  return res.data.user;
};

export const toggleUserStatus = async (id: string): Promise<User> => {
  const res = await axiosInstance.patch(`/users/${id}/status`);
  return res.data.user;
};

export const deleteUser = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/users/${id}`);
};
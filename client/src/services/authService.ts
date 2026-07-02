import axiosInstance from '../api/axiosInstance';
import type { RegisterData, LoginData, AuthResponse } from '../types/user.types';

export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/register', data);
  return response.data;
};

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  await axiosInstance.post('/auth/logout');
};

export const getCurrentUser = async (): Promise<AuthResponse> => {
  const response = await axiosInstance.get<AuthResponse>('/auth/me');
  return response.data;
};
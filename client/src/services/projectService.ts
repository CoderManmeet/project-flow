import axiosInstance from '../api/axiosInstance';
import type { Project } from '../types/project.types';

export const getProjects = async (): Promise<Project[]> => {
  const res = await axiosInstance.get('/projects');
  return res.data.projects;
};

export const getProject = async (id: string): Promise<Project> => {
  const res = await axiosInstance.get(`/projects/${id}`);
  return res.data.project;
};

export const createProject = async (data: Partial<Project>): Promise<Project> => {
  const res = await axiosInstance.post('/projects', data);
  return res.data.project;
};

export const updateProject = async (id: string, data: Partial<Project>): Promise<Project> => {
  const res = await axiosInstance.put(`/projects/${id}`, data);
  return res.data.project;
};

export const deleteProject = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/projects/${id}`);
};
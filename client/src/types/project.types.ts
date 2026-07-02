import type { User } from './user.types';

export interface Project {
  _id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'archived';
  color: string;
  deadline?: string;
  members: User[];
  createdBy: User;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  createdAt: string;
}
import axiosInstance from '../api/axiosInstance';

export interface DashboardStats {
  stats: {
    totalProjects: number;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    lateTasks: number;
  };
  statusBreakdown: { _id: string; count: number }[];
  priorityBreakdown: { _id: string; count: number }[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await axiosInstance.get('/analytics/dashboard');
  return res.data;
};
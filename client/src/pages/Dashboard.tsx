import { useQuery } from '@tanstack/react-query';
import { FolderKanban, ListTodo, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { getDashboardStats } from '../services/analyticsService';
import { useAuthStore } from '../context/authStore';
import StatCard from '../components/dashboard/StatCard';
import StatusPieChart from '../components/charts/StatusPieChart';
import PriorityBarChart from '../components/charts/PriorityBarChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening across your projects.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Projects" value={stats?.totalProjects || 0} icon={FolderKanban} color="bg-indigo-500" />
        <StatCard title="Total Tasks" value={stats?.totalTasks || 0} icon={ListTodo} color="bg-blue-500" />
        <StatCard title="Completed" value={stats?.completedTasks || 0} icon={CheckCircle2} color="bg-emerald-500" />
        <StatCard title="Pending" value={stats?.pendingTasks || 0} icon={Clock} color="bg-amber-500" />
        <StatCard title="Late" value={stats?.lateTasks || 0} icon={AlertTriangle} color="bg-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Task Status Breakdown</CardTitle></CardHeader>
          <CardContent><StatusPieChart data={data?.statusBreakdown || []} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Tasks by Priority</CardTitle></CardHeader>
          <CardContent><PriorityBarChart data={data?.priorityBreakdown || []} /></CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
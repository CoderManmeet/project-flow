import { useAuthStore } from '../context/authStore';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome, {user?.name} 👋</h1>
        <Button variant="outline" onClick={logout}>
          Logout
        </Button>
      </div>
      <p className="text-muted-foreground">Your role: {user?.role}</p>
    </div>
  );
};

export default Dashboard;
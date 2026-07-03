import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getUsers, updateUserRole, toggleUserStatus, deleteUser } from '../services/userService';
import { useAuthStore } from '../context/authStore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Trash2 } from 'lucide-react';

const Team = () => {
  const { user: currentUser } = useAuthStore();
  const isAdmin = currentUser?.role === 'admin';
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({ queryKey: ['users'], queryFn: getUsers });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['users'] });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => updateUserRole(id, role),
    onSuccess: () => { invalidate(); toast.success('Role updated'); },
    onError: () => toast.error('Only admins can change roles'),
  });

  const statusMutation = useMutation({
    mutationFn: toggleUserStatus,
    onSuccess: () => { invalidate(); toast.success('Status updated'); },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => { invalidate(); toast.success('User removed'); },
  });

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team</h1>
        <p className="text-muted-foreground mt-1">
          {isAdmin ? 'Manage roles and access for your team.' : 'View your team members.'}
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          {users?.map((u) => (
            <div key={u._id} className="flex items-center gap-4 p-4 border-b last:border-0">
              <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-medium shrink-0">
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{u.name}</p>
                <p className="text-sm text-muted-foreground truncate">{u.email}</p>
              </div>

              {u.status === 'inactive' && <Badge variant="secondary">Inactive</Badge>}

              {isAdmin ? (
                <Select value={u.role} onValueChange={(role) => roleMutation.mutate({ id: u._id, role })}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant="outline" className="capitalize">{u.role}</Badge>
              )}

              {isAdmin && u._id !== currentUser?._id && (
                <>
                  <Button variant="outline" size="sm" onClick={() => statusMutation.mutate(u._id)}>
                    {u.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => deleteMutation.mutate(u._id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Team;
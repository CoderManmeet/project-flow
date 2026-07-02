import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createTask, updateTask, deleteTask } from '../../services/taskService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Trash2 } from 'lucide-react';
import type { Task } from '../../types/task.types';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  task: Task | null;
  projectId: string;
  defaultStatus: string;
}

const TaskDialog = ({ open, onOpenChange, mode, task, projectId, defaultStatus }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (mode === 'edit' && task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
    }
  }, [mode, task, open]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      invalidate();
      toast.success('Task created');
      onOpenChange(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Task>) => updateTask(task!._id, data),
    onSuccess: () => {
      invalidate();
      toast.success('Task updated');
      onOpenChange(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteTask(task!._id),
    onSuccess: () => {
      invalidate();
      toast.success('Task deleted');
      onOpenChange(false);
    },
  });

  const handleSubmit = () => {
    if (!title.trim()) return toast.error('Title is required');
    if (mode === 'create') {
      createMutation.mutate({ title, description, priority: priority as Task['priority'], project: projectId, status: defaultStatus as Task['status'] });
    } else {
      updateMutation.mutate({ title, description, priority: priority as Task['priority'] });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create Task' : 'Edit Task'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          {mode === 'edit' && (
            <Button variant="destructive" size="icon" onClick={() => deleteMutation.mutate()}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
            {mode === 'create' ? 'Create Task' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
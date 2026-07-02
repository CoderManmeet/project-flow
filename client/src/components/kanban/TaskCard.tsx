import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, CheckSquare } from 'lucide-react';
import type { Task } from '../../types/task.types';

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-amber-100 text-amber-700',
  critical: 'bg-red-100 text-red-700',
};

interface Props {
  task: Task;
  onClick: () => void;
}

const TaskCard = ({ task, onClick }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const completedChecklist = task.checklist.filter((c) => c.completed).length;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        onClick={onClick}
        className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow mb-3"
      >
        <CardContent className="p-4 space-y-3">
          <p className="font-medium text-sm leading-snug">{task.title}</p>

          {task.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.labels.map((label) => (
                <Badge key={label} variant="outline" className="text-xs">{label}</Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <Badge className={`text-xs ${PRIORITY_COLORS[task.priority]}`}>{task.priority}</Badge>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {task.checklist.length > 0 && (
                <span className="flex items-center gap-1">
                  <CheckSquare className="w-3 h-3" />
                  {completedChecklist}/{task.checklist.length}
                </span>
              )}
              {task.deadline && (
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>
          </div>

          {task.assignedTo.length > 0 && (
            <div className="flex -space-x-2">
              {task.assignedTo.slice(0, 3).map((user) => (
                <div
                  key={user._id}
                  className="w-6 h-6 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center border-2 border-white"
                  title={user.name}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskCard;
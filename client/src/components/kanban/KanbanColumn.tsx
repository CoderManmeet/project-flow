import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import type { Task } from '../../types/task.types';

interface Props {
  id: string;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const COLUMN_COLORS: Record<string, string> = {
  todo: 'border-t-slate-400',
  'in-progress': 'border-t-blue-500',
  review: 'border-t-amber-500',
  completed: 'border-t-emerald-500',
};

const KanbanColumn = ({ id, title, tasks, onTaskClick }: Props) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col w-full min-w-[280px] max-w-[320px]">
      <div className={`flex items-center justify-between mb-3 pb-2 border-t-4 ${COLUMN_COLORS[id]} pt-2 px-1`}>
        <h3 className="font-semibold text-sm">{title}</h3>
        <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
          {tasks.length}
        </span>
      </div>

      <div ref={setNodeRef} className="flex-1 bg-muted/30 rounded-lg p-2 min-h-[500px]">
        <SortableContext items={tasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;
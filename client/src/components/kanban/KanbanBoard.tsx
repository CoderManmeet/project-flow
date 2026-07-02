import { useState } from 'react';
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasksByProject, moveTask } from '../../services/taskService';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import TaskDialog from '../tasks/TaskDialog';
import type { Task } from '../../types/task.types';

const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'completed', title: 'Completed' },
];

const KanbanBoard = ({ projectId }: { projectId: string }) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState('todo');

  const queryClient = useQueryClient();
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => getTasksByProject(projectId),
  });

  const moveMutation = useMutation({
    mutationFn: ({ id, status, order }: { id: string; status: string; order: number }) =>
      moveTask(id, status, order),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks', projectId] }),
  });

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t._id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeTaskData = tasks.find((t) => t._id === active.id);
    if (!activeTaskData) return;

    // Dropped over a column directly, or over another task (get that task's column)
    const overColumn = COLUMNS.find((c) => c.id === over.id)?.id
      || tasks.find((t) => t._id === over.id)?.status;

    if (!overColumn) return;

    const tasksInTargetColumn = tasks.filter((t) => t.status === overColumn);
    const newOrder = tasksInTargetColumn.length;

    if (activeTaskData.status !== overColumn) {
      moveMutation.mutate({ id: activeTaskData._id, status: overColumn, order: newOrder });
    }
  };

  const openCreateDialog = (status: string) => {
    setDefaultStatus(status);
    setSelectedTask(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const openEditDialog = (task: Task) => {
    setSelectedTask(task);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((col) => (
            <div key={col.id}>
              <KanbanColumn
                id={col.id}
                title={col.title}
                tasks={tasks.filter((t) => t.status === col.id)}
                onTaskClick={openEditDialog}
              />
              <button
                onClick={() => openCreateDialog(col.id)}
                className="text-xs text-muted-foreground hover:text-foreground w-full text-left px-2 mt-1"
              >
                + Add task
              </button>
            </div>
          ))}
        </div>
        <DragOverlay>
          {activeTask && <TaskCard task={activeTask} onClick={() => {}} />}
        </DragOverlay>
      </DndContext>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        task={selectedTask}
        projectId={projectId}
        defaultStatus={defaultStatus}
      />
    </>
  );
};

export default KanbanBoard;
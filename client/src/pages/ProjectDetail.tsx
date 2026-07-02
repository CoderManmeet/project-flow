import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProject } from '../services/projectService';
import KanbanBoard from '../components/kanban/KanbanBoard';
import { Skeleton } from '@/components/ui/skeleton';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id!),
    enabled: !!id,
  });

  if (isLoading) return <div className="p-8"><Skeleton className="h-10 w-64 mb-6" /><Skeleton className="h-96" /></div>;

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: project?.color }} />
        <h1 className="text-2xl font-bold">{project?.title}</h1>
      </div>
      {id && <KanbanBoard projectId={id} />}
    </div>
  );
};

export default ProjectDetail;
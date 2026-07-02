import { useQuery } from '@tanstack/react-query';
import { getProjects } from '../services/projectService';
import ProjectCard from '../components/projects/ProjectCard';
import CreateProjectDialog from '../components/projects/CreateProjectDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { FolderKanban } from 'lucide-react';

const Projects = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage all your projects in one place.</p>
        </div>
        <CreateProjectDialog />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48" />)}
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => <ProjectCard key={p._id} project={p} />)}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FolderKanban className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold">No projects yet</h3>
          <p className="text-muted-foreground mb-4">Create your first project to get started.</p>
          <CreateProjectDialog />
        </div>
      )}
    </div>
  );
};

export default Projects;
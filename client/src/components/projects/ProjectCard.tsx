import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import type { Project } from '../../types/project.types';

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Link to={`/projects/${project._id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
              <h3 className="font-semibold text-lg">{project.title}</h3>
            </div>
            <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
              {project.status}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description || 'No description'}
          </p>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} />
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{project.members.length + 1}</span>
            </div>
            <span>{project.completedTasks}/{project.totalTasks} tasks</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProjectCard;
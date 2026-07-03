export interface Notification {
  _id: string;
  type: 'task_assigned' | 'deadline_near' | 'project_created' | 'task_completed' | 'added_to_project';
  message: string;
  relatedProject?: string;
  relatedTask?: string;
  read: boolean;
  createdAt: string;
}
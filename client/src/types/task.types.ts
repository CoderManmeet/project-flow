export interface ChecklistItem {
  _id?: string;
  text: string;
  completed: boolean;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  labels: string[];
  deadline?: string;
  assignedTo: { _id: string; name: string; email: string; avatar: string }[];
  project: string;
  checklist: ChecklistItem[];
  order: number;
  createdAt: string;
}
export interface Task {
  _id?: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string | null;
  category: string;
  tags: string[];
  user?: string;
  createdAt?: string;
  updatedAt?: string;
}
import { Task } from './task';

export interface DashboardStats {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
  overdue: number;
  dueToday: number;
  upcoming: number;
  highPriority: number;
  urgentPriority: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentTasks: Task[];
  upcomingTasks: Task[];
  overdueTasks: Task[];
}
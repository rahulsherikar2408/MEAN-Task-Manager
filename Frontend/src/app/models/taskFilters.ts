export interface TaskFilters {
  search?: string;
  status?: string;
  priority?: string;
  category?: string;
  dueFrom?: string;
  dueTo?: string;
  overdue?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

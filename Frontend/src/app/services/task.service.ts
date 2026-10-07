import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { environment } from '../environments/environment';
import { Task } from '../models/task';

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

  page?: number;
  limit?: number;
}

export interface TaskPagination {
  page: number;
  limit: number;
  totalTasks: number;
  totalPages: number;
}

export interface TaskResponse {
  tasks: Task[];
  pagination: TaskPagination;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/api/tasks`;

  private refreshRequiredSubject = new Subject<void>();

  refreshRequired$ = this.refreshRequiredSubject.asObservable();

  constructor(private http: HttpClient) {}

  // =========================
  // Get Tasks
  // =========================

  getTasks(filters?: TaskFilters): Observable<TaskResponse> {
    let params = new HttpParams();

    if (filters?.search) {
      params = params.set('search', filters.search);
    }

    if (filters?.status && filters.status !== 'All') {
      params = params.set('status', filters.status);
    }

    if (filters?.priority && filters.priority !== 'All') {
      params = params.set('priority', filters.priority);
    }

    if (filters?.category && filters.category !== 'All') {
      params = params.set('category', filters.category);
    }

    if (filters?.dueFrom) {
      params = params.set('dueFrom', filters.dueFrom);
    }

    if (filters?.dueTo) {
      params = params.set('dueTo', filters.dueTo);
    }

    if (filters?.overdue) {
      params = params.set('overdue', 'true');
    }

    if (filters?.sortBy) {
      params = params.set('sortBy', filters.sortBy);
    }

    if (filters?.sortOrder) {
      params = params.set('sortOrder', filters.sortOrder);
    }

    // Pagination

    if (filters?.page) {
      params = params.set('page', filters.page.toString());
    }

    if (filters?.limit) {
      params = params.set('limit', filters.limit.toString());
    }

    return this.http.get<TaskResponse>(this.apiUrl, { params });
  }

  // =========================
  // Get Task By ID
  // =========================

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  // =========================
  // Add Task
  // =========================

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  // =========================
  // Update Task
  // =========================

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  // =========================
  // Delete Task
  // =========================

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // =========================
  // Refresh
  // =========================

  refreshTasks(): void {
    this.refreshRequiredSubject.next();
  }
}

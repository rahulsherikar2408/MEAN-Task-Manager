import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';

import { Task } from '../models/task';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private api = `${environment.apiUrl}/api/tasks`;

  // Notify components whenever task data changes
  private refreshRequired = new Subject<void>();

  refreshRequired$ = this.refreshRequired.asObservable();

  constructor(private http: HttpClient) {}

  /*
   * Get all tasks belonging to the logged-in user
   */
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.api);
  }

  /*
   * Add a new task
   */
  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.api, task).pipe(
      tap(() => {
        this.refreshRequired.next();
      })
    );
  }

  /*
   * Update an existing task
   */
  updateTask(id: string, task: Task): Observable<Task> {
    return this.http.put<Task>(
      `${this.api}/${id}`,
      task
    ).pipe(
      tap(() => {
        this.refreshRequired.next();
      })
    );
  }

  /*
   * Delete a task
   */
  deleteTask(id: string): Observable<any> {
    return this.http.delete(
      `${this.api}/${id}`
    ).pipe(
      tap(() => {
        this.refreshRequired.next();
      })
    );
  }
}
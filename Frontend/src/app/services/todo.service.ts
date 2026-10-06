import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, pipe, Subject, tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private api = `${environment.apiUrl}/api/todos`;

  // Notify when data changes
  private refreshRequired = new Subject<void>();
  refreshRequired$ = this.refreshRequired.asObservable();

  constructor(private https: HttpClient) { }

  getTodos() {
    return this.https.get<Todo[]>(this.api);
  }

  addTodo(todo: Todo): Observable<Todo> {
    return this.https.post<Todo>(this.api, todo).pipe(
      tap(() => this.refreshRequired.next())
    );
  }

  updateTodo(id: string, todo: Todo): Observable<Todo> {
    return this.https.put<Todo>(`${this.api}/${id}`, todo).pipe(
      tap(() => this.refreshRequired.next())
    );
  }

  deleteTodo(id: string): Observable<any> {
    return this.https.delete(`${this.api}/${id}`).pipe(
      tap(() => this.refreshRequired.next())
    );
  }

}
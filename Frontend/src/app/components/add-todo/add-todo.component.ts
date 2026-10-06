import { Component } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css'],
})
export class AddTodoComponent {
  title = '';

  priority = 'Medium';

  dueDate = '';

  constructor(
    private todoService: TodoService,
    private toastr: ToastrService,
  ) {}

  addTodo() {
    if (!this.title.trim() || !this.dueDate) return;

    const todo: Todo = {
      title: this.title,

      priority: this.priority,

      dueDate: this.dueDate,

      completed: false,
    };

    this.todoService.addTodo(todo).subscribe({
      next: () => {
        this.toastr.success('Todo added successfully!', 'Success');
        this.title = '';
        this.priority = 'Medium';
        this.dueDate = '';
      },
      error: (err) => {
        this.toastr.error(
             err.error?.message || "Something went wrong",
            "Error"
        );
      },
    });
  }
}

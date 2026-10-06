import { Component, Input } from '@angular/core';
import { Todo } from '../../models/todo';
import { TodoService } from '../../services/todo.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
})
export class TodoItemComponent {

  @Input() todo!: Todo;

  @Input() index!: number;

  constructor(private todoService: TodoService, private toastr: ToastrService) {}

  deleteTodo() {

    this.todoService.deleteTodo(this.todo._id!).subscribe({
      next: () => {
        this.toastr.success('Todo Deleted successfully!', 'Success');
      },
      error: (err) => {
        this.toastr.error(
            "Something went wrong",
            "Error"
        );
      }
    });

  }

  toggleStatus() {

    this.todo.completed = !this.todo.completed;

    this.todoService.updateTodo(this.todo._id!, this.todo).subscribe({
      next: () => {
        this.toastr.success('Todo Edited successfully!', 'Success');
      },
      error: (err) => {
        this.toastr.error(
            "Something went wrong",
            "Error"
        );
      }
    });

  }

}
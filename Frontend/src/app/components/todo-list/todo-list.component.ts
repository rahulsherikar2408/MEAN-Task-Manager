import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Todo } from 'src/app/models/todo';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent {

  todos: Todo[] = [];
  searchText: string = "";
  filter = "All";
  priority = 'All';

  isHomePage: boolean = false;

  private refreshSubscription!: Subscription;

  constructor(private todoService: TodoService, private router: Router){
    this.isHomePage = this.router.url === '/';
  }

  ngOnInit(): void{
    this.loadTodos();

    this.refreshSubscription = this.todoService.refreshRequired$.subscribe(() => {
      this.loadTodos();
    })
  }

  loadTodos(): void{
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  ngOnDestroy(): void {
    this.refreshSubscription.unsubscribe();
  }

}

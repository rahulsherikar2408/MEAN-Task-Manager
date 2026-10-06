import { Component, OnInit } from '@angular/core';
import { TodoService } from './services/todo.service';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isLoading$ = this.loadingService.loading$;

  constructor(
    private todoService: TodoService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {

    this.todoService.getTodos().subscribe({

      next: () => {
        // Backend is available
        this.loadingService.hide();
      },

      error: (error) => {
        console.error(error);

        // Backend request failed
        this.loadingService.hide();
      }

    });

  }
}
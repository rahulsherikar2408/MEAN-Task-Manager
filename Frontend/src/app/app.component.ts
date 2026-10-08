import { Component, OnInit } from '@angular/core';
import { LoadingService } from './services/loading.service';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Angular-Todo-App';
  isLoading$ = this.loadingService.loading$;

  constructor(
    private taskService: TaskService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {

    this.taskService.getTasks().subscribe({

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
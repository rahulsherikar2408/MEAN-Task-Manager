import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent
  implements OnInit, OnDestroy {

  tasks: Task[] = [];

  searchText = '';

  filter = 'All';

  priority = 'All';

  isHomePage = false;

  private refreshSubscription!: Subscription;

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {

    this.isHomePage =
      this.router.url === '/';
  }


  ngOnInit(): void {

    this.loadTasks();

    this.refreshSubscription =
      this.taskService.refreshRequired$.subscribe(() => {

        this.loadTasks();

      });
  }


  loadTasks(): void {

    this.taskService.getTasks().subscribe({

      next: (tasks) => {

        this.tasks = tasks;

      },

      error: (err) => {

        console.error(
          'Error loading tasks:',
          err
        );

      }

    });
  }


  ngOnDestroy(): void {

    this.refreshSubscription?.unsubscribe();

  }

}
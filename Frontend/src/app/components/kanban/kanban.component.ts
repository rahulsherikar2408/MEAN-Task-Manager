import { Component, OnInit } from '@angular/core';

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css'],
})
export class KanbanComponent implements OnInit {
  // =========================
  // Task Columns
  // =========================

  todoTasks: Task[] = [];

  inProgressTasks: Task[] = [];

  completedTasks: Task[] = [];

  // =========================
  // Loading
  // =========================

  loading = false;

  // =========================
  // Updating Task
  // =========================

  updatingTaskId: string | null = null;

  constructor(
    private taskService: TaskService,
    private toastr: ToastrService,
  ) {}

  // =========================
  // ngOnInit
  // =========================

  ngOnInit(): void {
    this.loadTasks();
  }

  // =========================
  // Load Tasks
  // =========================

  loadTasks(): void {
    this.loading = true;

    this.taskService
      .getTasks({
        limit: 100,
        page: 1,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      })
      .subscribe({
        next: (response) => {
          this.todoTasks = response.tasks.filter(
            (task) => task.status === 'TODO',
          );

          this.inProgressTasks = response.tasks.filter(
            (task) => task.status === 'IN_PROGRESS',
          );

          this.completedTasks = response.tasks.filter(
            (task) => task.status === 'COMPLETED',
          );

          this.loading = false;
        },

        error: (error) => {
          console.error('Kanban Load Error:', error);

          this.loading = false;

          this.toastr.error('Unable to load tasks.', 'Error');
        },
      });
  }

  // =========================
  // Drop Task
  // =========================

  dropTask(event: CdkDragDrop<Task[]>, newStatus: Task['status']): void {
    // =========================
    // Same Column
    // =========================

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      return;
    }

    // =========================
    // Different Column
    // =========================

    const task = event.previousContainer.data[event.previousIndex];

    const previousStatus = task.status;

    // Move task visually

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );

    // Update local status

    task.status = newStatus;

    // Make sure task has ID

    if (!task._id) {
      this.toastr.error('Unable to update task.', 'Error');

      // Move task back

      transferArrayItem(
        event.container.data,
        event.previousContainer.data,
        event.currentIndex,
        event.previousIndex,
      );

      task.status = previousStatus;

      return;
    }

    // =========================
    // Loading State
    // =========================

    this.updatingTaskId = task._id;

    // =========================
    // Update Backend
    // =========================

    this.taskService
      .updateTask(task._id, {
        status: newStatus,
      })
      .subscribe({
        next: (updatedTask) => {
          this.updatingTaskId = null;

          // Update local task

          task.status = updatedTask.status;

          this.toastr.success('Task status updated.', 'Success');
        },

        error: (error) => {
          console.error('Update Task Status Error:', error);

          this.updatingTaskId = null;

          // =========================
          // Rollback UI
          // =========================

          const currentIndex = event.container.data.indexOf(task);

          if (currentIndex !== -1) {
            transferArrayItem(
              event.container.data,
              event.previousContainer.data,
              currentIndex,
              event.previousIndex,
            );
          }

          task.status = previousStatus;

          this.toastr.error('Unable to update task status.', 'Error');
        },
      });
  }

  // =========================
  // Refresh
  // =========================

  refreshBoard(): void {
    this.loadTasks();
  }

  // =========================
  // Track By
  // =========================

  trackByTaskId(index: number, task: Task): string {
    return task._id || index.toString();
  }
}

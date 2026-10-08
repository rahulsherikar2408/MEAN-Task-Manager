import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';

import { Router } from '@angular/router';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit {

  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  completedTasks: Task[] = [];

  loading = false;
  updatingTaskId: string | null = null;
  deletingTaskId: string | null = null;

  constructor(
    private taskService: TaskService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  // ==========================
  // Load Tasks
  // ==========================

  loadTasks(): void {

    this.loading = true;

    this.taskService.getTasks({
      page: 1,
      limit: 100,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }).subscribe({

      next: (response) => {

        const tasks = response.tasks;

        this.todoTasks = tasks.filter(
          task => task.status === 'TODO'
        );

        this.inProgressTasks = tasks.filter(
          task => task.status === 'IN_PROGRESS'
        );

        this.completedTasks = tasks.filter(
          task => task.status === 'COMPLETED'
        );

        this.loading = false;
      },

      error: (error) => {

        this.loading = false;

        this.toastr.error(
          error.error?.message || 'Failed to load tasks.',
          'Error'
        );
      }
    });
  }


  // ==========================
  // Drag & Drop
  // ==========================

  dropTask(
    event: CdkDragDrop<Task[]>,
    newStatus: 'TODO' | 'IN_PROGRESS' | 'COMPLETED'
  ): void {

    // Same column
    if (event.previousContainer === event.container) {

      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      return;
    }

    const task =
      event.previousContainer.data[event.previousIndex];

    const previousStatus = task.status;

    // Move task visually
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    // Update local status
    task.status = newStatus;

    if (!task._id) {
      return;
    }

    this.updatingTaskId = task._id;

    // Update backend
    this.taskService.updateTask(
      task._id,
      {
        status: newStatus
      }
    ).subscribe({

      next: () => {

        this.updatingTaskId = null;

        this.toastr.success(
          `Task moved to ${this.getStatusLabel(newStatus)}.`,
          'Task Updated'
        );
      },

      error: (error) => {

        this.updatingTaskId = null;

        // Rollback
        transferArrayItem(
          event.container.data,
          event.previousContainer.data,
          event.currentIndex,
          event.previousIndex
        );

        task.status = previousStatus;

        this.toastr.error(
          error.error?.message || 'Failed to update task.',
          'Error'
        );
      }
    });
  }


  // ==========================
  // Delete Task
  // ==========================

  deleteTask(task: Task): void {

    if (!task._id) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`
    );

    if (!confirmed) {
      return;
    }

    this.deletingTaskId = task._id;

    this.taskService.deleteTask(
      task._id
    ).subscribe({

      next: () => {

        this.removeTaskFromBoard(task._id!);

        this.deletingTaskId = null;

        this.toastr.success(
          'Task deleted successfully.',
          'Deleted'
        );
      },

      error: (error) => {

        this.deletingTaskId = null;

        this.toastr.error(
          error.error?.message || 'Failed to delete task.',
          'Error'
        );
      }
    });
  }


  // ==========================
  // Remove From Board
  // ==========================

  private removeTaskFromBoard(
    taskId: string
  ): void {

    this.todoTasks =
      this.todoTasks.filter(
        task => task._id !== taskId
      );

    this.inProgressTasks =
      this.inProgressTasks.filter(
        task => task._id !== taskId
      );

    this.completedTasks =
      this.completedTasks.filter(
        task => task._id !== taskId
      );
  }


  // ==========================
  // Status
  // ==========================

  getStatusLabel(status: string): string {

    switch (status) {

      case 'TODO':
        return 'To Do';

      case 'IN_PROGRESS':
        return 'In Progress';

      case 'COMPLETED':
        return 'Completed';

      default:
        return status;
    }
  }


  // ==========================
  // Priority
  // ==========================

  getPriorityClass(priority: string): string {
    switch (priority) {
      case 'LOW':
        return 'badge-priority-low';
      case 'MEDIUM':
        return 'badge-priority-medium';
      case 'HIGH':
        return 'badge-priority-high';
      case 'URGENT':
        return 'badge-priority-urgent';
      default:
        return 'badge-priority-medium';
    }
  }


  // ==========================
  // Due Date
  // ==========================

  isOverdue(task: Task): boolean {

    if (
      !task.dueDate ||
      task.status === 'COMPLETED'
    ) {
      return false;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(task.dueDate);

    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
  }


  isDueToday(task: Task): boolean {

    if (
      !task.dueDate ||
      task.status === 'COMPLETED'
    ) {
      return false;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(task.dueDate);

    dueDate.setHours(0, 0, 0, 0);

    return dueDate.getTime() === today.getTime();
  }


  formatDueDate(
    date?: string | null
  ): string {

    if (!date) {
      return '';
    }

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );
  }


  // ==========================
  // Refresh
  // ==========================

  refreshBoard(): void {
    this.loadTasks();
  }


  // ==========================
  // Add Task
  // ==========================

  addTask(): void {
    this.router.navigate(['/task/new']);
  }


  // ==========================
  // Track By
  // ==========================

  trackByTaskId(
    index: number,
    task: Task
  ): string {

    return task._id || index.toString();
  }
}
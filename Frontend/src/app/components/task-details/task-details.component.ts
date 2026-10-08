import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css'],
})
export class TaskDetailsComponent implements OnInit {
  task: Task | null = null;

  loading = false;
  deleting = false;
  updatingStatus = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.loadTask();
  }

  // ==========================
  // Load Task
  // ==========================

  loadTask(): void {
    const taskId = this.route.snapshot.paramMap.get('id');

    if (!taskId) {
      this.toastr.error('Task ID is missing.', 'Error');
      this.router.navigate(['/my-tasks']);
      return;
    }

    this.loading = true;

    this.taskService.getTaskById(taskId).subscribe({
      next: (task) => {
        this.task = task;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error(
          error.error?.message || 'Failed to load task.',
          'Error',
        );
        this.router.navigate(['/my-tasks']);
      },
    });
  }

  // ==========================
  // Edit Task
  // ==========================

  editTask(): void {
    if (!this.task?._id) {
      return;
    }

    this.router.navigate(['/tasks', this.task._id, 'edit']);
  }

  // ==========================
  // Change Status
  // ==========================

  changeStatus(newStatus: Task['status']): void {
    if (!this.task?._id || this.task.status === newStatus || this.updatingStatus) {
      return;
    }

    this.updatingStatus = true;
    this.taskService
      .updateTask(this.task._id, { status: newStatus })
      .subscribe({
        next: (updated) => {
          this.updatingStatus = false;
          this.task = updated;
          this.toastr.success(
            `Status updated to ${this.getStatusLabel(newStatus)}.`,
            'Success',
          );
        },
        error: (error) => {
          this.updatingStatus = false;
          console.error(error);
          this.toastr.error('Failed to update status.', 'Error');
        },
      });
  }

  // ==========================
  // Delete Task
  // ==========================

  deleteTask(): void {
    if (!this.task?._id) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${this.task.title}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    this.deleting = true;

    this.taskService.deleteTask(this.task._id).subscribe({
      next: () => {
        this.deleting = false;
        this.toastr.success('Task deleted successfully.', 'Deleted');
        this.router.navigate(['/my-tasks']);
      },
      error: (error) => {
        this.deleting = false;
        this.toastr.error(
          error.error?.message || 'Failed to delete task.',
          'Error',
        );
      },
    });
  }

  // ==========================
  // Status Labels & Classes
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

  getStatusClass(status: string): string {
    switch (status) {
      case 'TODO':
        return 'badge-status-todo';
      case 'IN_PROGRESS':
        return 'badge-status-progress';
      case 'COMPLETED':
        return 'badge-status-completed';
      default:
        return 'badge-status-todo';
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
  // Date Formatting
  // ==========================

  formatDate(date?: string | null): string {
    if (!date) {
      return 'Not specified';
    }

    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  formatDateTime(date?: string): string {
    if (!date) {
      return 'Not available';
    }

    return new Date(date).toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  // ==========================
  // Due Date Checks
  // ==========================

  isOverdue(): boolean {
    if (!this.task?.dueDate || this.task.status === 'COMPLETED') {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(this.task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
  }

  isDueToday(): boolean {
    if (!this.task?.dueDate || this.task.status === 'COMPLETED') {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(this.task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate.getTime() === today.getTime();
  }

  backToTasks(): void {
    this.router.navigate(['/my-tasks']);
  }
}

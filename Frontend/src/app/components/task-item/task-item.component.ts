import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css'],
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Input() index!: number;

  deleting = false;
  toggling = false;

  constructor(
    private taskService: TaskService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  viewTask(): void {
    this.router.navigate(['/tasks', this.task._id]);
  }

  editTask(): void {
    this.router.navigate(['/tasks', this.task._id, 'edit']);
  }

  deleteTask(): void {
    if (!this.task._id) {
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
        this.toastr.success('Task deleted successfully!', 'Success');
        this.taskService.refreshTasks();
      },
      error: (error) => {
        this.deleting = false;
        console.error(error);
        this.toastr.error('Something went wrong deleting the task.', 'Error');
      },
    });
  }

  toggleStatus(): void {
    if (!this.task._id || this.toggling) {
      return;
    }

    const newStatus: Task['status'] =
      this.task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';

    this.toggling = true;

    this.taskService
      .updateTask(this.task._id, {
        status: newStatus,
      })
      .subscribe({
        next: (updatedTask) => {
          this.toggling = false;
          this.task = updatedTask;
          const label = newStatus === 'COMPLETED' ? 'completed' : 'moved to To Do';
          this.toastr.success(`Task marked as ${label}!`, 'Success');
          this.taskService.refreshTasks();
        },
        error: (error) => {
          this.toggling = false;
          console.error(error);
          this.toastr.error('Failed to update task status.', 'Error');
        },
      });
  }

  isOverdue(): boolean {
    if (!this.task.dueDate || this.task.status === 'COMPLETED') {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(this.task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
  }

  isDueToday(): boolean {
    if (!this.task.dueDate || this.task.status === 'COMPLETED') {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(this.task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate.getTime() === today.getTime();
  }
}

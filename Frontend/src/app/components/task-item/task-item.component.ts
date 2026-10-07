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
    this.taskService.deleteTask(this.task._id!).subscribe({
      next: () => {
        this.toastr.success('Task deleted successfully!', 'Success');
      },

      error: () => {
        this.toastr.error('Something went wrong', 'Error');
      },
    });
  }

  toggleStatus(): void {
    const newStatus: Task['status'] =
      this.task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';

    const updatedTask: Task = {
      ...this.task,
      status: newStatus,
    };

    this.taskService.updateTask(this.task._id!, updatedTask).subscribe({
      next: (task) => {
        this.task = task;

        this.toastr.success('Task status updated!', 'Success');
      },

      error: () => {
        this.toastr.error('Something went wrong', 'Error');
      },
    });
  }

  isOverdue(): boolean {
    if (!this.task.dueDate || this.task.status === 'COMPLETED') {
      return false;
    }

    const today = new Date();

    const dueDate = new Date(this.task.dueDate);

    today.setHours(0, 0, 0, 0);

    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
  }
}

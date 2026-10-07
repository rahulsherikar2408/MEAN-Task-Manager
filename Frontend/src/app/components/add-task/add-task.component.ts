import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
})
export class AddTaskComponent {
  // =========================
  // Task
  // =========================

  task: Task = {
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: null,
    category: 'Other',
    tags: [],
  };

  // =========================
  // Tags Input
  // =========================

  tagsInput = '';

  // =========================
  // Loading
  // =========================

  loading = false;

  // =========================
  // Categories
  // =========================

  categories = ['Work', 'Study', 'Personal', 'Project', 'Other'];

  constructor(
    private taskService: TaskService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  // =========================
  // Add Task
  // =========================

  addTask(): void {
    // Remove unnecessary spaces

    this.task.title = this.task.title.trim();

    this.task.description = this.task.description.trim();

    // =========================
    // Title Validation
    // =========================

    if (!this.task.title) {
      this.toastr.warning('Please enter a task title.', 'Validation');

      return;
    }

    if (this.task.title.length < 3) {
      this.toastr.warning(
        'Task title must contain at least 3 characters.',
        'Validation',
      );

      return;
    }

    if (this.task.title.length > 100) {
      this.toastr.warning(
        'Task title cannot exceed 100 characters.',
        'Validation',
      );

      return;
    }

    // =========================
    // Description Validation
    // =========================

    if (this.task.description.length > 1000) {
      this.toastr.warning(
        'Description cannot exceed 1000 characters.',
        'Validation',
      );

      return;
    }

    // =========================
    // Tags
    // =========================

    this.task.tags = this.tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    // Remove duplicate tags

    this.task.tags = [...new Set(this.task.tags)];

    // =========================
    // Loading
    // =========================

    this.loading = true;

    // =========================
    // API Call
    // =========================

    this.taskService.addTask(this.task).subscribe({
      next: () => {
        this.loading = false;

        this.toastr.success('Task created successfully.', 'Success');

        // Go to My Tasks

        this.router.navigate(['/my-tasks']);
      },

      error: (error) => {
        console.error('Add Task Error:', error);

        this.loading = false;

        const message = error?.error?.message || 'Unable to create task.';

        this.toastr.error(message, 'Error');
      },
    });
  }

  // =========================
  // Cancel
  // =========================

  cancel(): void {
    this.router.navigate(['/']);
  }
}

import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {

  task: Task = {
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: null,
    category: 'Other',
    tags: []
  };

  tagsInput = '';

  loading = false;
  saving = false;

  categories = [
    'Work',
    'Study',
    'Personal',
    'Project',
    'Other'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadTask();
  }


  // ==========================
  // Load Task
  // ==========================

  loadTask(): void {

    const taskId =
      this.route.snapshot.paramMap.get('id');

    if (!taskId) {

      this.toastr.error(
        'Task ID is missing.',
        'Error'
      );

      this.router.navigate(['/my-tasks']);

      return;
    }

    this.loading = true;

    this.taskService.getTaskById(
      taskId
    ).subscribe({

      next: (task) => {

        this.task = {
          ...task,

          dueDate: task.dueDate
            ? this.formatDateForInput(task.dueDate)
            : null
        };

        this.tagsInput =
          task.tags?.join(', ') || '';

        this.loading = false;
      },

      error: (error) => {

        this.loading = false;

        this.toastr.error(
          error.error?.message || 'Failed to load task.',
          'Error'
        );

        this.router.navigate(['/my-tasks']);
      }
    });
  }


  // ==========================
  // Date For Input
  // ==========================

  private formatDateForInput(
    date: string
  ): string {

    const parsedDate = new Date(date);

    const year =
      parsedDate.getFullYear();

    const month =
      String(
        parsedDate.getMonth() + 1
      ).padStart(2, '0');

    const day =
      String(
        parsedDate.getDate()
      ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }


  // ==========================
  // Update Task
  // ==========================

  updateTask(): void {

    const taskId =
      this.route.snapshot.paramMap.get('id');

    if (!taskId) {
      return;
    }


    // Trim values

    this.task.title =
      this.task.title.trim();

    this.task.description =
      this.task.description?.trim() || '';


    // Title validation

    if (
      !this.task.title ||
      this.task.title.length < 3
    ) {

      this.toastr.warning(
        'Title must contain at least 3 characters.',
        'Validation'
      );

      return;
    }


    if (
      this.task.title.length > 100
    ) {

      this.toastr.warning(
        'Title cannot exceed 100 characters.',
        'Validation'
      );

      return;
    }


    // Description validation

    if (
      this.task.description.length > 1000
    ) {

      this.toastr.warning(
        'Description cannot exceed 1000 characters.',
        'Validation'
      );

      return;
    }


    // Process tags

    this.task.tags =
      this.tagsInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .filter(
          (tag, index, array) =>
            array.indexOf(tag) === index
        );


    this.saving = true;


    // Update

    this.taskService.updateTask(
      taskId,
      {
        title: this.task.title,
        description: this.task.description,
        status: this.task.status,
        priority: this.task.priority,
        dueDate: this.task.dueDate || null,
        category: this.task.category,
        tags: this.task.tags
      }
    ).subscribe({

      next: () => {

        this.saving = false;

        this.toastr.success(
          'Task updated successfully.',
          'Success'
        );

        this.router.navigate([
          '/tasks',
          taskId
        ]);
      },

      error: (error) => {

        this.saving = false;

        this.toastr.error(
          error.error?.message || 'Failed to update task.',
          'Error'
        );
      }
    });
  }


  // ==========================
  // Cancel
  // ==========================

  cancel(): void {

    const taskId =
      this.route.snapshot.paramMap.get('id');

    if (taskId) {

      this.router.navigate([
        '/tasks',
        taskId
      ]);

    } else {

      this.router.navigate([
        '/my-tasks'
      ]);

    }
  }
}
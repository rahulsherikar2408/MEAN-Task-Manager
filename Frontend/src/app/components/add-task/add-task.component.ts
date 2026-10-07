import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent {

  title = '';

  description = '';

  priority: Task['priority'] = 'MEDIUM';

  dueDate = '';

  category = 'Other';

  tags = '';

  constructor(
    private taskService: TaskService,
    private toastr: ToastrService
  ) {}

  addTask(): void {

    if (!this.title.trim() || !this.dueDate) {
      return;
    }

    const task: Task = {

      title: this.title.trim(),

      description: this.description.trim(),

      status: 'TODO',

      priority: this.priority,

      dueDate: this.dueDate,

      category: this.category,

      tags: this.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
    };

    this.taskService.addTask(task).subscribe({

      next: () => {

        this.toastr.success(
          'Task added successfully!',
          'Success'
        );

        this.resetForm();
      },

      error: (err) => {

        this.toastr.error(
          err.error?.message || 'Something went wrong',
          'Error'
        );
      }

    });
  }

  private resetForm(): void {

    this.title = '';

    this.description = '';

    this.priority = 'MEDIUM';

    this.dueDate = '';

    this.category = 'Other';

    this.tags = '';
  }
}
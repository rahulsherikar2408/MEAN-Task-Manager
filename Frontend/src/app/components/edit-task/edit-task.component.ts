import {
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { ToastrService } from 'ngx-toastr';

import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';


@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent
  implements OnInit {

  taskId!: string;

  loading = true;

  saving = false;

  tagsInput = '';

  task: Task = {
    title: '',
    description: '',
    status: 'TODO',
    priority: 'MEDIUM',
    dueDate: null,
    category: 'Other',
    tags: []
  };


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private toastr: ToastrService
  ) {}


  ngOnInit(): void {

    this.taskId =
      this.route.snapshot.paramMap.get('id')!;

    this.loadTask();

  }


  loadTask(): void {

    this.loading = true;

    this.taskService
      .getTaskById(this.taskId)
      .subscribe({

        next: (task) => {

          this.task = {
            ...task,

            dueDate: task.dueDate
              ? task.dueDate.substring(0, 10)
              : null
          };

          // Convert tags array to input string
          this.tagsInput =
            task.tags?.join(', ') || '';

          this.loading = false;

        },

        error: (error) => {

          this.loading = false;

          this.toastr.error(
            error.error?.message ||
            'Unable to load task.',
            'Error'
          );

          this.router.navigate([
            '/my-tasks'
          ]);

        }

      });

  }


  updateTask(): void {

    if (!this.task.title.trim()) {

      this.toastr.error(
        'Task title is required.',
        'Validation Error'
      );

      return;

    }


    this.saving = true;


    // Convert comma-separated tags into an array
    const tags = this.tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);


    const updatedTask: Partial<Task> = {

      title: this.task.title.trim(),

      description:
        this.task.description?.trim() || '',

      status: this.task.status,

      priority: this.task.priority,

      dueDate: this.task.dueDate || null,

      category:
        this.task.category?.trim() || 'Other',

      tags: tags

    };


    this.taskService
      .updateTask(
        this.taskId,
        updatedTask
      )
      .subscribe({

        next: () => {

          this.saving = false;

          this.toastr.success(
            'Task updated successfully!',
            'Success'
          );

          this.router.navigate([
            '/tasks',
            this.taskId
          ]);

        },

        error: (error) => {

          this.saving = false;

          this.toastr.error(
            error.error?.message ||
            'Unable to update task.',
            'Error'
          );

        }

      });

  }


  cancel(): void {

    this.router.navigate([
      '/tasks',
      this.taskId
    ]);

  }

}
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
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent
  implements OnInit {

  taskId!: string;

  task?: Task;

  loading = true;

  deleting = false;


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

    this.taskService
      .getTaskById(this.taskId)
      .subscribe({

        next: (task) => {

          this.task = task;

          this.loading = false;

        },

        error: (error) => {

          this.loading = false;

          this.toastr.error(
            error.error?.message ||
            'Task not found.',
            'Error'
          );

          this.router.navigate([
            '/my-tasks'
          ]);

        }

      });

  }


  editTask(): void {

    this.router.navigate([
      '/tasks',
      this.taskId,
      'edit'
    ]);

  }


  deleteTask(): void {

    if (!this.task) {
      return;
    }


    const confirmed =
      window.confirm(
        'Are you sure you want to delete this task?'
      );


    if (!confirmed) {
      return;
    }


    this.deleting = true;


    this.taskService
      .deleteTask(this.taskId)
      .subscribe({

        next: () => {

          this.toastr.success(
            'Task deleted successfully!',
            'Success'
          );

          this.router.navigate([
            '/my-tasks'
          ]);

        },

        error: (error) => {

          this.deleting = false;

          this.toastr.error(
            error.error?.message ||
            'Unable to delete task.',
            'Error'
          );

        }

      });

  }


  changeStatus(
    status: Task['status']
  ): void {

    if (!this.task) {
      return;
    }


    this.taskService
      .updateTask(
        this.taskId,
        { status }
      )
      .subscribe({

        next: (updatedTask) => {

          this.task = updatedTask;

          this.toastr.success(
            'Task status updated!',
            'Success'
          );

        },

        error: () => {

          this.toastr.error(
            'Unable to update status.',
            'Error'
          );

        }

      });

  }


  goBack(): void {

    this.router.navigate([
      '/my-tasks'
    ]);

  }


  isOverdue(): boolean {

    if (
      !this.task?.dueDate ||
      this.task.status === 'COMPLETED'
    ) {
      return false;
    }


    const today = new Date();

    const dueDate =
      new Date(this.task.dueDate);


    today.setHours(0, 0, 0, 0);

    dueDate.setHours(0, 0, 0, 0);


    return dueDate < today;

  }

}
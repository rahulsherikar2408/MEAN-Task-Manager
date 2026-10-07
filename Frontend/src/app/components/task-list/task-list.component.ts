import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject, Subscription } from 'rxjs';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { TaskService, TaskFilters } from '../../services/task.service';

import { Task } from '../../models/task';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit, OnDestroy {
  // =========================
  // Tasks
  // =========================

  tasks: Task[] = [];

  // =========================
  // Search
  // =========================

  searchText = '';

  private searchSubject = new Subject<string>();

  private searchSubscription!: Subscription;

  // =========================
  // Filters
  // =========================

  statusFilter = 'All';

  priorityFilter = 'All';

  categoryFilter = 'All';

  dueFrom = '';

  dueTo = '';

  overdueOnly = false;

  // =========================
  // Sorting
  // =========================

  sortBy = 'createdAt';

  sortOrder: 'asc' | 'desc' = 'desc';

  // =========================
  // Categories
  // =========================
  today = new Date().toISOString().split('T')[0];
  categories = ['Work', 'Study', 'Personal', 'Project', 'Other'];

  // =========================
  // Loading
  // =========================

  loading = false;

  // =========================
  // Pagination
  // =========================

  currentPage = 1;

  pageSize = 10;

  totalTasks = 0;

  totalPages = 0;

  // =========================
  // Constructor
  // =========================

  constructor(
    private taskService: TaskService,
    private toastr: ToastrService,
  ) {}

  // =========================
  // ngOnInit
  // =========================

  ngOnInit(): void {
    this.loadTasks();

    // Search debounce

    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.currentPage = 1;

        this.loadTasks();
      });

    // Refresh when task changes

    this.taskService.refreshRequired$.subscribe(() => {
      this.loadTasks();
    });
  }

  // =========================
  // Load Tasks
  // =========================

  loadTasks(): void {
    this.loading = true;

    const filters: TaskFilters = {
      search: this.searchText,

      status: this.statusFilter,

      priority: this.priorityFilter,

      category: this.categoryFilter,

      dueFrom: this.dueFrom,

      dueTo: this.dueTo,

      overdue: this.overdueOnly,

      sortBy: this.sortBy,

      sortOrder: this.sortOrder,

      page: this.currentPage,

      limit: this.pageSize,
    };

    this.taskService.getTasks(filters).subscribe({
      next: (response) => {
        this.tasks = response.tasks;

        this.currentPage = response.pagination.page;

        this.totalTasks = response.pagination.totalTasks;

        this.totalPages = response.pagination.totalPages;

        this.loading = false;
      },

      error: (error) => {
        console.error('Error loading tasks:', error);

        this.loading = false;

        this.toastr.error('Unable to load tasks.', 'Error');
      },
    });
  }

  // =========================
  // Search
  // =========================

  onSearchChange(): void {
    this.searchSubject.next(this.searchText);
  }

  // =========================
  // Apply Filters
  // =========================

  applyFilters(): void {
    this.currentPage = 1;

    this.loadTasks();
  }

  // =========================
  // Sorting
  // =========================

  changeSort(): void {
    this.currentPage = 1;

    this.loadTasks();
  }

  // =========================
  // Reset Filters
  // =========================

  resetFilters(): void {
    this.searchText = '';

    this.statusFilter = 'All';

    this.priorityFilter = 'All';

    this.categoryFilter = 'All';

    this.dueFrom = '';

    this.dueTo = '';

    this.overdueOnly = false;

    this.sortBy = 'createdAt';

    this.sortOrder = 'desc';

    this.currentPage = 1;

    this.loadTasks();
  }

  // =========================
  // Previous Page
  // =========================

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;

      this.loadTasks();
    }
  }

  // =========================
  // Next Page
  // =========================

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;

      this.loadTasks();
    }
  }

  // =========================
  // Go To Page
  // =========================

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;

      this.loadTasks();
    }
  }

  // =========================
  // Page Numbers
  // =========================

  getPages(): number[] {
    return Array.from(
      {
        length: this.totalPages,
      },
      (_, index) => index + 1,
    );
  }

  // =========================
  // Delete Task
  // =========================

  deleteTask(id: string): void {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.toastr.success('Task deleted successfully.', 'Success');

        // If last task on current page
        // was deleted

        if (this.tasks.length === 1 && this.currentPage > 1) {
          this.currentPage--;
        }

        this.loadTasks();
      },

      error: (error) => {
        console.error('Delete Task Error:', error);

        this.toastr.error('Unable to delete task.', 'Error');
      },
    });
  }

  // =========================
  // Cleanup
  // =========================

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }
}

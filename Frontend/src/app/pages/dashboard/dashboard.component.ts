import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DashboardData } from '../../models/dashboard';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  dashboard?: DashboardData;
  loading = true;

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private toastr: ToastrService,
    public authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;

    this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.dashboard = data;
        this.loading = false;
      },
      error: (error) => {
        console.error(error);
        this.loading = false;
        this.toastr.error(
          error.error?.message || 'Unable to load dashboard.',
          'Error',
        );
      },
    });
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good morning';
    }
    if (hour < 18) {
      return 'Good afternoon';
    }
    return 'Good evening';
  }

  getUserName(): string {
    const user = this.authService.getUser();
    return user?.name || 'there';
  }

  viewTask(id: string): void {
    this.router.navigate(['/tasks', id]);
  }

  createTask(): void {
    this.router.navigate(['/task/new']);
  }

  getCompletionPercentage(): number {
    if (!this.dashboard || this.dashboard.stats.total === 0) {
      return 0;
    }

    return Math.round(
      (this.dashboard.stats.completed / this.dashboard.stats.total) * 100,
    );
  }
}

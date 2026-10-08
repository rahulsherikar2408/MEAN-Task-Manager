import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    if (!this.email.trim() || !this.password) {
      this.toastr.error('Please fill in all required fields.', 'Error');
      return;
    }

    this.loading = true;

    this.authService
      .login({
        email: this.email.trim(),
        password: this.password,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.toastr.success('Welcome back! Login successful.', 'Success');
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loading = false;
          this.toastr.error(
            err.error?.message || 'Invalid email or password',
            'Login Failed',
          );
        },
      });
  }
}

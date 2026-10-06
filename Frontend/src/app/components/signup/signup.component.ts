import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  signup(): void{
    if (
      !this.name.trim() ||
      !this.email.trim() ||
      !this.password ||
      !this.confirmPassword
    ) {

      this.toastr.error(
        'Please fill all fields.',
        'Error'
      );

      return;
    }

    if(this.password !== this.confirmPassword){
      this.toastr.error(
        'Passwords do not match.',
        'Error'
      );

      return;
    }

    this.loading = true

    this.authService.signup({
      name: this.name.trim(),
      email: this.email.trim(),
      password: this.password
    }).subscribe({
      next: () => {
        this.loading = false
        this.toastr.success(
          'Account created successfully!',
          'Success'
        );
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(
          err.error?.message || 'Signup failed.',
          'Error'
        );
      }
    });

  }
  
}

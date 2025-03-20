import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [NgIf, FormsModule]
})
export class SignupComponent {
  email = '';
  password = '';
  confirmPassword = '';
  tel = '';
  role = 'STUDENT';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  signup() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    this.isLoading = true;
    const userData = {
      email: this.email,
      password: this.password,
      tel: this.tel,
      role: this.role
    };

    this.authService.signup(userData).subscribe({
      next: () => {
        this.successMessage = 'Signup successful! Redirecting to home...';
        setTimeout(() => {
          this.router.navigate(['/home']); // ✅ Redirecționează direct către home
        }, 2000);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error.error || 'Signup failed!';
        this.isLoading = false;
      }
    });
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  switchToLogin() {
    this.router.navigate(['/login']);
  }
}

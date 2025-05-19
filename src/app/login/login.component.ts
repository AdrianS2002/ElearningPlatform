import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { GeolocComponent } from '../geoloc/geoloc.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [NgIf, FormsModule, GeolocComponent] 
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  userLocation: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.isLoading = true;
    const credentials = { email: this.email, password: this.password };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log("✅ Login response:", response);
        this.router.navigate(['/home']); // ✅ Navigăm către home
        this.successMessage = 'Login successful!';
        sessionStorage.setItem('user', JSON.stringify(response.user));
        console.log("User data saved in sessionStorage:", response.user);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error.error || 'Login failed!';
        this.isLoading = false;
      }
    });
  }

  onLocationSaved(location: string) {
    this.userLocation = location;
    console.log("📍 Location received in login:", location);
  }

  clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }
}

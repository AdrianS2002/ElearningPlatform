import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { routes } from '../app.routes';
import { HomeComponent } from '../home/home.component';
import { Router } from '@angular/router';
import { GeolocComponent } from '../geoloc/geoloc.component';


@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [NgIf, FormsModule, GeolocComponent] // Adăugăm modulele necesare
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;
  userLocation: string = '';

  constructor(private authService: AuthService,  private router: Router) {}

  login() {
    this.isLoading = true;
    const credentials = { email: this.email, password: this.password };
    this.authService.login(credentials).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token); // Salvează token-ul JWT
        localStorage.setItem('role', response.role); // Salvează rolul utilizatorului
        localStorage.setItem('email', this.email); // Salvează email-ul utilizatorului
        this.authService.setAuthStatus(true);
        this.router.navigate(['/home']);
        this.successMessage = 'Login successful!';
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

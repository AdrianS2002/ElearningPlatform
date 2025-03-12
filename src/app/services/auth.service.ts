import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/auth'; // URL-ul backend-ului

  private http = inject(HttpClient);

  // Obține token-ul salvat în localStorage
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());
  authStatus$ = this.authStatus.asObservable(); // Observable pentru componente


  // Metodă pentru Signup
  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData, { headers: this.getAuthHeaders() });
  }

  // Metodă pentru Login
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, { headers: this.getAuthHeaders() });
  }

  // Metodă pentru Logout
  logout(): void {
    localStorage.removeItem('token'); // Șterge token-ul din localStorage
    localStorage.removeItem('role');  // Șterge rolul utilizatorului (dacă este salvat)
    this.setAuthStatus(false); // Emite schimbarea de stare (utilizator delogat)
  }

  // Metodă pentru verificarea autentificării
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token'); // Dacă există un token, utilizatorul este logat
  }

  // Metodă pentru setarea autentificării după login
  setAuthStatus(isAuthenticated: boolean) {
    this.authStatus.next(isAuthenticated); // Emite schimbarea de stare (utilizator logat)
  }
}

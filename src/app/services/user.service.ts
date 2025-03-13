import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5000/users';

  constructor(private http: HttpClient) {}

  // Get all users
  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Get a user by ID
  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Create a new user
  createUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }


  isAuthenticated(): boolean {
    return !!localStorage.getItem('token'); // Dacă există token, utilizatorul este logat
  }

  // Update a user
  updateUser(id: string, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user);
  }

  // Delete a user
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // ✅ Add method to retrieve the user ID from JWT token
  getUserId(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    // Decode JWT to extract user ID
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || null;
  }

  // ✅ Add method to retrieve user role
  getUserRole(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  }
}

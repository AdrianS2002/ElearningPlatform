import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/auth';
  private http = inject(HttpClient);

  private authStatus = new BehaviorSubject<boolean>(false);
  authStatus$ = this.authStatus.asObservable();

  private userRole = new BehaviorSubject<string | null>(null);
  userRole$ = this.userRole.asObservable();

  constructor() {
    this.checkSession().subscribe({
      next: (response: any) => { // ✅ Verificăm structura răspunsului
        console.log("✅ Sesiune activă:", response);
        const user = response.user; // ✅ Extragem utilizatorul
        if (user) {
          this.authStatus.next(true);
          this.userRole.next(user.role); // 🔥 Stocăm rolul utilizatorului
        }
      },
      error: () => {
        console.log("❌ Nicio sesiune activă.");
        this.authStatus.next(false);
      }
    });
  }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, userData, { withCredentials: true });
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
      tap((response: any) => { // ✅ Extragem utilizatorul din răspuns
        console.log("🔹 Login Response:", response);
        const user = response.user;
        if (user) {
          this.authStatus.next(true);
          this.userRole.next(user.role); // ✅ Setăm rolul
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.authStatus.next(false);
        this.userRole.next(null);
      })
    );
  }

  checkSession(): Observable<any> {
    return this.http.get(`${this.apiUrl}/session`, { withCredentials: true });
  }

  getUserRole(): Observable<string | null> {
    return this.userRole$.pipe();
  }

  isAuthenticated(): Observable<boolean> {
    return this.authStatus$;
  }
}

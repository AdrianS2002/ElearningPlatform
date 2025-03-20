import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:5000/users';
  private authUrl = 'http://localhost:5000/auth/session'; // ✅ Endpoint pentru sesiune

  constructor(private http: HttpClient) {}

  // ✅ Obține datele utilizatorului din sesiunea activă
  getSessionUser(): Observable<any> {
    return new Observable<any>((observer) => {
      this.http.get(this.authUrl, { withCredentials: true }).subscribe({
        next: (user) => {
          console.log("🔍 Session User:", user); // ✅ Debugging
          observer.next(user);
          observer.complete();
        },
        error: (err) => {
          console.error("❌ Session error:", err);
          observer.next(null);
          observer.complete();
        },
      });
    });
  }

  // ✅ Verifică dacă utilizatorul este autentificat prin sesiune
  isAuthenticated(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.getSessionUser().subscribe({
        next: (user) => {
          observer.next(!!user); // ✅ Dacă primim un user, înseamnă că este logat
          observer.complete();
        },
        error: () => {
          observer.next(false);
          observer.complete();
        },
      });
    });
  }

  getUserId(): Observable<string | null> {
    return this.getSessionUser().pipe(
      map(response => {
        console.log("🔍 Extracted User ID:", response?.user?.id);
        return response?.user?.id || null;
      })
    );
  }
  getUserRole(): Observable<string | null> {
    return this.getSessionUser().pipe(
      map(response => {
        console.log("🔍 Extracted User Role:", response?.user?.role); 
        return response?.user?.role || null;
      })
    );
  }

  // 🔹 Obține toți utilizatorii
  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // 🔹 Obține utilizatorul după ID
  getUserById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // 🔹 Creează un utilizator nou
  createUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  // 🔹 Actualizează un utilizator
  updateUser(id: string, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, user);
  }

  // 🔹 Șterge un utilizator
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

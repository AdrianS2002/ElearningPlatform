import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = 'http://localhost:5000/courses';
  private enrollmentsUrl = 'http://localhost:5000/enrollments';
  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    console.log("🔹 Token sent in request:", token);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    });
  }

  // ✅ Log request URL & Headers before making the request
  private logRequest(endpoint: string) {
    console.log(`🔹 Sending request to: ${this.apiUrl}/${endpoint}`);
  }

  getEnrolledCourses(studentId: string): Observable<any> {
    return this.http.get(`${this.enrollmentsUrl}/student/${studentId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getCourses(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getCourseById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createCourse(course: any): Observable<any> {
    return this.http.post(this.apiUrl, course, { headers: this.getAuthHeaders() });
  }

  updateCourse(id: string, course: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, course, { headers: this.getAuthHeaders() });
  }

  deleteCourse(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  enrollStudent(courseId: string, studentId: string): Observable<any> {
    return this.http.post(
      this.enrollmentsUrl,
      { courses_id: courseId, student_id: studentId },
      { headers: this.getAuthHeaders() }
    );
  }
  unenrollStudent(courseId: string, studentId: string): Observable<any> {
    return this.http.delete(`${this.enrollmentsUrl}/${courseId}/${studentId}`, {
        headers: this.getAuthHeaders()
    });
}

}

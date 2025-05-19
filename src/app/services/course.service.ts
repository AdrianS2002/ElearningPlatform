import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = 'http://localhost:5000/courses';
  private enrollmentsUrl = 'http://localhost:5000/enrollments';
  private userService = inject(UserService);
  constructor(private http: HttpClient ) {}

  //  Log request URL before making the request
  private logRequest(endpoint: string) {
    console.log(`🔹 Sending request to: ${this.apiUrl}/${endpoint}`);
  }

  getEnrolledCourses(studentId: string): Observable<any> {
    return this.http.get(`${this.enrollmentsUrl}/student/${studentId}`, {
      withCredentials: true 
    });
  }

  getCourses(): Observable<any> {
    return this.http.get(this.apiUrl, { withCredentials: true });
  }

  getCourseById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  createCourse(course: any): Observable<any> {
    return this.userService.getUserId().pipe(
      tap((userId) => {
        if (!userId) {
          console.error(" User ID is missing. Cannot create course.");
          throw new Error("User ID is required to create a course.");
        }
        course.user_id = userId; //  Adaugă user_id doar după extragere
        console.log(" Sending Course Data with User ID:", course);
      }),
      switchMap(() => this.http.post(this.apiUrl, course, { withCredentials: true }))
    );
  }

  updateCourse(id: string, course: any): Observable<any> {
    return this.userService.getSessionUser().pipe( // 🔹 Obține utilizatorul din sesiune
      switchMap((user) => {
        if (!user || !user.user || !user.user.id) { 
          console.error(" User ID is missing. Cannot update course.");
          return throwError(() => new Error("User ID is required to update a course."));
        }
        course.user_id = user.user.id; //  Folosește ID-ul din sesiune
        console.log(" Updating Course Data with User ID:", course);
        return this.http.put(`${this.apiUrl}/${id}`, course, { withCredentials: true });
      })
    );
}


  deleteCourse(id: string): Observable<any> {
    return this.userService.getUserId().pipe(
      switchMap((userId) => {
        if (!userId) {
          console.error(" User ID is missing. Cannot delete course.");
          return throwError(() => new Error("User ID is required to delete a course."));
        }
        console.log(` Deleting course: ${id} by User: ${userId}`);
        return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
      })
    );
  }

  enrollStudent(courseId: string, studentId: string): Observable<any> {
    console.log(`🔹 Enrolling Student: ${studentId} in Course: ${courseId}`);

    return this.http.post(
      this.enrollmentsUrl,
      { courses_id: courseId, student_id: studentId },
      { withCredentials: true } //  Trimitere sesiune către backend
    ).pipe(
      tap(response => console.log(" Enrollment Response:", response)),
      catchError(error => {
        console.error(" Enrollment Error:", error);
        return throwError(() => new Error(error.error?.error || "Enrollment failed!"));
      })
    );
  }

  unenrollStudent(courseId: string, studentId: string): Observable<any> {
    return this.http.delete(`${this.enrollmentsUrl}/${courseId}/${studentId}`, {
      withCredentials: true // Trimitere sesiune
    });
  }
}

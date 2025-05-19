import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError, tap } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class EnrollmentService {
  private enrollmentsUrl = 'http://localhost:5000/enrollments';
  private userService = inject(UserService);

  constructor(private http: HttpClient) {}

  //  Obține toate înrolările (pentru admin sau statistică globală)
  getAllEnrollments(): Observable<any> {
    console.log('🔹 Getting all enrollments');
    return this.http.get(this.enrollmentsUrl, { withCredentials: true });
  }


  getEnrollmentsByStudent(studentId: string): Observable<any> {
    console.log(`🔹 Getting enrollments for student: ${studentId}`);
    return this.http.get(`${this.enrollmentsUrl}/student/${studentId}`, { withCredentials: true });
  }

  getEnrollmentsByCourse(courseId: string): Observable<any> {
    console.log(`🔹 Getting enrollments for course: ${courseId}`);
    return this.http.get(`${this.enrollmentsUrl}/course/${courseId}`, { withCredentials: true });
  }

  //  Înrolează un student într-un curs
  enrollStudent(courseId: string, studentId: string): Observable<any> {
    console.log(` Enrolling student ${studentId} in course ${courseId}`);
    return this.http.post(
      this.enrollmentsUrl,
      { courses_id: courseId, student_id: studentId },
      { withCredentials: true }
    ).pipe(
      tap(response => console.log(' Enrollment response:', response)),
      catchError((error) => {
        console.error(' Enrollment error:', error);
        return throwError(() => new Error(error.error?.error || 'Enrollment failed!'));
      })
    );
  }

  //  Dezînrolează un student dintr-un curs
  unenrollStudent(courseId: string, studentId: string): Observable<any> {
    console.log(` Unenrolling student ${studentId} from course ${courseId}`);
    return this.http.delete(`${this.enrollmentsUrl}/${courseId}/${studentId}`, {
      withCredentials: true,
    }).pipe(
      tap(response => console.log(' Unenroll response:', response)),
      catchError((error) => {
        console.error(' Unenroll error:', error);
        return throwError(() => new Error(error.error?.error || 'Unenroll failed!'));
      })
    );
  }
}

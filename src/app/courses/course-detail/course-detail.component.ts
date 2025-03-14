import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { NgFor, NgIf } from '@angular/common';


@Component({
  selector: 'app-course-detail',
  imports: [NgIf],
  standalone: true,
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css',
  
})
export class CourseDetailComponent implements OnInit {
  course: any;
  isAuthenticated: boolean = false;
  isStudent: boolean = false;
  isProfessor: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private userService: UserService,
    public router: Router
  ) {}

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');

    // ✅ Verificăm autentificarea și rolul utilizatorului
    this.isAuthenticated = !!this.userService.getUserId();
    const role = this.userService.getUserRole();

    if (role === 'STUDENT') {
      this.isStudent = true;
    } else if (role === 'PROFESOR') {
      this.isProfessor = true;
    }

    // ✅ Obține detaliile cursului
    if (courseId) {
      this.courseService.getCourseById(courseId).subscribe((course) => {
        this.course = course;
      });
    }
  }
  showSuccessMessage(message: string) {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 3000); // ✅ Mesajul dispare după 3 secunde
  }

  showErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', 3000);
  }
  loadCourse() {
    const courseId = this.route.snapshot.paramMap.get('id');
    if(courseId)
    {
      this.courseService.getCourseById(courseId).subscribe((course)=>{this.course = course;});
    }
  }
  enroll(courseId: string) {
    const studentId = this.userService.getUserId();
    if (!studentId) {
      this.showErrorMessage('Please log in to enroll in a course.');
      return;
    }
    this.courseService.enrollStudent(courseId, studentId).subscribe({
      next: () => {
          this.showSuccessMessage('Enrollment successful!');
          this.loadCourse(); // ✅ Reîncărcăm lista cursurilor pentru a actualiza available_slots
      },
      error: (err) => {
        console.error('Enrollment error:', err); // ✅ Log pentru debugging
        const errorMessage = err.error?.message || 'An error occurred during enrollment.';
        this.showErrorMessage(errorMessage); // ✅ Afișează mesajul corect
    },
  });
  }

  unenroll(courseId: string) {
    const studentId = this.userService.getUserId();
    if (!studentId) {
      this.showErrorMessage('Please log in to unenroll from a course.');
      return;
    }
    this.courseService.unenrollStudent(courseId, studentId).subscribe({
      next: () => {
          this.showSuccessMessage('Unenrollment successful!');
          this.loadCourse(); // ✅ Reîncărcăm lista cursurilor
      },
      error: (err) => {
        console.error('Enrollment error:', err); // ✅ Log pentru debugging
        const errorMessage = err.error?.message || 'An error occurred during enrollment.';
        this.showErrorMessage(errorMessage); // ✅ Afișează mesajul corect
    },
  });
  }

  editCourse(courseId: string) {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/edit-course', courseId]);
  }

  deleteCourse(courseId: string) {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }

    console.log(`Deleting course: ${courseId}`);
    // Adaugă logica pentru ștergere
  }

  stats(courseId: string) {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/course-stats', courseId]);
  }
}

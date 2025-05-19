import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../services/course.service';
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

   
    this.userService.isAuthenticated().subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
    });

  
    this.userService.getUserRole().subscribe((role) => {
      this.isProfessor = role === 'PROFESOR';
      this.isStudent = role === 'STUDENT';
    });

    
    if (courseId) {
      this.loadCourse(courseId);
    }
  }

  loadCourse(courseId: string) {
    this.courseService.getCourseById(courseId).subscribe({
      next: (course) => {
        this.course = course;
      },
      error: (err) => console.error('Error loading course:', err),
    });
  }

  enroll(courseId: string) {
    this.userService.getUserId().subscribe((studentId) => {
      if (!studentId) {
        this.showErrorMessage('Please log in to enroll in a course.');
        return;
      }

      this.courseService.enrollStudent(courseId, studentId).subscribe({
        next: () => {
          this.showSuccessMessage('Enrollment successful!');
          this.loadCourse(courseId); 
        },
        error: (err) => {
          console.error('Enrollment error:', err);
          const errorMessage = err.error?.message || 'An error occurred during enrollment.';
          this.showErrorMessage(errorMessage);
        },
      });
    });
  }

  unenroll(courseId: string) {
    this.userService.getUserId().subscribe((studentId) => {
      if (!studentId) {
        this.showErrorMessage('Please log in to unenroll from a course.');
        return;
      }

      this.courseService.unenrollStudent(courseId, studentId).subscribe({
        next: () => {
          this.showSuccessMessage('Unenrollment successful!');
          this.loadCourse(courseId); 
        },
        error: (err) => {
          console.error('Unenrollment error:', err);
          const errorMessage = err.error?.message || 'An error occurred during unenrollment.';
          this.showErrorMessage(errorMessage);
        },
      });
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

  showSuccessMessage(message: string) {
    this.successMessage = message;
    setTimeout(() => (this.successMessage = ''), 3000);
  }

  showErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => (this.errorMessage = ''), 3000);
  }
}

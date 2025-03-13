import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/course.service';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit {
  courses: any[] = [];
  isProfessor = false;
  isStundent = false;
  isAuthenticated = false;

  constructor(
    private courseService: CourseService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCourses();
    this.isAuthenticated = this.userService.isAuthenticated(); 
    this.isProfessor = this.isAuthenticated && this.userService.getUserRole() === 'PROFESOR';
    this.isStundent = this.isAuthenticated && this.userService.getUserRole() === 'STUDENT';
  }

  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses = data.map((course: { start_date: string; end_date: string }) => ({
          ...course,
          start_date: this.formatDate(course.start_date),
          end_date: this.formatDate(course.end_date)
        }));
      },
      error: (err) => console.error(err),
    });
  }

  addCourse() {
    this.router.navigate(['/add-course']);
  }

  editCourse(courseId: string) {
    this.router.navigate(['/edit-course', courseId]);
  }

  deleteCourse(courseId: string) {
    this.courseService.deleteCourse(courseId).subscribe(() => {
      this.loadCourses();
    });
  }

  stats(courseId: string) {
    this.router.navigate(['/course-stats', courseId]);
  }

  enroll(courseId: string) {
    const studentId = this.userService.getUserId();
    if (!studentId) {
      alert('Please log in to enroll in a course.');
      return;
    }
    this.courseService.enrollStudent(courseId, studentId).subscribe({
      next: () => alert('Enrollment successful!'),
      error: (err) => alert(err.error),
    });
  }
  filter()
  {
    this.router.navigate(['/filter']);
  }
  unenroll(courseId: string) {
    const studentId = this.userService.getUserId();
    if (!studentId) {
      alert('Please log in to unenroll from a course.');
      return;
    }
    this.courseService.unenrollStudent(courseId, studentId).subscribe({
      next: () => alert('Unenrollment successful!'),
      error: (err) => alert(err.error),
    });
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const mm = ('0' + (date.getMonth() + 1)).slice(-2); // Luna
    const dd = ('0' + date.getDate()).slice(-2); // Ziua
    const yyyy = date.getFullYear(); // Anul
    return `${mm}.${dd}.${yyyy}`; // Format LL.ZZ.AAAA
  }
}

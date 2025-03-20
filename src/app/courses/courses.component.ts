import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/course.service';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { UserService } from '../services/user.service';
import { FilterComponent } from "../filter/filter.component";

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [NgIf, NgFor, FilterComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit {
  courses: any[] = [];
  allCourses: any[] = [];
  isProfessor = false;
  isStundent = false;
  isAuthenticated = false;
  successMessage: string = '';
  errorMessage: string = '';
  userId: string | null = null;
  showFilter: boolean = false;


  constructor(
    private courseService: CourseService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCourses();

    this.userService.isAuthenticated().subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
    });

    this.userService.getUserRole().subscribe((role) => {
      this.isProfessor = role === 'PROFESOR';
      this.isStundent = role === 'STUDENT';
    });

    this.userService.getUserId().subscribe((userId) => {
      this.userId = userId;
    });
  }


  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.allCourses = data.map((course: { start_date: string; end_date: string }) => ({
          ...course,
          start_date: this.formatDate(course.start_date), 
          end_date: this.formatDate(course.end_date)
        }));
        this.courses = [...this.allCourses]; 
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
    console.log(" Enrolling in course:", courseId);
    console.log(" User ID:", this.userId);
    this.userService.getUserId().subscribe((studentId) => {
      if (!studentId) {
        this.showErrorMessage('Please log in to enroll in a course.');
        return;
      }

      this.courseService.enrollStudent(courseId, studentId).subscribe({
        next: () => {
          this.showSuccessMessage('Enrollment successful!');
          this.loadCourses(); 
        },
        error: (err) => {
          console.error('Enrollment error:', err);
          const errorMessage = err.error?.message || 'An error occurred during enrollment.';
          this.showErrorMessage(errorMessage);
        },
      });
    });
  }

  toggleFilterPopup() {
    this.showFilter = !this.showFilter;
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
          this.loadCourses();
        },
        error: (err) => {
          console.error('Unenrollment error:', err);
          const errorMessage = err.error?.message || 'An error occurred during unenrollment.';
          this.showErrorMessage(errorMessage);
        },
      });
    });
  }


  goToLogin() {
    this.router.navigate(['/login']);
  }

  showSuccessMessage(message: string) {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 3000); 
  }

  showErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', 3000);
  }

  formatDate(dateString: string): string {
    if (!dateString) return ''; 

    const date = new Date(dateString);
    const mm = ('0' + (date.getMonth() + 1)).slice(-2); 
    const dd = ('0' + date.getDate()).slice(-2); 
    const yyyy = date.getFullYear(); 

    return `${mm}.${dd}.${yyyy}`; 
  }

  applyCourseFilter(filterData: { domains: string[], startDate: string, endDate: string }) {
    this.courseService.getCourses().subscribe({
      next: (courses: any[]) => {
        this.courses = courses.filter(course => {
          const matchesDomain = filterData.domains.length === 0 || filterData.domains.includes(course.domain);

          
          const formattedCourseStart = this.formatDate(course.start_date);
          const formattedCourseEnd = this.formatDate(course.end_date);

          
          const formattedStartDate = filterData.startDate ? this.formatDate(filterData.startDate) : '';
          const formattedEndDate = filterData.endDate ? this.formatDate(filterData.endDate) : '';

          
          const startMatches = !formattedStartDate || formattedCourseStart >= formattedStartDate;
          const endMatches = !formattedEndDate || formattedCourseEnd <= formattedEndDate;

          return matchesDomain && startMatches && endMatches;
        });
      },
      error: (err) => console.error('Error filtering courses:', err),
    });
  }




}

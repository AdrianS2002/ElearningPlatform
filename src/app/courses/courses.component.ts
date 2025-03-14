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
    this.isAuthenticated = this.userService.isAuthenticated();
    this.isProfessor = this.isAuthenticated && this.userService.getUserRole() === 'PROFESOR';
    this.isStundent = this.isAuthenticated && this.userService.getUserRole() === 'STUDENT';
    this.userId = this.userService.getUserId(); 
  }

  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.allCourses = data.map((course: { start_date: string; end_date: string }) => ({
          ...course,
          start_date: this.formatDate(course.start_date), // ✅ Conversie corectă
          end_date: this.formatDate(course.end_date)
        }));
        this.courses = [...this.allCourses]; // ✅ Inițial, afișăm toate cursurile
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
      this.showErrorMessage('Please log in to enroll in a course.');
      return;
    }
    this.courseService.enrollStudent(courseId, studentId).subscribe({
      next: () => {
          this.showSuccessMessage('Enrollment successful!');
          this.loadCourses(); // ✅ Reîncărcăm lista cursurilor pentru a actualiza available_slots
      },
      error: (err) => {
        console.error('Enrollment error:', err); // ✅ Log pentru debugging
        const errorMessage = err.error?.message || 'An error occurred during enrollment.';
        this.showErrorMessage(errorMessage); // ✅ Afișează mesajul corect
    },
  });
  }
  toggleFilterPopup() {
    this.showFilter = !this.showFilter;
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
          this.loadCourses(); // ✅ Reîncărcăm lista cursurilor
      },
      error: (err) => {
        console.error('Enrollment error:', err); // ✅ Log pentru debugging
        const errorMessage = err.error?.message || 'An error occurred during enrollment.';
        this.showErrorMessage(errorMessage); // ✅ Afișează mesajul corect
    },
  });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  showSuccessMessage(message: string) {
    this.successMessage = message;
    setTimeout(() => this.successMessage = '', 3000); // ✅ Mesajul dispare după 3 secunde
  }

  showErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => this.errorMessage = '', 3000);
  }

  formatDate(dateString: string): string {
    if (!dateString) return ''; // Dacă nu există dată, returnăm un string gol
    
    const date = new Date(dateString);
    const mm = ('0' + (date.getMonth() + 1)).slice(-2); // Luna (01-12)
    const dd = ('0' + date.getDate()).slice(-2); // Ziua (01-31)
    const yyyy = date.getFullYear(); // Anul (2024)
  
    return `${mm}.${dd}.${yyyy}`; // Returnăm formatul corect MM.DD.YYYY
  }
  
  applyCourseFilter(filterData: { domains: string[], startDate: string, endDate: string }) {
    this.courseService.getCourses().subscribe({
      next: (courses: any[]) => {
        this.courses = courses.filter(course => {
          const matchesDomain = filterData.domains.length === 0 || filterData.domains.includes(course.domain);
  
          // ✅ Convertim datele cursului din format ISO în MM.DD.YYYY
          const formattedCourseStart = this.formatDate(course.start_date);
          const formattedCourseEnd = this.formatDate(course.end_date);
  
          // ✅ Convertim și datele filtrului în același format
          const formattedStartDate = filterData.startDate ? this.formatDate(filterData.startDate) : '';
          const formattedEndDate = filterData.endDate ? this.formatDate(filterData.endDate) : '';
  
          // ✅ Comparăm datele corect
          const startMatches = !formattedStartDate || formattedCourseStart >= formattedStartDate;
          const endMatches = !formattedEndDate || formattedCourseEnd <= formattedEndDate;
  
          return matchesDomain && startMatches && endMatches;
        });
      },
      error: (err) => console.error('Error filtering courses:', err),
    });
  }
  
  
  
  
}

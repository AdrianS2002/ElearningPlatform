import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { CourseService } from '../services/course.service';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isAuthenticated = false;
  isProfessor = false;
  isStudent = false;
  enrolledCourses: any[] = [];

  constructor(
    private userService: UserService,
    private courseService: CourseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = !!this.userService.getUserId();
    const role = this.userService.getUserRole();

    if (role === 'PROFESOR') {
      this.isProfessor = true;
    } else if (role === 'STUDENT') {
      this.isStudent = true;
      this.loadEnrolledCourses();
    }
  }

  loadEnrolledCourses() {
    const studentId = this.userService.getUserId(); // Obține ID-ul studentului autentificat
  
    if (!studentId) return;
  
    this.courseService.getEnrolledCourses(studentId).subscribe({
      next: (data) => {
        // ✅ Extrage doar numele, domeniul și perioada cursului
        this.enrolledCourses = data.map((enrollment: any) => ({
          name: enrollment.courses_id.name,
          domain: enrollment.courses_id.domain,
          period: `${this.formatDate(enrollment.courses_id.start_date)} - ${this.formatDate(enrollment.courses_id.end_date)}`
        }));
      },
      error: (err) => console.error('Error loading enrolled courses:', err),
    });
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const mm = ('0' + (date.getMonth() + 1)).slice(-2); // Luna
    const dd = ('0' + date.getDate()).slice(-2); // Ziua
    const yyyy = date.getFullYear(); // Anul
    return `${mm}.${dd}.${yyyy}`; // Format LL.ZZ.AAAA
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToCreateCourse() {
    this.router.navigate(['/add-course']);
  }

  navigateToCourses() {
    this.router.navigate(['/courses']);
  }

  navigateToCourse(courseId: string) {
    this.router.navigate([`/course/${courseId}`]);
  }
} 
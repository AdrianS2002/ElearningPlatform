import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { CourseService } from '../services/course.service';
import { Router } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ChatbotComponent } from '../chat-bot/chat-bot.component';
import { GeolocComponent } from "../geoloc/geoloc.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgIf, NgFor, ChatbotComponent, CommonModule, GeolocComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isAuthenticated = false;
  isProfessor = false;
  userLocation: string = '';
  isStudent = false;
  enrolledCourses: any[] = [];
  isChatbotOpen: boolean = false;
  price:Number = 0;

  constructor(
    private userService: UserService,
    private courseService: CourseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.isAuthenticated().subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
    });
  
    this.userService.getUserRole().subscribe((role) => {
      console.log("🎭 Utilizator logat cu rolul:", role);
      this.isProfessor = role === 'PROFESOR';
      this.isStudent = role === 'STUDENT';
  
      // Dacă utilizatorul este student, obține ID-ul și cursurile înscrise
      if (this.isStudent) {
        this.userService.getUserId().subscribe((userId) => {
          if (userId) {
            this.loadEnrolledCourses(userId);
          }
        });
      }
    });
  }

  onLocationSaved(location: string) {
    this.userLocation = location;
    console.log("Location received in login:", location);
  }
  
  loadEnrolledCourses(studentId: string) {
    this.courseService.getEnrolledCourses(studentId).subscribe({
      next: (data) => {
        this.enrolledCourses = data
          .filter((enrollment: any) => enrollment.courses_id)
          .map((enrollment: any) => ({
            name: enrollment.courses_id.name,
            domain: enrollment.courses_id.domain,
            period: `${this.formatDate(enrollment.courses_id.start_date)} - ${this.formatDate(enrollment.courses_id.end_date)}`,
            originalPrice: enrollment.courses_id.price,
            discount: enrollment.courses_id.discount,
            finalPrice: enrollment.courses_id.discount > 0
              ? (enrollment.courses_id.price * (1 - enrollment.courses_id.discount / 100)).toFixed(2)
              : enrollment.courses_id.price
          }));
  
        
        this.price = this.enrolledCourses.reduce((total, course) => total + parseFloat(course.finalPrice), 0);
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

  toggleChatbot() {
    this.isChatbotOpen = !this.isChatbotOpen; //  Comută între deschis/închis
  }
} 
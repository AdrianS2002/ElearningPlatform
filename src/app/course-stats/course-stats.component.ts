import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { CourseService } from '../services/course.service';
import { EnrollmentService } from '../services/enrollment.service';
import { UserService } from '../services/user.service';
Chart.register(...registerables);

@Component({
  selector: 'app-course-stats',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgFor, NgIf],
  templateUrl: './course-stats.component.html',
  styleUrl: './course-stats.component.css',
})
export class CourseStatsComponent implements OnInit {
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  studentsEnrolled: any[] = [];

  selectedCourse: any = null;
  enrollments: any[] = [];
  markedDays: number[] = [];
  monthlyCounts: { [month: string]: number } = {};
  daysInMonth: number[] = [];
  availableMonths: { month: number, year: number }[] = [];
  selectedMonth: number = new Date().getMonth();
  selectedYear: number = new Date().getFullYear();
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart: any;

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.courseService.getCourseById(courseId).subscribe(course => {
        this.selectedCourse = course;
        this.enrollmentService.getEnrollmentsByCourse(courseId).subscribe((enrollments: any) => {
          this.enrollments = enrollments;
          this.extractAvailableMonths();
          this.updateCalendarAndGraph();
        });
        console.log("🔹 Selected course:", this.selectedCourse);
        console.log("🔹 Enrollments for the course:", this.enrollmentService);
        this.getStudentsEnrolled(courseId);
      });
    }
  }

  getStudentsEnrolled(courseId: string): void {
    console.log("🔹 Getting students enrolled for course ID:", courseId);
    
    // Obținem înrolările pentru cursul respectiv
    this.enrollmentService.getEnrollmentsByCourse(courseId).subscribe((enrollments: any[]) => {
      console.log("🔹 Enrollments for the course:", enrollments);
  
      // Extragem doar studentii înrolați și eliminăm valorile null
      this.studentsEnrolled = enrollments
        .map(enroll => enroll.student_id)
        .filter(studentId => studentId !== null); // Eliminăm ID-urile null
      console.log("🔹 Valid Student IDs enrolled in the course:", this.studentsEnrolled);
  
      
    });
  }
  
  

  extractAvailableMonths() {
    const monthsSet = new Set<string>();
    this.enrollments.forEach(enroll => {
      const date = new Date(enroll.enrollment_date);
      const key = `${date.getMonth()}-${date.getFullYear()}`;
      monthsSet.add(key);
    });
  
    console.log("📅 Available months:", Array.from(monthsSet));
  
    this.availableMonths = Array.from(monthsSet).map(m => {
      const [month, year] = m.split('-').map(Number);
      return { month, year };
    }).sort((a, b) => b.year - a.year || b.month - a.month);
  }
  
  getColorForMonth(monthName: string): string {
    const monthColors: { [key: string]: string } = {
      'January': '#FF6384',
      'February': '#36A2EB',
      'March': '#4BC0C0',
      'April': '#9966FF',
      'May': '#FFCE56',
      'June': '#FF9F40',
      'July': '#66D48F',
      'August': '#D46C66',
      'September': '#A266D4',
      'October': '#D4B266',
      'November': '#66B2D4',
      'December': '#66D4A2',
    };
    return monthColors[monthName] || '#888888';
  }
  updateCalendarAndGraph() {
    const selectedEnrollments = this.enrollments.filter(enroll => {
      const date = new Date(enroll.enrollment_date);
      return date.getMonth() === this.selectedMonth && date.getFullYear() === this.selectedYear;
    });

    const daysCount = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();
    this.daysInMonth = Array.from({ length: daysCount }, (_, i) => i + 1);
    this.markedDays = selectedEnrollments.map(e => new Date(e.enrollment_date).getDate());

    // Update monthly stats
    this.monthlyCounts = {};
    this.enrollments.forEach((enroll: any) => {
      const enrollDate = new Date(enroll.enrollment_date);
      const monthName = enrollDate.toLocaleString('default', { month: 'long' });
      this.monthlyCounts[monthName] = (this.monthlyCounts[monthName] || 0) + 1;
    });

    const labels = Object.keys(this.monthlyCounts);
    const data = Object.values(this.monthlyCounts);

    if (this.chart) this.chart.destroy();

    this.chart = new Chart(this.chartCanvas.nativeElement.getContext('2d')!, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Înscrieri pe lună',
            data: data,
            backgroundColor: labels.map(label => this.getColorForMonth(label)),
            borderWidth: 1
          }
        ]
      },
      options: { responsive: true }
    });
  }

  onMonthChange(value: string) {
    const [month, year] = value.split('-').map(Number);
    this.selectedMonth = month;
    this.selectedYear = year;
    this.updateCalendarAndGraph();
  }

  handleMonthChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const value = target.value;
    this.onMonthChange(value);
  }
  

  isDayMarked(day: number): boolean {
    return this.markedDays.includes(day);
  }
}

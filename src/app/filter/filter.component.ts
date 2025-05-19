import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../services/course.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  @Output() close = new EventEmitter<void>();
  @Output() applyFilter = new EventEmitter<any>();

  selectedDomains: string[] = [];
  startDate: string = '';
  endDate: string = '';

  domains: string[] = [];

  constructor(private courseService: CourseService) { }

  ngOnInit() {
    this.loadDomains();
  }

  loadDomains() {
    this.courseService.getCourses().subscribe({
      next: (courses: any[]) => {
        this.domains = [...new Set(courses.map((course: { domain: string }) => course.domain))];
      },
      error: (err) => console.error('Error fetching courses:', err),
    });
  }

  toggleDomainSelection(domain: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (!this.selectedDomains.includes(domain)) {
        this.selectedDomains.push(domain);
      }
    } else {
      this.selectedDomains = this.selectedDomains.filter(d => d !== domain);
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const mm = ('0' + (date.getMonth() + 1)).slice(-2); // Luna
    const dd = ('0' + date.getDate()).slice(-2); // Ziua
    const yyyy = date.getFullYear(); // Anul
    return `${mm}.${dd}.${yyyy}`; // Format LL.ZZ.AAAA
  }

  applyFilters() {
    const formattedStartDate = this.startDate ? this.formatDate(this.startDate) : '';
    const formattedEndDate = this.endDate ? this.formatDate(this.endDate) : '';
  
    this.applyFilter.emit({
      domains: this.selectedDomains,
      startDate: formattedStartDate,
      endDate: formattedEndDate
    });
    this.close.emit();
  }
}

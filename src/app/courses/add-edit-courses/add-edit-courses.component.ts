import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-add-edit-courses',
  standalone: true,
  imports: [ CommonModule, FormsModule],
  templateUrl: './add-edit-courses.component.html',
  styleUrl: './add-edit-courses.component.css'
})
export class AddEditCoursesComponent implements OnInit {
  course: any = {
    name: '',
    description: '',
    domain: '',
    start_date: '',
    end_date: '',
    no_session: 0,
    price: 0,
    slots: 0,
    available_slots: 0,
    languages: '',
    discount: 0,
  };
  isEditMode = false;

  constructor(
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.isEditMode = true;
      this.courseService.getCourseById(courseId).subscribe((data) => {
        this.course = data;
      });
    }
  }

  saveCourse() {
    if (this.isEditMode) {
      this.courseService.updateCourse(this.course._id, this.course).subscribe(() => {
        this.router.navigate(['/courses']);
      });
      console.log(this.course);
    } else {
      this.course.user_id = this.userService.getUserId(); // Set user ID
      this.courseService.createCourse(this.course).subscribe(() => {
        this.router.navigate(['/courses']);
      });
    }
  }

  cancel() {
    this.router.navigate(['/courses']);
  }
}
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { CoursesComponent } from './courses/courses.component';
import { ContactComponent } from './contact/contact.component';
import { AuthGuard } from './auth.guard';
import { AddEditCoursesComponent } from './courses/add-edit-courses/add-edit-courses.component';
import { FilterComponent } from './filter/filter.component';
import { OffersComponent } from './courses/offers/offers.component';
import { CourseDetailComponent } from './courses/course-detail/course-detail.component';
import { ChatbotComponent } from './chat-bot/chat-bot.component';
import { CourseStatsComponent } from './course-stats/course-stats.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'home', component: HomeComponent },
    { path: 'courses', component: CoursesComponent },
    { path: 'contact', component: ContactComponent},//, canActivate: [AuthGuard] },
    { path: '', redirectTo: '/login', pathMatch: 'full' } ,// Redirecționare default
    { path: 'courses', component: CoursesComponent },
    { path: 'add-course', component:  AddEditCoursesComponent},
    { path: 'edit-course/:id', component: AddEditCoursesComponent },
    { path: 'filter', component: FilterComponent},
    { path: 'offers', component: OffersComponent},
    { path: 'course/:id', component: CourseDetailComponent },
    { path: 'chatbot', component: ChatbotComponent },
    { path: 'course-stats/:id', component: CourseStatsComponent}
];

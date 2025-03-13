import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { CoursesComponent } from './courses/courses.component';
import { ContactComponent } from './contact/contact.component';
import { AuthGuard } from './auth.guard';
import { AddEditCoursesComponent } from './courses/add-edit-courses/add-edit-courses.component';

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
];

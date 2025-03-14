import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { LanguageDetectionService } from '../services/language-detection.service';
import { CourseService } from '../services/course.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, FormsModule, NgFor],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  userLanguage: string | null = null;
  filteredCourses: any[] = [];
  showDropdown: boolean = false;
  isLoggedIn: boolean = false;
  private authSubscription!: Subscription;
  constructor(private authService: AuthService, private router: Router, private courseService: CourseService, private languageService: LanguageDetectionService) { }

  ngOnInit() {
    this.authSubscription = this.authService.authStatus$.subscribe(status => {
      this.isLoggedIn = status;
    });

    const countryCode = this.languageService.getUserCountry();
    if (countryCode) {
      this.languageService.getLanguageByCountry(countryCode)
        .then((data) => {
          if (data && data.length > 0 && data[0].languages) {
            this.userLanguage = countryCode;
          } else {
            this.userLanguage = 'EN';
          }
        })
        .catch(() => {
          this.userLanguage = 'EN';
        });
    } else {
      this.userLanguage = 'EN';
    }
  }

  searchCourses() {
    if (this.searchQuery.trim().length === 0) {
      this.filteredCourses = [];
      this.showDropdown = false;
      return;
    }

    this.courseService.getCourses().subscribe((courses) => {
      let results = courses.filter((course: any) =>
        course.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

      console.log('🔍 Initial Matching Courses:', results);

      const userLang = this.userLanguage ?? 'EN'; // ✅ Dacă userLanguage e null, implicit EN

      this.filteredCourses = results.sort((a: any, b: any) => {
        const aLanguages = this.normalizeLanguages(a.languages);
        const bLanguages = this.normalizeLanguages(b.languages);

        const aOnlyUserLang = aLanguages.length === 1 && aLanguages.includes(userLang);
        const bOnlyUserLang = bLanguages.length === 1 && bLanguages.includes(userLang);

        const aHasLang = aLanguages.includes(userLang);
        const bHasLang = bLanguages.includes(userLang);

        console.log(`📖 Checking Course: ${a.name} - Languages:`, aLanguages, '| Has Lang:', aHasLang);
        console.log(`📖 Checking Course: ${b.name} - Languages:`, bLanguages, '| Has Lang:', bHasLang);

        // 1️⃣ **Cursurile care au DOAR limba utilizatorului (ex. "RO") sunt primele**
        if (aOnlyUserLang && !bOnlyUserLang) return -1;
        if (!aOnlyUserLang && bOnlyUserLang) return 1;

        // 2️⃣ **Cursurile care au userLang + alte limbi (ex. "EN,RO") sunt următoarele**
        if (aHasLang && !bHasLang) return -1;
        if (!aHasLang && bHasLang) return 1;

        return 0;
      });

      console.log('🔝 Prioritized Courses:', this.filteredCourses);

      this.showDropdown = true;
    });
  }


  private normalizeLanguages(languages: any): string[] {
    if (Array.isArray(languages)) {
      return languages
        .flatMap((lang: string) => lang.split(',')) // Spargem string-uri separate prin virgulă
        .map((lang: string) => lang.trim().toUpperCase()); // Eliminăm spațiile și convertim la uppercase
    }
    if (typeof languages === 'string') {
      return languages.split(',').map((lang: string) => lang.trim().toUpperCase());
    }
    return [];
  }


  selectCourse(course: any) {
    this.searchQuery = course.name;
    this.showDropdown = false;
    this.router.navigate(['/course', course._id]);
  }


  hideDropdownWithDelay() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }



  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirecționează către login
  }

  // Verifică dacă utilizatorul este logat
  checkLoginStatus() {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token; // Dacă există un token, utilizatorul este logat
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }
  navigateToOffers() {
    this.router.navigate(['/offers']);
  }


  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToCourses() {
    this.router.navigate(['/courses']);
  }

  navigateToContact() {
    this.router.navigate(['/contact']);
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe(); // Evită memory leaks
  }
}

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
  userRole: string | null = null; // 🔹 Stochează rolul utilizatorului
  private authSubscription!: Subscription;
  private roleSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private courseService: CourseService,
    private languageService: LanguageDetectionService
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.authStatus$.subscribe(status => {
      this.isLoggedIn = status;
    });
  
    this.roleSubscription = this.authService.userRole$.subscribe(role => {
      this.userRole = role;
      console.log("🎭 Utilizator logat cu rolul:", this.userRole);
    });
  
    this.loadUserLanguage();
  }
  
  async loadUserLanguage() {
    try {
      const countryCode = await this.languageService.getUserCountry();
      if (countryCode) {
        const data = await this.languageService.getLanguageByCountry(countryCode);
        if (data && data.length > 0 && data[0].languages) {
          this.userLanguage = countryCode;
        } else {
          this.userLanguage = 'EN';
        }
      } else {
        this.userLanguage = 'EN';
      }
    } catch (error) {
      console.error("❌ Error loading user language:", error);
      this.userLanguage = 'EN';
    }
  }
  
  
  private hasUserLocation(): boolean {
    return document.cookie.split('; ').some(row => row.startsWith('userLocation='));
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
  
      if (!this.hasUserLocation()) {
        // Dacă nu există geolocație, afișează în ordine aleatorie
        this.filteredCourses = results.sort(() => Math.random() - 0.5);
      } else {
        // Dacă există geolocație, păstrează sortarea pe limbă
        const userLang = this.userLanguage ?? 'EN';
  
        this.filteredCourses = results.sort((a: any, b: any) => {
          const aLanguages = this.normalizeLanguages(a.languages);
          const bLanguages = this.normalizeLanguages(b.languages);
  
          const aOnlyUserLang = aLanguages.length === 1 && aLanguages.includes(userLang);
          const bOnlyUserLang = bLanguages.length === 1 && bLanguages.includes(userLang);
  
          const aHasLang = aLanguages.includes(userLang);
          const bHasLang = bLanguages.includes(userLang);
  
          if (aOnlyUserLang && !bOnlyUserLang) return -1;
          if (!aOnlyUserLang && bOnlyUserLang) return 1;
  
          if (aHasLang && !bHasLang) return -1;
          if (!aHasLang && bHasLang) return 1;
  
          return 0;
        });
      }
  
      console.log('📋 Final Results:', this.filteredCourses);
      this.showDropdown = true;
    });
  }
  

  private normalizeLanguages(languages: any): string[] {
    if (Array.isArray(languages)) {
      return languages.flatMap((lang: string) => lang.split(',')).map((lang: string) => lang.trim().toUpperCase());
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
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']); // ✅ Așteaptă confirmarea logout-ului înainte de redirecționare
      },
      error: (err) => {
        console.error("🔥 Logout error:", err);
      }
    });
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
    this.authSubscription.unsubscribe(); 
    this.roleSubscription.unsubscribe();
  }
}

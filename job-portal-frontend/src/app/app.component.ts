// app.component.ts
// Component controller for the main application shell

import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserRoleService } from './services/user-role.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Job Portal';  // Application title displayed in header
  
  // Current section tracker to determine which navigation to show
  currentSection: 'job-searcher' | 'employee' | 'home' = 'home';

  constructor(
    private router: Router,
    public userRoleService: UserRoleService  // Inject role service to access role state
  ) {
    // Watch for route changes to update the current section
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateCurrentSection(event.url);
    });
  }

  // Determine which section the user is in based on the URL
  private updateCurrentSection(url: string): void {
    if (url === '/' || url === '/home') {
      this.currentSection = 'home';
    } else if (url.includes('/employee')) {
      this.currentSection = 'employee';
    } else if (url.includes('/job-searcher')) {
      this.currentSection = 'job-searcher';
    }
  }

  // Helper methods to check current section for conditional rendering
  isHome(): boolean {
    return this.currentSection === 'home';
  }

  isJobSeekerRoute(): boolean {
    return this.currentSection === 'job-searcher';
  }

  isEmployeeRoute(): boolean {
    return this.currentSection === 'employee';
  }
}
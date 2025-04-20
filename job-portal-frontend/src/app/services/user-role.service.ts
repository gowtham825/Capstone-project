// services/user-role.service.ts
// Service that manages the current user role in the application

import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Makes service available app-wide
})
export class UserRoleService {
  // BehaviorSubject to track and broadcast the current user role
  private isEmployeeSubject = new BehaviorSubject<boolean>(false);
  
  // Observable that components can subscribe to for role changes
  public isEmployee$ = this.isEmployeeSubject.asObservable();

  constructor(private router: Router) {
    // Listen for navigation events to update role based on URL
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)  // Only process NavigationEnd events
    ).subscribe((event: any) => {
      // Determine if user is in employee section based on URL
      const isEmployeeRoute = event.url.includes('/employee');
      this.isEmployeeSubject.next(isEmployeeRoute);  // Update the role state
    });
  }

  // Getter for current role state
  get isEmployee(): boolean {
    return this.isEmployeeSubject.value;
  }
}
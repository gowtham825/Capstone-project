import { Component, OnInit } from '@angular/core';
import { Application } from 'src/app/models/application';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-job-applications-list',
  templateUrl: './job-applications-list.component.html',
  styleUrls: ['./job-applications-list.component.scss']
})
export class JobApplicationsListComponent implements OnInit {
  applications: Application[] = [];
  displayedColumns: string[] = ['name', 'email', 'jobTitle', 'company', 'appliedAt'];

  isLoading = true;
  errorMessage: string | null = null;

  constructor(private applicationService: ApplicationService) { }

  ngOnInit(): void {
    this.getApplications();
  }

  getApplications(): void {
    this.isLoading = true;
    this.applicationService.getApplications().subscribe({
      next: applications => {
        this.applications = applications;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error fetching applications:', err);
        this.errorMessage = err.message || 'Failed to load applications. Please try again.';
        this.isLoading = false;
      }
    });
  }
  getFirstLetter(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '';
  }
  
  getAvatarColor(name: string): string {
    // Generate a consistent color based on the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
  }
  
  dismissError(): void {
    this.errorMessage = null;
  }
  
  retryLoading(): void {
    this.errorMessage = null;
    this.getApplications();
  }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobService } from '../../services/job.service';
import { Job } from '../../models/job';
import { UserRoleService } from '../../services/user-role.service';
@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {
  isEmployee: boolean = false;
  
  jobs: Job[] = [];
  allJobs: Job[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  isDeletingJob: { [key: number]: boolean } = {};

  selectedJobType: string = '';
  selectedLocation: string = '';
  selectedSalaryRange: string = '';
  uniqueLocations: string[] = [];

  constructor(
    private jobService: JobService,
    private router: Router,
    public userRoleService: UserRoleService
  ) { }


  ngOnInit(): void {
    this.getJobs();
  }

  getJobs(): void {
    this.isLoading = true;
    this.jobService.getJobs().subscribe({
      next: jobs => {
        this.allJobs = jobs;
        this.jobs = jobs; // Show all jobs by default
        this.isLoading = false;
        
        // Populate unique locations
        this.uniqueLocations = [...new Set(jobs.map(job => job.location))];
      },
      error: err => {
        console.error('Error fetching jobs:', err);
        this.errorMessage = err.message || 'Failed to load jobs. Please try again.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    // Start with all jobs
    let filteredJobs = this.allJobs;

    // Apply Job Type Filter
    if (this.selectedJobType) {
      filteredJobs = filteredJobs.filter(job => job.job_type === this.selectedJobType);
    }

    // Apply Location Filter
    if (this.selectedLocation) {
      filteredJobs = filteredJobs.filter(job => job.location === this.selectedLocation);
    }

    // Apply Salary Range Filter
    if (this.selectedSalaryRange) {
      filteredJobs = filteredJobs.filter(job => {
        const salary = parseInt(job.salary_range || '0', 10);
        switch (this.selectedSalaryRange) {
          case '0-10000':
            return salary >= 0 && salary <= 10000;
          case '10000-50000':
            return salary > 10000 && salary <= 50000;
          case '50000-100000':
            return salary > 50000 && salary <= 100000;
          case '100000-200000':
            return salary > 100000 && salary <= 200000;
          case '200000+':
            return salary > 200000;
          default:
            return true;
        }
      });
    }

    // Update jobs list with filtered results
    this.jobs = filteredJobs;
  }

  // Method to reset filters
  resetFilters(): void {
    this.selectedJobType = '';
    this.selectedLocation = '';
    this.selectedSalaryRange = '';
    this.jobs = this.allJobs;
  }

  viewJobDetails(job: Job): void {
    if (job && job.id) {
      if (this.userRoleService.isEmployee) {
        this.router.navigate(['/employee/jobs', job.id]);
      } else {
        this.router.navigate(['/job-searcher/jobs', job.id]);
      }
    }
  }

  navigateToEdit(job: Job): void {
    if (job && job.id && this.userRoleService.isEmployee) {
      this.router.navigate(['/employee/jobs/edit', job.id]);
    }
  }

  confirmDelete(job: Job): void {
    if (!this.userRoleService.isEmployee) return;
    
    if (job && job.id) {
      if (confirm('Are you sure you want to delete this job?')) {
        this.jobService.deleteJob(job.id).subscribe({
          next: () => {
            this.jobs = this.jobs.filter(j => j.id !== job.id);
          },
          error: err => {
            console.error('Error deleting job:', err);
            this.errorMessage = `Failed to delete job: ${err.message}`;
          }
        });
      }
    }
  }
  navigateToApply(job: Job): void {
    if (job && job.id) {
      this.router.navigate(['/job-searcher/jobs', job.id, 'apply']);
    }
  }
  dismissError(): void {
    this.errorMessage = null;
  }
  
  retryLoading(): void {
    this.errorMessage = null;
    this.getJobs();
  }
}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Job } from '../../models/job';
import { JobService } from '../../services/job.service';
import { UserRoleService } from '../../services/user-role.service';
@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit {
  job: Job | undefined;
  jobs: Job[] = [];
  errorMessage: string | null = null;
  isLoading = true;
  isDeleting = false;
  isEmployee = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    public userRoleService: UserRoleService
  ) { }

  ngOnInit(): void {
    this.getJob();
    
    // Determine if we're in employee section
    const currentRoute = this.router.url;
    this.isEmployee = currentRoute.includes('/employee');
  }
  getJob(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoading = true;
    this.jobService.getJobById(id).subscribe({
      next: job => {
        this.job = job;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error fetching job details:', err);
        this.errorMessage = err.message || 'Failed to load job details. Please try again.';
        this.isLoading = false;
      }
    });
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
            // After successful deletion, navigate back to jobs list
            this.goBack();
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

  goBack(): void {
    // Navigate back to the correct section
    if (this.userRoleService.isEmployee) {
      this.router.navigate(['/employee/jobs']);
    } else {
      this.router.navigate(['/job-searcher/jobs']);
    }
  }
  
  dismissError(): void {
    this.errorMessage = null;
  }
}
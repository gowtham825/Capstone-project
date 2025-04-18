import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobService } from '../../services/job.service';

// Updated Job interface to match backend
interface Job {
  id?: number;
  job_title: string;
  company_name: string;
  location: string;
  job_type: string;
  salary_range?: string;
  job_description: string;
  application_deadline: string;
  created_at?: string;
}

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  displayedColumns: string[] = ['job_title', 'company_name', 'location', 'job_type', 'salary_range', 'application_deadline', 'actions'];

  constructor(
    private jobService: JobService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getJobs();
  }

  getJobs(): void {
    this.jobService.getJobs().subscribe(jobs => {
      this.jobs = jobs;
    });
  }

  viewJobDetails(id: number): void {
    if (id !== undefined) {
      this.router.navigate(['/jobs', id]);
    }
  }
  
  editJob(id: number, event: Event): void {
    if (id !== undefined) {
      event.stopPropagation();
      this.router.navigate(['/jobs/edit', id]);
    }
  }
  
  deleteJob(id: number, event: Event): void {
    if (id !== undefined) {
      event.stopPropagation();
      if (confirm('Are you sure you want to delete this job?')) {
        this.jobService.deleteJob(id).subscribe(() => {
          this.jobs = this.jobs.filter(job => job.id !== id);
        });
      }
    }
  }
  
  applyForJob(id: number, event: Event): void {
    if (id !== undefined) {
      event.stopPropagation();
      this.router.navigate(['/jobs', id, 'apply']);
    }
  }
}
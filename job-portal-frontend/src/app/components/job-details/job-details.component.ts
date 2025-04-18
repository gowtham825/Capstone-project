import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Job } from '../../models/job';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit {
  job: Job | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService
  ) { }

  ngOnInit(): void {
    this.getJob();
  }

  getJob(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    // Change getJob to getJobById
    this.jobService.getJobById(id).subscribe(job => {
      this.job = job;
    });
  }

  editJob(): void {
    if (this.job) {
      this.router.navigate(['/jobs/edit', this.job.id]);
    }
  }

  deleteJob(): void {
    if (this.job && this.job.id !== undefined && confirm('Are you sure you want to delete this job?')) {
      this.jobService.deleteJob(this.job.id).subscribe(() => {
        this.router.navigate(['/jobs']);
      });
    }
  }

  applyForJob(): void {
    if (this.job) {
      this.router.navigate(['/jobs', this.job.id, 'apply']);
    }
  }

  goBack(): void {
    this.router.navigate(['/jobs']);
  }
}
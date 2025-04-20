// job-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../../services/job.service';
import { Job } from '../../models/job';
import { UserRoleService } from '../../services/user-role.service'; // Import the service

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss']
})
export class JobFormComponent implements OnInit {
  jobForm: FormGroup;
  isEditMode = false;
  jobId: number | null = null;
  errorMessage: string | null = null;
  jobTypes = ['Full Time', 'Part Time', 'Contract', 'Internship', 'Remote'];

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private router: Router,
    private route: ActivatedRoute,
    public userRoleService: UserRoleService // Add the service
  ) {
    this.jobForm = this.fb.group({
      job_title: ['', Validators.required],
      company_name: ['', Validators.required],
      location: ['', Validators.required],
      job_type: ['', Validators.required],
      salary_range: [''],
      job_description: ['', Validators.required],
      application_deadline: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Check if we are in edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.jobId = Number(id);
      this.loadJobDetails(this.jobId);
    }
  }

  loadJobDetails(id: number): void {
    this.jobService.getJobById(id).subscribe({
      next: job => {
        // Convert date string to Date object for the datepicker
        // if (job.application_deadline) {
        //   job.application_deadline = new Date(job.application_deadline);
        // }
        this.jobForm.patchValue(job);
      },
      error: err => {
        console.error('Error loading job details:', err);
        this.errorMessage = 'Failed to load job details. Please try again.';
      }
    });
  }

  onSubmit(): void {
    if (this.jobForm.valid) {
      const jobData = this.jobForm.value;
      
      if (this.isEditMode && this.jobId) {
        // Update existing job
        this.jobService.updateJob(this.jobId, jobData).subscribe({
          next: () => {
            // Ensure we navigate back to the employee section
            this.router.navigate(['/employee/jobs']);
          },
          error: err => {
            console.error('Error updating job:', err);
            this.errorMessage = 'Failed to update job. Please try again.';
          }
        });
      } else {
        // Create new job
        this.jobService.createJob(jobData).subscribe({
          next: () => {
            // Ensure we navigate back to the employee section
            this.router.navigate(['/employee/jobs']);
          },
          error: err => {
            console.error('Error creating job:', err);
            this.errorMessage = 'Failed to create job. Please try again.';
          }
        });
      }
    }
  }

  goBack(): void {
    // Always navigate back to the employee section
    this.router.navigate(['/employee/jobs']);
  }
}
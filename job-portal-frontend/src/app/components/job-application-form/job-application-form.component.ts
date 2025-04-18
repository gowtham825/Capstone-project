import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Job } from '../../models/job';
import { JobService } from '../../services/job.service';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-job-application-form',
  templateUrl: './job-application-form.component.html',
  styleUrls: ['./job-application-form.component.scss']
})
export class JobApplicationFormComponent implements OnInit {
  applicationForm!: FormGroup;
  job: Job | undefined;
  jobId: number | null = null;
  submitting = false;
  error: string | null = null;
  success: boolean = false;
  isEditMode: boolean = false; // Add isEditMode property
  
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private applicationService: ApplicationService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getJobDetails();
  }

  initForm(): void {
    this.applicationForm = this.fb.group({
      // Rename to match backend field names
      applicant_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  getJobDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.jobId = +id;
      // Change getJob to getJobById
      this.jobService.getJobById(this.jobId).subscribe(job => {
        this.job = job;
      });
    }
  }
  goBack(): void {
    this.router.navigate(['/jobs']);
  }
  onSubmit(): void {
    console.log('Form submitted');
    console.log('Form value:', this.applicationForm.value);
    console.log('Form valid:', this.applicationForm.valid);
    
    if (this.applicationForm.invalid) {
      console.log('Form is invalid');
      this.markFormGroupTouched(this.applicationForm);
      return;
    }

    if (!this.jobId) {
      this.error = 'Job ID is missing';
      return;
    }
  
    const applicationData = {
      job_id: this.jobId,
      ...this.applicationForm.value
    };
    
    console.log('Attempting to submit application:', applicationData);
    this.submitting = true;
    
    this.applicationService.applyForJob(this.jobId, applicationData).subscribe({
      next: (response) => {
        console.log('Application submitted successfully:', response);
        this.submitting = false;
        this.success = true;
        // Redirect after 2 seconds to allow user to see success message
        setTimeout(() => {
          this.router.navigate(['/jobs']);
        }, 2000);
      },
      error: (err) => {
        console.error('Error submitting application:', err);
        this.submitting = false;
        this.error = 'Failed to submit application. Please try again.';
      }
    });
  }
}
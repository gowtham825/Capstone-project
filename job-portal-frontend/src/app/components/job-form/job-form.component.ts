import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Job } from '../../models/job';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss']
})
export class JobFormComponent implements OnInit {
  jobForm!: FormGroup;
  isEditMode = false;
  jobId: number | null = null;
  
  jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
    'Remote'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  initForm(): void {
    this.jobForm = this.fb.group({
      // Update form control names to match backend field names
      job_title: ['', [Validators.required]],
      company_name: ['', [Validators.required]],
      location: ['', [Validators.required]],
      job_type: ['Full-time', [Validators.required]],
      salary_range: [''],
      job_description: ['', [Validators.required]],
      application_deadline: ['', [Validators.required]]
    });
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.jobId = +id;
      this.getJobDetails(this.jobId);
    }
  }

  getJobDetails(id: number): void {
    this.jobService.getJobById(id).subscribe((job: Job) => {
      // For the application_deadline, convert it to a JavaScript Date
      let applicationDeadline: Date | null = null;
      if (job.application_deadline) {
        applicationDeadline = new Date(job.application_deadline);
        // Ensure it's a valid date
        if (isNaN(applicationDeadline.getTime())) {
          applicationDeadline = null;
        }
      }
      
      this.jobForm.patchValue({
        job_title: job.job_title,
        company_name: job.company_name,
        location: job.location,
        job_type: job.job_type,
        salary_range: job.salary_range,
        job_description: job.job_description,
        application_deadline: applicationDeadline
      });
    });
  }

  onSubmit(): void {
    if (this.jobForm.invalid) {
      this.markFormGroupTouched(this.jobForm);
      return;
    }
    
    // Create a copy of the form value
    const jobData: Job = { ...this.jobForm.value };
    
    // Format the date correctly for MySQL
    if (jobData.application_deadline) {
      // If it's a Date object
      if (Object.prototype.toString.call(jobData.application_deadline) === '[object Date]') {
        // Format date to YYYY-MM-DD
        const date = jobData.application_deadline;
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
          const year = parsedDate.getFullYear();
          const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
          const day = String(parsedDate.getDate()).padStart(2, '0');
          jobData.application_deadline = `${year}-${month}-${day}`;
        }
      } 
      // If it's already a string, make sure it's in the right format
      else if (typeof jobData.application_deadline === 'string') {
        // Convert to Date and back to string in YYYY-MM-DD format
        const date = new Date(jobData.application_deadline);
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          jobData.application_deadline = `${year}-${month}-${day}`;
        }
      }
    }
    
    console.log('Job data to be sent:', jobData);
    
    if (this.isEditMode && this.jobId) {
      this.jobService.updateJob(this.jobId, jobData).subscribe({
        next: () => {
          console.log('Job updated successfully');
          this.router.navigate(['/jobs']);
        },
        error: (err) => console.error('Error updating job:', err)
      });
    } else {
      this.jobService.createJob(jobData).subscribe({
        next: () => {
          console.log('Job created successfully');
          this.router.navigate(['/jobs']);
        },
        error: (err) => console.error('Error creating job:', err)
      });
    }
  }
  goBack(): void {
    this.router.navigate(['/jobs']);
  }
}
// models/application.ts
// Defines the Application interface that represents a job application in the system

import { Job } from './job';

export interface Application {
  id?: number;                // Optional ID, may not exist for new applications
  applicant_name: string;     // Name of the person applying for the job
  email: string;              // Email address of the applicant
  job_id: number;             // Foreign key reference to the job being applied for
  job?: Job;                  // Optional job object for when application data is populated with job details
  appliedAt?: Date;           // Optional timestamp for when the application was submitted
}
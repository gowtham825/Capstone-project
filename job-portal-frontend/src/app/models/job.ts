// models/job.ts
// Defines the Job interface that represents a job posting in the system

export interface Job {
  id?: number;                  // Optional ID, may not exist for new job listings
  job_title: string;            // Title of the job position
  company_name: string;         // Name of the company offering the job
  location: string;             // Physical location of the job
  job_type: string;             // Type of employment (full-time, part-time, etc.)
  salary_range?: string;        // Optional salary information
  job_description: string;      // Detailed description of the job responsibilities
  application_deadline: string; // Last date to apply for the job
  created_at?: string;          // Optional timestamp for when the job was posted
}
// job.model.ts
// Defines the Job data structure and database operations

import pool from '../config/db.config';  // Import database connection pool

// Interface defining the structure of a Job object
interface Job {
  id?: number;                  // Optional because it's auto-generated for new jobs
  job_title: string;            // Job position title
  company_name: string;         // Company offering the job
  location: string;             // Physical location of the job
  job_type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote';  // Fixed job types matching database enum
  salary_range?: string;        // Optional salary information
  job_description: string;      // Detailed description of the job
  application_deadline: string; // Last date to apply
  created_at?: string;          // Auto-generated timestamp
}

class JobModel {
  // Retrieve all jobs, sorted by most recent first
  async findAll(): Promise<Job[]> {
    const [rows] = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC');
    return rows as Job[];
  }

  // Find a specific job by ID
  async findById(id: number): Promise<Job | null> {
    const [rows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [id]);
    const jobs = rows as Job[];
    return jobs.length ? jobs[0] : null;  // Return the job or null if not found
  }

  // Create a new job listing
  async create(job: Job): Promise<number> {
    const { job_title, company_name, location, job_type, salary_range, job_description, application_deadline } = job;
    
    // Ensure application_deadline is in correct format (YYYY-MM-DD)
    let formattedDeadline = application_deadline;
    
    // Log the incoming date for debugging
    console.log('Original application_deadline:', application_deadline);
    
    try {
      // Check if it's already in YYYY-MM-DD format
      if (application_deadline && !application_deadline.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Parse the date and format it correctly
        const date = new Date(application_deadline);
        if (!isNaN(date.getTime())) {
          formattedDeadline = date.toISOString().split('T')[0];  // Format as YYYY-MM-DD
        } else {
          // If date is invalid, use current date as fallback
          formattedDeadline = new Date().toISOString().split('T')[0];
          console.warn('Invalid date provided, using current date as fallback');
        }
      }
      
      console.log('Formatted application_deadline:', formattedDeadline);
      
      // Insert the job into the database
      const [result] = await pool.query(
        'INSERT INTO jobs (job_title, company_name, location, job_type, salary_range, job_description, application_deadline) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [job_title, company_name, location, job_type, salary_range, job_description, formattedDeadline]
      );
      return (result as any).insertId;  // Return the ID of the newly created job
    } catch (error) {
      console.error('Error in create job:', error);
      throw error;  // Propagate error for controller to handle
    }
  }

  // Update an existing job
  async update(id: number, job: Job): Promise<boolean> {
    const { job_title, company_name, location, job_type, salary_range, job_description, application_deadline } = job;
    
    // Similar date formatting logic as in create()
    let formattedDeadline = application_deadline;
    console.log('Original application_deadline for update:', application_deadline);
    
    try {
      if (application_deadline && !application_deadline.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const date = new Date(application_deadline);
        if (!isNaN(date.getTime())) {
          formattedDeadline = date.toISOString().split('T')[0];
        } else {
          formattedDeadline = new Date().toISOString().split('T')[0];
          console.warn('Invalid date provided for update, using current date as fallback');
        }
      }
      
      console.log('Formatted application_deadline for update:', formattedDeadline);
      
      // Update the job in the database
      const [result] = await pool.query(
        'UPDATE jobs SET job_title = ?, company_name = ?, location = ?, job_type = ?, salary_range = ?, job_description = ?, application_deadline = ? WHERE id = ?',
        [job_title, company_name, location, job_type, salary_range, job_description, formattedDeadline, id]
      );
      return (result as any).affectedRows > 0;  // Return true if job was updated
    } catch (error) {
      console.error('Error in update job:', error);
      throw error;
    }
  }

  // Delete a job listing
  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query('DELETE FROM jobs WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;  // Return true if job was deleted
  }
}

export { Job, JobModel };  // Export both the interface and the model class
import pool from '../config/db.config';

interface Job {
  id?: number;
  job_title: string;
  company_name: string;
  location: string;
  job_type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Remote';
  salary_range?: string;
  job_description: string;
  application_deadline: string;
  created_at?: string;
}

class JobModel {
  async findAll(): Promise<Job[]> {
    const [rows] = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC');
    return rows as Job[];
  }

  async findById(id: number): Promise<Job | null> {
    const [rows] = await pool.query('SELECT * FROM jobs WHERE id = ?', [id]);
    const jobs = rows as Job[];
    return jobs.length ? jobs[0] : null;
  }

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
          formattedDeadline = date.toISOString().split('T')[0];
        } else {
          // If date is invalid, use current date
          formattedDeadline = new Date().toISOString().split('T')[0];
          console.warn('Invalid date provided, using current date as fallback');
        }
      }
      
      console.log('Formatted application_deadline:', formattedDeadline);
      
      const [result] = await pool.query(
        'INSERT INTO jobs (job_title, company_name, location, job_type, salary_range, job_description, application_deadline) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [job_title, company_name, location, job_type, salary_range, job_description, formattedDeadline]
      );
      return (result as any).insertId;
    } catch (error) {
      console.error('Error in create job:', error);
      throw error;
    }
  }
  async update(id: number, job: Job): Promise<boolean> {
    const { job_title, company_name, location, job_type, salary_range, job_description, application_deadline } = job;
    
    // Ensure application_deadline is in correct format (YYYY-MM-DD)
    let formattedDeadline = application_deadline;
    
    // Log the incoming date for debugging
    console.log('Original application_deadline for update:', application_deadline);
    
    try {
      // Check if it's already in YYYY-MM-DD format
      if (application_deadline && !application_deadline.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Parse the date and format it correctly
        const date = new Date(application_deadline);
        if (!isNaN(date.getTime())) {
          formattedDeadline = date.toISOString().split('T')[0];
        } else {
          // If date is invalid, use current date
          formattedDeadline = new Date().toISOString().split('T')[0];
          console.warn('Invalid date provided for update, using current date as fallback');
        }
      }
      
      console.log('Formatted application_deadline for update:', formattedDeadline);
      
      const [result] = await pool.query(
        'UPDATE jobs SET job_title = ?, company_name = ?, location = ?, job_type = ?, salary_range = ?, job_description = ?, application_deadline = ? WHERE id = ?',
        [job_title, company_name, location, job_type, salary_range, job_description, formattedDeadline, id]
      );
      return (result as any).affectedRows > 0;
    } catch (error) {
      console.error('Error in update job:', error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query('DELETE FROM jobs WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  }
}

export { Job, JobModel };
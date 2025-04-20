// application.model.ts
// Defines the Application data structure and database operations

import pool from '../config/db.config';  // Import database connection pool

// Interface defining the structure of an Application object
interface Application {
  id?: number;           // Optional because it's auto-generated for new applications
  job_id: number;        // Foreign key linking to the job
  applicant_name: string; // Name of the applicant
  email: string;         // Email address of the applicant
  applied_at?: string;   // Auto-generated timestamp
  job_title?: string;    // Optional job info for joined queries
  company_name?: string; // Optional company info for joined queries
}

class ApplicationModel {
  // Retrieve all applications with job details, sorted by most recent first
  async findAll(): Promise<Application[]> {
    // SQL join to get job details along with application data
    const [rows] = await pool.query(`
      SELECT 
        a.id, 
        a.job_id, 
        a.applicant_name, 
        a.email, 
        a.applied_at,
        j.job_title,
        j.company_name
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      ORDER BY a.applied_at DESC
    `);
    return rows as Application[];
  }
  
  // Find a specific application by ID
  async findById(id: number): Promise<Application | null> {
    const [rows] = await pool.query('SELECT * FROM applications WHERE id = ?', [id]);
    const applications = rows as Application[];
    return applications.length ? applications[0] : null;  // Return the application or null if not found
  }

  // Find all applications for a specific job
  async findByJobId(jobId: number): Promise<Application[]> {
    const [rows] = await pool.query('SELECT * FROM applications WHERE job_id = ? ORDER BY applied_at DESC', [jobId]);
    return rows as Application[];
  }

  // Create a new job application
  async create(application: Application): Promise<number> {
    const { job_id, applicant_name, email } = application;
    const [result] = await pool.query(
      'INSERT INTO applications (job_id, applicant_name, email) VALUES (?, ?, ?)',
      [job_id, applicant_name, email]
    );
    return (result as any).insertId;  // Return the ID of the newly created application
  }
}

export { Application, ApplicationModel };  // Export both the interface and the model class
import pool from '../config/db.config';

interface Application {
  id?: number;
  job_id: number;
  applicant_name: string;
  email: string;
  applied_at?: string;
}

class ApplicationModel {
  async findAll(): Promise<Application[]> {
    const [rows] = await pool.query('SELECT * FROM applications ORDER BY applied_at DESC');
    return rows as Application[];
  }

  async findById(id: number): Promise<Application | null> {
    const [rows] = await pool.query('SELECT * FROM applications WHERE id = ?', [id]);
    const applications = rows as Application[];
    return applications.length ? applications[0] : null;
  }

  async findByJobId(jobId: number): Promise<Application[]> {
    const [rows] = await pool.query('SELECT * FROM applications WHERE job_id = ? ORDER BY applied_at DESC', [jobId]);
    return rows as Application[];
  }

  async create(application: Application): Promise<number> {
    const { job_id, applicant_name, email } = application;
    const [result] = await pool.query(
      'INSERT INTO applications (job_id, applicant_name, email) VALUES (?, ?, ?)',
      [job_id, applicant_name, email]
    );
    return (result as any).insertId;
  }
}

export { Application, ApplicationModel };
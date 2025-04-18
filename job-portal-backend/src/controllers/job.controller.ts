import { Request, Response } from 'express';
import { Job, JobModel } from '../models/job.model';

const jobModel = new JobModel();

class JobController {
  // Make sure each method is declared correctly
  async getAllJobs(req: Request, res: Response): Promise<void> {
    try {
      const jobs = await jobModel.findAll();
      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching jobs', error });
    }
  }

  async getJobById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const job = await jobModel.findById(id);
      
      if (!job) {
        res.status(404).json({ message: 'Job not found' });
        return;
      }
      
      res.status(200).json(job);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching job', error });
    }
  }
  async createJob(req: Request, res: Response): Promise<void> {
    try {
      console.log('Received job data in backend:', JSON.stringify(req.body, null, 2));
      
      // Check if request body is empty or undefined
      if (!req.body || Object.keys(req.body).length === 0) {
        console.error('Error: Empty request body received');
        res.status(400).json({ message: 'Request body is empty' });
        return;
      }
      
      const { job_title, company_name, location, job_type, salary_range, job_description, application_deadline } = req.body;
      
      // Validation
      if (!job_title || !company_name || !location || !job_type || !job_description || !application_deadline) {
        console.log('Validation failed, missing required fields');
        res.status(400).json({ message: 'Missing required fields' });
        return; // Add this return statement
      }
      
      // Validate application_deadline format
      let formattedDeadline = application_deadline;
      try {
        // Attempt to parse and format the date
        const date = new Date(application_deadline);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date format');
        }
        // Format as YYYY-MM-DD for MySQL
        formattedDeadline = date.toISOString().split('T')[0];
      } catch (error) {
        console.error('Error parsing date:', error);
        res.status(400).json({ message: 'Invalid date format for application deadline' });
        return;
      }
  
      const newJob: Job = {
        job_title,
        company_name,
        location,
        job_type,
        salary_range,
        job_description,
        application_deadline: formattedDeadline
      };
        console.log('Attempting to create job:', JSON.stringify(newJob, null, 2));
      const jobId = await jobModel.create(newJob);
      console.log('Job created successfully with ID:', jobId);
      
      res.status(201).json({ message: 'Job created successfully', jobId });
    } catch (error) {
      console.error('Error creating job:', error);
      // More detailed error logging
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      // Check for database connection errors
      if ((error as any).code === 'ECONNREFUSED') {
        res.status(500).json({ message: 'Database connection failed', error: 'Cannot connect to MySQL server' });
      } else if ((error as any).code === 'ER_NO_SUCH_TABLE') {
        res.status(500).json({ message: 'Table does not exist', error: (error as Error).message });
      } else {
        res.status(500).json({ message: 'Error creating job', error: (error instanceof Error ? error.message : 'Unknown error') });
      }
    }
  }
  async updateJob(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const { job_title, company_name, location, job_type, salary_range, job_description, application_deadline } = req.body;
      
      // Validation
      if (!job_title || !company_name || !location || !job_type || !job_description || !application_deadline) {
        res.status(400).json({ message: 'Missing required fields' });
      }

      const updatedJob: Job = {
        job_title,
        company_name,
        location,
        job_type,
        salary_range,
        job_description,
        application_deadline
      };
      
      const success = await jobModel.update(id, updatedJob);
      
      if (!success) {
        res.status(404).json({ message: 'Job not found or not updated' });
      }
      
      res.status(200).json({ message: 'Job updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating job', error });
    }
  }

  async deleteJob(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const success = await jobModel.delete(id);
      
      if (!success) {
        res.status(404).json({ message: 'Job not found or not deleted' });
      }
      
      res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting job', error });
    }
  }
}

// Export an instance, not the class
const jobController = new JobController();
export default jobController;
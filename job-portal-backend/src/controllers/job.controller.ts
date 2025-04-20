// job.controller.ts
// Handles HTTP requests for job-related operations

import { Request, Response } from 'express';
import { Job, JobModel } from '../models/job.model';

const jobModel = new JobModel();  // Create an instance of the JobModel

class JobController {
  // Get all jobs
  async getAllJobs(req: Request, res: Response): Promise<void> {
    try {
      const jobs = await jobModel.findAll();
      res.status(200).json(jobs);  // Return jobs with 200 OK status
    } catch (error) {
      console.error('Error fetching jobs:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ 
        message: 'Failed to fetch jobs', 
        error: errorMessage,
        status: 500
      });
    }
  }

  // Get a specific job by ID
  async getJobById(req: Request, res: Response): Promise<void> {
    try {
      // Validate ID parameter
      if (!req.params.id || isNaN(parseInt(req.params.id))) {
        res.status(400).json({ 
          message: 'Invalid job ID format',
          status: 400
        });
        return;
      }
      
      const id = parseInt(req.params.id);
      const job = await jobModel.findById(id);
      
      // If job not found, return 404
      if (!job) {
        res.status(404).json({ 
          message: 'Job not found',
          status: 404
        });
        return;
      }
      
      res.status(200).json(job);  // Return job with 200 OK status
    } catch (error) {
      console.error('Error fetching job details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ 
        message: 'Failed to fetch job details', 
        error: errorMessage,
        status: 500
      });
    }
  }
  
  // Create a new job
  async createJob(req: Request, res: Response): Promise<void> {
    try {
      console.log('Received job data in backend:', JSON.stringify(req.body, null, 2));
      
      // Check if request body is empty
      if (!req.body || Object.keys(req.body).length === 0) {
        console.error('Error: Empty request body received');
        res.status(400).json({ 
          message: 'Request body is empty',
          status: 400
        });
        return;
      }
      
      const { job_title, company_name, location, job_type, salary_range, job_description, application_deadline } = req.body;
      
      // Validate required fields
      if (!job_title || !company_name || !location || !job_type || !job_description || !application_deadline) {
        console.log('Validation failed, missing required fields');
        
        // Provide detailed validation error by listing missing fields
        const missingFields = [];
        if (!job_title) missingFields.push('job_title');
        if (!company_name) missingFields.push('company_name');
        if (!location) missingFields.push('location');
        if (!job_type) missingFields.push('job_type');
        if (!job_description) missingFields.push('job_description');
        if (!application_deadline) missingFields.push('application_deadline');
        
        res.status(400).json({ 
          message: 'Missing required fields', 
          fields: missingFields,
          status: 400
        });
        return;
      }
      
      // Validate date format
      let formattedDeadline = application_deadline;
      try {
        const date = new Date(application_deadline);
        if (isNaN(date.getTime())) {
          throw new Error('Invalid date format');
        }
        formattedDeadline = date.toISOString().split('T')[0];  // Format as YYYY-MM-DD
      } catch (error) {
        console.error('Error parsing date:', error);
        res.status(400).json({ 
          message: 'Invalid date format for application deadline',
          status: 400
        });
        return;
      }
  
      // Create job object with validated data
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
      
      res.status(201).json({ 
        message: 'Job created successfully', 
        jobId,
        status: 201
      });
    } catch (error) {
      console.error('Error creating job:', error);
      
      // Detailed error logging
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      // Specific error handling for database issues
      if ((error as any).code === 'ECONNREFUSED') {
        res.status(503).json({ 
          message: 'Database connection failed', 
          error: 'Cannot connect to MySQL server',
          status: 503
        });
      } else if ((error as any).code === 'ER_NO_SUCH_TABLE') {
        res.status(500).json({ 
          message: 'Database table does not exist', 
          error: (error as Error).message,
          status: 500
        });
      } else {
        res.status(500).json({ 
          message: 'Error creating job', 
          error: (error instanceof Error ? error.message : 'Unknown error'),
          status: 500
        });
      }
    }
  }
  
  // Update an existing job
  async updateJob(req: Request, res: Response): Promise<void> {
    try {
      // Validate ID parameter
      if (!req.params.id || isNaN(parseInt(req.params.id))) {
        res.status(400).json({ 
          message: 'Invalid job ID format',
          status: 400
        });
        return;
      }
      
      const id = parseInt(req.params.id);
      
      // Check if request body is empty
      if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400).json({ 
          message: 'Request body is empty',
          status: 400
        });
        return;
      }
      
      const { job_title, company_name, location, job_type, salary_range, job_description, application_deadline } = req.body;
      
      // Validate required fields
      if (!job_title || !company_name || !location || !job_type || !job_description || !application_deadline) {
        // List missing fields
        const missingFields = [];
        if (!job_title) missingFields.push('job_title');
        if (!company_name) missingFields.push('company_name');
        if (!location) missingFields.push('location');
        if (!job_type) missingFields.push('job_type');
        if (!job_description) missingFields.push('job_description');
        if (!application_deadline) missingFields.push('application_deadline');
        
        res.status(400).json({ 
          message: 'Missing required fields', 
          fields: missingFields,
          status: 400
        });
        return;
      }

      // Create updated job object
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
      
      // If job not found or update failed
      if (!success) {
        res.status(404).json({ 
          message: 'Job not found or not updated',
          status: 404
        });
        return;
      }
      
      res.status(200).json({ 
        message: 'Job updated successfully',
        status: 200
      });
    } catch (error) {
      console.error('Error updating job:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ 
        message: 'Error updating job', 
        error: errorMessage,
        status: 500
      });
    }
  }

  // Delete a job
  async deleteJob(req: Request, res: Response): Promise<void> {
    try {
      // Validate ID parameter
      if (!req.params.id || isNaN(parseInt(req.params.id))) {
        res.status(400).json({ 
          message: 'Invalid job ID format',
          status: 400
        });
        return;
      }
      
      const id = parseInt(req.params.id);
      const success = await jobModel.delete(id);
      
      // If job not found or deletion failed
      if (!success) {
        res.status(404).json({ 
          message: 'Job not found or not deleted',
          status: 404
        });
        return;
      }
      
      res.status(200).json({ 
        message: 'Job deleted successfully',
        status: 200
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ 
        message: 'Error deleting job', 
        error: errorMessage,
        status: 500
      });
    }
  }
}

// Export an instance of the controller, not the class itself
// This ensures all routes use the same controller instance
const jobController = new JobController();
export default jobController;
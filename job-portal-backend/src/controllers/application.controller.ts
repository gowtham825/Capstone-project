// application.controller.ts
// Handles HTTP requests for application-related operations

import { Request, Response } from 'express';
import { Application, ApplicationModel } from '../models/application.model';
import { JobModel } from '../models/job.model';

// Create instances of models
const applicationModel = new ApplicationModel();
const jobModel = new JobModel();

class ApplicationController {
  // Get all applications
  async getAllApplications(req: Request, res: Response): Promise<void> {
    try {
      const applications = await applicationModel.findAll();
      res.status(200).json(applications);  // Return applications with 200 OK status
    } catch (error) {
      console.error('Error fetching applications:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ 
        message: 'Failed to fetch applications', 
        error: errorMessage,
        status: 500
      });
    }
  }

  // Get a specific application by ID
  async getApplicationById(req: Request, res: Response): Promise<void> {
    try {
      // Validate ID parameter
      if (!req.params.id || isNaN(parseInt(req.params.id))) {
        res.status(400).json({ 
          message: 'Invalid application ID format',
          status: 400
        });
        return;
      }
      
      const id = parseInt(req.params.id);
      const application = await applicationModel.findById(id);
      
      // If application not found, return 404
      if (!application) {
        res.status(404).json({ 
          message: 'Application not found',
          status: 404
        });
        return;
      }
      
      res.status(200).json(application);  // Return application with 200 OK status
    } catch (error) {
      console.error('Error fetching application:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      res.status(500).json({ 
        message: 'Failed to fetch application details', 
        error: errorMessage,
        status: 500
      });
    }
  }

  // Submit a new job application
  async applyForJob(req: Request, res: Response): Promise<void> {
    try {
      // Validate job ID parameter
      if (!req.params.id || isNaN(parseInt(req.params.id))) {
        res.status(400).json({ 
          message: 'Invalid job ID format',
          status: 400
        });
        return;
      }
      
      const jobId = parseInt(req.params.id);
      
      // Check if request body is empty
      if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400).json({ 
          message: 'Request body is empty',
          status: 400
        });
        return;
      }
      
      const { applicant_name, email } = req.body;
      
      // Validate required fields
      if (!applicant_name || !email) {
        // List missing fields
        const missingFields = [];
        if (!applicant_name) missingFields.push('applicant_name');
        if (!email) missingFields.push('email');
        
        res.status(400).json({ 
          message: 'Missing required fields', 
          fields: missingFields,
          status: 400
        });
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ 
          message: 'Invalid email format',
          status: 400
        });
        return;
      }
      
      // Verify that the job exists before allowing application
      const job = await jobModel.findById(jobId);
      if (!job) {
        res.status(404).json({ 
          message: 'Job not found',
          status: 404
        });
        return;
      }

      // Create application object with validated data
      const newApplication: Application = {
        job_id: jobId,
        applicant_name,
        email
      };
      
      const applicationId = await applicationModel.create(newApplication);
      res.status(201).json({ 
        message: 'Application submitted successfully', 
        applicationId,
        status: 201
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Specific error handling for database issues
      if ((error as any).code === 'ECONNREFUSED') {
        res.status(503).json({ 
          message: 'Database connection failed', 
          error: 'Cannot connect to MySQL server',
          status: 503
        });
      } else {
        res.status(500).json({ 
          message: 'Error submitting application', 
          error: errorMessage,
          status: 500
        });
      }
    }
  }
}

// Export an instance of the controller, not the class itself
const applicationController = new ApplicationController();
export default applicationController;
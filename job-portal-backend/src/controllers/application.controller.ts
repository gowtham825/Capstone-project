import { Request, Response } from 'express';
import { Application, ApplicationModel } from '../models/application.model';
import { JobModel } from '../models/job.model';

const applicationModel = new ApplicationModel();
const jobModel = new JobModel();

class ApplicationController {
  async getAllApplications(req: Request, res: Response): Promise<void> {
    try {
      const applications = await applicationModel.findAll();
      res.status(200).json(applications);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching applications', error });
    }
  }

  async getApplicationById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const application = await applicationModel.findById(id);
      
      if (!application) {
        res.status(404).json({ message: 'Application not found' });
        return;
      }
      
      res.status(200).json(application);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching application', error });
    }
  }

  async applyForJob(req: Request, res: Response): Promise<void> {
    try {
      const jobId = parseInt(req.params.id);
      const { applicant_name, email } = req.body;
      
      // Validation
      if (!applicant_name || !email) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
      }
      
      // Verify that the job exists
      const job = await jobModel.findById(jobId);
      if (!job) {
        res.status(404).json({ message: 'Job not found' });
        return;
      }

      const newApplication: Application = {
        job_id: jobId,
        applicant_name,
        email
      };
      
      const applicationId = await applicationModel.create(newApplication);
      res.status(201).json({ message: 'Application submitted successfully', applicationId });
    } catch (error) {
      res.status(500).json({ message: 'Error submitting application', error });
    }
  }
}

// Export an instance, not the class
const applicationController = new ApplicationController();
export default applicationController;
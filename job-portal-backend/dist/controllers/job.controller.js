"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const job_model_1 = require("../models/job.model");
const jobModel = new job_model_1.JobModel();
class JobController {
    // Make sure each method is declared correctly
    getAllJobs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobs = yield jobModel.findAll();
                res.status(200).json(jobs);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching jobs', error });
            }
        });
    }
    getJobById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const job = yield jobModel.findById(id);
                if (!job) {
                    res.status(404).json({ message: 'Job not found' });
                    return;
                }
                res.status(200).json(job);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching job', error });
            }
        });
    }
    createJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Received job data in backend:', JSON.stringify(req.body, null, 2));
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
                }
                catch (error) {
                    console.error('Error parsing date:', error);
                    res.status(400).json({ message: 'Invalid date format for application deadline' });
                    return;
                }
                const newJob = {
                    job_title,
                    company_name,
                    location,
                    job_type,
                    salary_range,
                    job_description,
                    application_deadline: formattedDeadline
                };
                console.log('Attempting to create job:', JSON.stringify(newJob, null, 2));
                const jobId = yield jobModel.create(newJob);
                console.log('Job created successfully with ID:', jobId);
                res.status(201).json({ message: 'Job created successfully', jobId });
            }
            catch (error) {
                console.error('Error creating job:', error);
                res.status(500).json({ message: 'Error creating job', error });
            }
        });
    }
    updateJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const { job_title, company_name, location, job_type, salary_range, job_description, application_deadline } = req.body;
                // Validation
                if (!job_title || !company_name || !location || !job_type || !job_description || !application_deadline) {
                    res.status(400).json({ message: 'Missing required fields' });
                }
                const updatedJob = {
                    job_title,
                    company_name,
                    location,
                    job_type,
                    salary_range,
                    job_description,
                    application_deadline
                };
                const success = yield jobModel.update(id, updatedJob);
                if (!success) {
                    res.status(404).json({ message: 'Job not found or not updated' });
                }
                res.status(200).json({ message: 'Job updated successfully' });
            }
            catch (error) {
                res.status(500).json({ message: 'Error updating job', error });
            }
        });
    }
    deleteJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const success = yield jobModel.delete(id);
                if (!success) {
                    res.status(404).json({ message: 'Job not found or not deleted' });
                }
                res.status(200).json({ message: 'Job deleted successfully' });
            }
            catch (error) {
                res.status(500).json({ message: 'Error deleting job', error });
            }
        });
    }
}
// Export an instance, not the class
const jobController = new JobController();
exports.default = jobController;

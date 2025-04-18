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
const application_model_1 = require("../models/application.model");
const job_model_1 = require("../models/job.model");
const applicationModel = new application_model_1.ApplicationModel();
const jobModel = new job_model_1.JobModel();
class ApplicationController {
    getAllApplications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const applications = yield applicationModel.findAll();
                res.status(200).json(applications);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching applications', error });
            }
        });
    }
    getApplicationById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = parseInt(req.params.id);
                const application = yield applicationModel.findById(id);
                if (!application) {
                    res.status(404).json({ message: 'Application not found' });
                    return;
                }
                res.status(200).json(application);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching application', error });
            }
        });
    }
    applyForJob(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const jobId = parseInt(req.params.id);
                const { applicant_name, email } = req.body;
                // Validation
                if (!applicant_name || !email) {
                    res.status(400).json({ message: 'Missing required fields' });
                    return;
                }
                // Verify that the job exists
                const job = yield jobModel.findById(jobId);
                if (!job) {
                    res.status(404).json({ message: 'Job not found' });
                    return;
                }
                const newApplication = {
                    job_id: jobId,
                    applicant_name,
                    email
                };
                const applicationId = yield applicationModel.create(newApplication);
                res.status(201).json({ message: 'Application submitted successfully', applicationId });
            }
            catch (error) {
                res.status(500).json({ message: 'Error submitting application', error });
            }
        });
    }
}
// Export an instance, not the class
const applicationController = new ApplicationController();
exports.default = applicationController;

import express from 'express';
import ApplicationController from '../controllers/application.controller';

const router = express.Router();

router.get('/applications', ApplicationController.getAllApplications);
router.get('/applications/:id', ApplicationController.getApplicationById);
router.post('/jobs/:id/apply', ApplicationController.applyForJob);

export default router;
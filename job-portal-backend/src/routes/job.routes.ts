import express from 'express';
import JobController from '../controllers/job.controller';

const app = express();
const router = express.Router();

// Correct binding of controller methods
router.get('/jobs', (req, res) => JobController.getAllJobs(req, res));
router.post('/jobs', (req, res) => JobController.createJob(req, res));
router.get('/jobs/:id', (req, res) => JobController.getJobById(req, res));
router.put('/jobs/:id', (req, res) => JobController.updateJob(req, res));
router.delete('/jobs/:id', (req, res) => JobController.deleteJob(req, res));
app.use('/api', router);
export default router;
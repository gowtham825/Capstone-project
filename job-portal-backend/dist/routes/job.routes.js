"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const job_controller_1 = __importDefault(require("../controllers/job.controller"));
const app = (0, express_1.default)();
const router = express_1.default.Router();
// Correct binding of controller methods
router.get('/jobs', (req, res) => job_controller_1.default.getAllJobs(req, res));
router.post('/jobs', (req, res) => job_controller_1.default.createJob(req, res));
router.get('/jobs/:id', (req, res) => job_controller_1.default.getJobById(req, res));
// router.put('/jobs/:id', (req, res) => JobController.updateJob(req, res));
// router.delete('/jobs/:id', (req, res) => JobController.deleteJob(req, res));
app.use('/api', router);
exports.default = router;

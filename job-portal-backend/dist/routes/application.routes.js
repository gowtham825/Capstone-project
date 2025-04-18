"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const application_controller_1 = __importDefault(require("../controllers/application.controller"));
const router = express_1.default.Router();
router.get('/applications', application_controller_1.default.getAllApplications);
router.get('/applications/:id', application_controller_1.default.getApplicationById);
router.post('/jobs/:id/apply', application_controller_1.default.applyForJob);
exports.default = router;

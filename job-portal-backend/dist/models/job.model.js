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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobModel = void 0;
const db_config_1 = __importDefault(require("../config/db.config"));
class JobModel {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_config_1.default.query('SELECT * FROM jobs ORDER BY created_at DESC');
            return rows;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_config_1.default.query('SELECT * FROM jobs WHERE id = ?', [id]);
            const jobs = rows;
            return jobs.length ? jobs[0] : null;
        });
    }
    create(job) {
        return __awaiter(this, void 0, void 0, function* () {
            const { job_title, company_name, location, job_type, salary_range, job_description, application_deadline } = job;
            // Ensure application_deadline is in correct format (YYYY-MM-DD)
            let formattedDeadline = application_deadline;
            // Log the incoming date for debugging
            console.log('Original application_deadline:', application_deadline);
            try {
                // Check if it's already in YYYY-MM-DD format
                if (application_deadline && !application_deadline.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    // Parse the date and format it correctly
                    const date = new Date(application_deadline);
                    if (!isNaN(date.getTime())) {
                        formattedDeadline = date.toISOString().split('T')[0];
                    }
                    else {
                        // If date is invalid, use current date
                        formattedDeadline = new Date().toISOString().split('T')[0];
                        console.warn('Invalid date provided, using current date as fallback');
                    }
                }
                console.log('Formatted application_deadline:', formattedDeadline);
                const [result] = yield db_config_1.default.query('INSERT INTO jobs (job_title, company_name, location, job_type, salary_range, job_description, application_deadline) VALUES (?, ?, ?, ?, ?, ?, ?)', [job_title, company_name, location, job_type, salary_range, job_description, formattedDeadline]);
                return result.insertId;
            }
            catch (error) {
                console.error('Error in create job:', error);
                throw error;
            }
        });
    }
    update(id, job) {
        return __awaiter(this, void 0, void 0, function* () {
            const { job_title, company_name, location, job_type, salary_range, job_description, application_deadline } = job;
            // Ensure application_deadline is in correct format (YYYY-MM-DD)
            let formattedDeadline = application_deadline;
            // Log the incoming date for debugging
            console.log('Original application_deadline for update:', application_deadline);
            try {
                // Check if it's already in YYYY-MM-DD format
                if (application_deadline && !application_deadline.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    // Parse the date and format it correctly
                    const date = new Date(application_deadline);
                    if (!isNaN(date.getTime())) {
                        formattedDeadline = date.toISOString().split('T')[0];
                    }
                    else {
                        // If date is invalid, use current date
                        formattedDeadline = new Date().toISOString().split('T')[0];
                        console.warn('Invalid date provided for update, using current date as fallback');
                    }
                }
                console.log('Formatted application_deadline for update:', formattedDeadline);
                const [result] = yield db_config_1.default.query('UPDATE jobs SET job_title = ?, company_name = ?, location = ?, job_type = ?, salary_range = ?, job_description = ?, application_deadline = ? WHERE id = ?', [job_title, company_name, location, job_type, salary_range, job_description, formattedDeadline, id]);
                return result.affectedRows > 0;
            }
            catch (error) {
                console.error('Error in update job:', error);
                throw error;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield db_config_1.default.query('DELETE FROM jobs WHERE id = ?', [id]);
            return result.affectedRows > 0;
        });
    }
}
exports.JobModel = JobModel;

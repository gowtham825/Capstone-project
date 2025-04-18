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
exports.ApplicationModel = void 0;
const db_config_1 = __importDefault(require("../config/db.config"));
class ApplicationModel {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_config_1.default.query('SELECT * FROM applications ORDER BY applied_at DESC');
            return rows;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_config_1.default.query('SELECT * FROM applications WHERE id = ?', [id]);
            const applications = rows;
            return applications.length ? applications[0] : null;
        });
    }
    findByJobId(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield db_config_1.default.query('SELECT * FROM applications WHERE job_id = ? ORDER BY applied_at DESC', [jobId]);
            return rows;
        });
    }
    create(application) {
        return __awaiter(this, void 0, void 0, function* () {
            const { job_id, applicant_name, email } = application;
            const [result] = yield db_config_1.default.query('INSERT INTO applications (job_id, applicant_name, email) VALUES (?, ?, ?)', [job_id, applicant_name, email]);
            return result.insertId;
        });
    }
}
exports.ApplicationModel = ApplicationModel;

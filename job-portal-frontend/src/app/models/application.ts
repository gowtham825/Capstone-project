import { Job } from './job';

export interface Application {
  id?: number;
  name: string;
  email: string;
  jobId: number;
  job?: Job;
  appliedAt: Date;
}
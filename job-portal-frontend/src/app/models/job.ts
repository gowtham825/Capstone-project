export interface Job {
  id?: number;
  job_title: string;           // Instead of title
  company_name: string;        // Instead of company
  location: string;
  job_type: string;            // Instead of jobType
  salary_range?: string;       // Instead of salary
  job_description: string;     // Instead of description
  application_deadline: string; // Instead of deadline
  created_at?: string;
}
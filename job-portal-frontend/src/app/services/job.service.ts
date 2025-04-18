import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job } from '../models/job';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Get all jobs
  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/jobs`);
  }

  // Get job by id (missing method)
  getJobById(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/jobs/${id}`);
  }

  // Create new job
  createJob(job: Job): Observable<any> {
    console.log('Service sending job data:', job);
    return this.http.post<any>(`${this.apiUrl}/jobs`, job);
  }
  // Update job
  updateJob(id: number, job: Job): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/jobs/${id}`, job);
  }

  // Delete job
  deleteJob(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/jobs/${id}`);
  }
}
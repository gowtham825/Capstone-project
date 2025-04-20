// services/application.service.ts
// Service responsible for handling API calls related to job applications

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'  // This makes the service available throughout the app
})
export class ApplicationService {
  private apiUrl = 'http://localhost:3000/api';  // Base URL for the backend API

  constructor(private http: HttpClient) { }  // Inject the HttpClient for making API requests

  // Get all applications from the server
  getApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/applications`);  // GET request to fetch all applications
  }

  // Get a specific application by its ID
  getApplicationById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/applications/${id}`);  // GET request with ID parameter
  }

  // Submit a new job application for a specific job
  applyForJob(jobId: number, application: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/jobs/${jobId}/apply`, application);  // POST request to submit application
  }
}
// services/job.service.ts
// Service responsible for handling API calls related to job listings

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { Job } from '../models/job';

@Injectable({
  providedIn: 'root'  // Makes service available app-wide
})
export class JobService {
  private apiUrl = 'http://localhost:3000/api';  // Base URL for the backend API

  constructor(private http: HttpClient) { }  // Inject HttpClient for API calls

  // Comprehensive error handling method for HTTP requests
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error (network issues, etc.)
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error with status code
      if (error.error && error.error.message) {
        // Use server-provided error message if available
        errorMessage = error.error.message;
      } else {
        // Generate user-friendly error message based on status code
        switch (error.status) {
          case 400: errorMessage = 'Bad request - Please check your input'; break;
          case 404: errorMessage = 'Resource not found'; break;
          case 500: errorMessage = 'Server error - Please try again later'; break;
          case 503: errorMessage = 'Service unavailable - Database connection failed'; break;
          default: errorMessage = `Server returned error code ${error.status}`;
        }
      }
    }
    
    console.error('Error occurred:', error);  // Log full error for debugging
    return throwError(() => new Error(errorMessage));  // Return throwable error for component to handle
  }

  // Get all job listings
  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.apiUrl}/jobs`)
      .pipe(
        retry(1),  // Retry failed request once before failing
        catchError(this.handleError)  // Process any errors through the handler
      );
  }

  // Get a specific job by its ID
  getJobById(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/jobs/${id}`)
      .pipe(
        retry(1),  // Retry failed request once
        catchError(this.handleError)  // Process errors
      );
  }

  // Create a new job listing
  createJob(job: Job): Observable<any> {
    console.log('Service sending job data:', job);  // Debug log
    return this.http.post<any>(`${this.apiUrl}/jobs`, job)
      .pipe(
        catchError(this.handleError)  // Process errors
      );
  }
  
  // Update an existing job listing
  updateJob(id: number, job: Job): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/jobs/${id}`, job)
      .pipe(
        catchError(this.handleError)  // Process errors
      );
  }

  // Delete a job listing
  deleteJob(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/jobs/${id}`)
      .pipe(
        catchError(this.handleError)  // Process errors
      );
  }
}
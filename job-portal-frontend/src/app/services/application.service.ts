import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Get all applications
  getApplications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/applications`);
  }

  // Get application by id
  getApplicationById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/applications/${id}`);
  }

  // Submit application
  applyForJob(jobId: number, application: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/jobs/${jobId}/apply`, application);
  }
}
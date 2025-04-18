// src/app/services/in-memory-data.service.ts
import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo, ResponseOptions, STATUS } from 'angular-in-memory-web-api';
import { Application } from '../models/application';
import { Job } from '../models/job';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const jobs = [
      { 
        id: 1, 
        title: 'Frontend Developer', 
        company: 'Tech Solutions', 
        location: 'New York, NY', 
        jobType: 'Full-time', 
        salary: '$80,000 - $100,000', 
        description: 'We are looking for a skilled Frontend Developer...', 
        deadline: new Date('2025-05-30') 
      },
      { 
        id: 2, 
        title: 'Backend Engineer', 
        company: 'Data Systems Inc', 
        location: 'Remote', 
        jobType: 'Contract', 
        salary: '$50/hr', 
        description: 'Seeking an experienced Backend Engineer...', 
        deadline: new Date('2025-05-15') 
      }
    ];
    
    const applications: Application[] = [];
    
    return { jobs, applications };
  }

  // Overrides the genId method to ensure that a job or application always has an id
  genId<T extends Job | Application>(collection: T[], collectionName: string): number {
    return collection.length > 0 ? Math.max(...collection.map(item => item.id as number)) + 1 : 1;
  }

  // Optional: Customize POST requests to handle application submissions better
  post(reqInfo: RequestInfo) {
    // Only intercept applications
    if (reqInfo.collectionName === 'applications') {
      const application = reqInfo.utils.getJsonBody(reqInfo.req) as Application;
      
      // Ensure jobId exists and is valid
      if (!application.jobId) {
        const options: ResponseOptions = {
          body: { error: "Job ID is required" },
          status: STATUS.BAD_REQUEST
        };
        return reqInfo.utils.createResponse$(() => options);
      }
      
      // Set id and appliedAt if not provided
      application.id = this.genId(reqInfo.collection, 'applications');
      if (!application.appliedAt) {
        application.appliedAt = new Date();
      }
      
      // Add to collection
      reqInfo.collection.push(application);
      
      // Return successful response
      const options: ResponseOptions = {
        body: application,
        status: STATUS.CREATED
      };
      return reqInfo.utils.createResponse$(() => options);
    }
    
    // For other collections, let the default handler do its job
    return undefined;
  }
};
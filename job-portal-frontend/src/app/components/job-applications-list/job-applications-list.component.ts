import { Component, OnInit } from '@angular/core';
import { Application } from '../../models/application';
import { ApplicationService } from '../../services/application.service';

@Component({
  selector: 'app-job-applications-list',
  templateUrl: './job-applications-list.component.html',
  styleUrls: ['./job-applications-list.component.scss']
})
export class JobApplicationsListComponent implements OnInit {
  applications: Application[] = [];
  displayedColumns: string[] = ['name', 'email', 'jobTitle', 'company', 'appliedAt'];

  constructor(private applicationService: ApplicationService) { }

  ngOnInit(): void {
    this.getApplications();
  }

  getApplications(): void {
    this.applicationService.getApplications().subscribe(applications => {
      this.applications = applications;
    });
  }
}
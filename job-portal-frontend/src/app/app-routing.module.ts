import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Ensure the correct path to HomeComponent
import { HomeComponent } from './components/home/home.component'; // New home component
import { JobListComponent } from './components/job-list/job-list.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { JobFormComponent } from './components/job-form/job-form.component';
import { JobApplicationFormComponent } from './components/job-application-form/job-application-form.component';
import { JobApplicationsListComponent } from './components/job-applications-list/job-applications-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { 
    path: 'job-searcher', 
    children: [
      { path: '', redirectTo: 'jobs', pathMatch: 'full' },
      { path: 'jobs', component: JobListComponent },
      { path: 'jobs/:id', component: JobDetailsComponent },
      { path: 'jobs/:id/edit', component: JobFormComponent }, // Add this line
      { path: 'jobs/:id/apply', component: JobApplicationFormComponent },
      { path: 'applications', component: JobApplicationsListComponent }
    ]
  },
  { 
    path: 'employee', 
    children: [
      { path: '', redirectTo: 'jobs', pathMatch: 'full' },
      { path: 'jobs', component: JobListComponent },
      { path: 'jobs/new', component: JobFormComponent },
      { path: 'jobs/edit/:id', component: JobFormComponent },
      { path: 'jobs/:id', component: JobDetailsComponent },
      { path: 'applications', component: JobApplicationsListComponent }
    ]
  },
  { path: '**', redirectTo: '' } // Redirect to home for any undefined routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
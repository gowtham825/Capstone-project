// app.module.ts
// Main application module that configures the application

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorInterceptor } from './shared/interceptors/http-error.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Component imports
import { JobListComponent } from './components/job-list/job-list.component';
import { JobDetailsComponent } from './components/job-details/job-details.component';
import { JobFormComponent } from './components/job-form/job-form.component';
import { JobApplicationFormComponent } from './components/job-application-form/job-application-form.component';
import { JobApplicationsListComponent } from './components/job-applications-list/job-applications-list.component';
import { ErrorMessageComponent } from './shared/error-message/error-message.component';
import { HomeComponent } from './components/home/home.component';

// Angular Material imports
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatNativeDateModule } from '@angular/material/core';

// Error handling imports
import { ErrorHandler } from '@angular/core';
import { GlobalErrorHandlerService } from './shared/services/global-error-handler.service';
// import { RouterModule } from '@angular/router';

@NgModule({
  // Component declarations
  declarations: [
    AppComponent,
    JobListComponent,
    JobDetailsComponent,
    HomeComponent,
    JobFormComponent,
    ErrorMessageComponent,
    JobApplicationFormComponent,
    JobApplicationsListComponent
  ],
  // Module imports
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
    
    // Angular Material modules
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    MatToolbarModule,
    MatNativeDateModule
  ],
  // Service providers
  providers: [
    // HTTP interceptor for global error handling
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    },
    // Global error handler
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService
    },
  ],
  bootstrap: [AppComponent]  // Root component to bootstrap
})
export class AppModule { }
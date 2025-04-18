import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobApplicationsListComponent } from './job-applications-list.component';

describe('JobApplicationsListComponent', () => {
  let component: JobApplicationsListComponent;
  let fixture: ComponentFixture<JobApplicationsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobApplicationsListComponent]
    });
    fixture = TestBed.createComponent(JobApplicationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

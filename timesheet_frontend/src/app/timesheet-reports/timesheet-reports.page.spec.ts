import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimesheetReportsPage } from './timesheet-reports.page';

describe('TimesheetReportsPage', () => {
  let component: TimesheetReportsPage;
  let fixture: ComponentFixture<TimesheetReportsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetReportsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

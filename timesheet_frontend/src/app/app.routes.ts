import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),  data: { hideHeader: true }
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.page').then( m => m.RegisterPage),  data: { hideHeader: true }
  },
  // {
  //   path: 'timesheet-entry',
  //   loadComponent: () => import('./timesheet-entry/timesheet-entry.page').then( m => m.TimesheetEntryPage)
  // },
  {
    path: 'calendar',
    loadComponent: () => import('./calendar/calendar.page').then( m => m.CalendarPage),data: { title: 'Calendar' }
  },
  {
    path: 'timesheet-reports',
    loadComponent: () => import('./timesheet-reports/timesheet-reports.page').then( m => m.TimesheetReportsPage), data: { title: 'Timesheet Reports' }
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.page').then( m => m.DashboardPage),data: { title: 'Dashboard' }
  },
    // ✅ ADD THIS (EDIT MODE)
  {
    path: 'timesheet-entry/:timesheetId/:leaveId',
    loadComponent: () =>
      import('./timesheet-entry/timesheet-entry.page')
        .then(m => m.TimesheetEntryPage),data: { title: 'Timesheet Entry' }
  },

  // ✅ KEEP THIS (NEW ENTRY MODE)
  {
    path: 'timesheet-entry',
    loadComponent: () =>
      import('./timesheet-entry/timesheet-entry.page')
        .then(m => m.TimesheetEntryPage),data: { title: 'Timesheet Entry' }
  },
 
 
];

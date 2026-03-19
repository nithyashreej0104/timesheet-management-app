


// // import { Component } from '@angular/core';
// // import { HttpClient } from '@angular/common/http';
// // import { Router } from '@angular/router';
// // import { IonicModule, PopoverController } from '@ionic/angular';
// // import { DatePopoverComponent } from '../timesheet-entry/date-popover.component';
// // import { CommonModule } from '@angular/common';
// // import { HttpClientModule } from '@angular/common/http';
// // import { RouterModule } from '@angular/router';
// // import { UserService } from '../user.service';

// // @Component({
// //   selector: 'app-timesheet-reports',
// //   templateUrl: './timesheet-reports.page.html',
// //   styleUrls: ['./timesheet-reports.page.scss'],
// //   standalone: true,
// //   imports: [
// //     IonicModule,
// //     CommonModule,
// //     RouterModule,
// //     HttpClientModule
// //   ]
// // })
// // export class TimesheetReportsPage {

// //   /* =============================
// //      USER
// //      ============================= */
// //   employeeId: string = '';

// //   /* =============================
// //      DATE FILTER (IMPORTANT)
// //      ============================= */

// //   // 👉 For UI display (DatePipe)
// //   startDateObj: Date | null = null;
// //   endDateObj: Date | null = null;

// //   // 👉 For filtering logic (YYYY-MM-DD)
// //   startDate: string | null = null;
// //   endDate: string | null = null;

// //   /* =============================
// //      FILTER STATE
// //      ============================= */
// //   selectedStatus: string = 'All';

// //   allReports: any[] = [];
// //   viewReports: any[] = [];

// //   constructor(
// //     private http: HttpClient,
// //     private router: Router,
// //     private popoverCtrl: PopoverController,
// //     private userService: UserService
// //   ) {}

// //   /* =============================
// //      PAGE ENTER
// //      ============================= */
// //   // ionViewWillEnter() {

// //   //   this.userService.user$.subscribe(user => {
// //   //     if (user?.Employee_Id) {
// //   //       this.employeeId = user.Employee_Id;
// //   //       this.loadReports();
// //   //     } else {
// //   //       console.error('User not logged in');
// //   //     }
// //   //   });
// //   // }

// //   ionViewWillEnter() {

// //   // ✅ CLEAR FILTERS WHEN PAGE COMES BACK
// //   this.clearFilters();

// //   this.userService.user$.subscribe(user => {
// //     if (user?.Employee_Id) {
// //       this.employeeId = user.Employee_Id;
// //       this.loadReports();
// //     }
// //   });
// // }

// //   /* =============================
// //      LOAD REPORTS
// //      ============================= */
// //   loadReports() {
// //     this.http
// //       .get<any[]>(`/api/project/getEmployeeDetails/${this.employeeId}`)
// //       .subscribe({
// //         next: (res) => {
// //           this.allReports = res;
// //           this.viewReports = [...res];
// //         },
// //         error: (err) => {
// //           console.error('Failed to load reports', err);
// //         }
// //       });
// //   }

// //   /* =============================
// //      STATUS FILTER
// //      ============================= */

// //      filterByStatus(status: string) {
// //   this.selectedStatus = status;

// //   // 🔥 If user clicks ALL → clear date filter also
// //   if (status === 'All') {
// //     this.startDate = null;
// //     this.endDate = null;
// //     this.startDateObj = null;
// //     this.endDateObj = null;

// //     this.viewReports = [...this.allReports];
// //     return;
// //   }

// //   this.applyFilters();
// // }


// //   /* =============================
// //      APPLY FILTERS
// //      ============================= */

// // applyFilters() {
// //   this.viewReports = this.allReports.filter(row => {

// //     const rowStart = row.Start_Date && row.Start_Date !== '-'
// //       ? new Date(row.Start_Date)
// //       : null;

// //     const rowEnd = row.End_Date && row.End_Date !== '-'
// //       ? new Date(row.End_Date)
// //       : null;

// //     const filterStart = this.startDate ? new Date(this.startDate) : null;
// //     const filterEnd = this.endDate ? new Date(this.endDate) : null;

// //     const statusMatch =
// //       this.selectedStatus === 'All' ||
// //       row.Timesheet_Status === this.selectedStatus;

// //     const startMatch =
// //       !filterStart || !rowStart || rowStart >= filterStart;

// //     const endMatch =
// //       !filterEnd || !rowEnd || rowEnd <= filterEnd;

// //     return statusMatch && startMatch && endMatch;
// //   });
// // }

// //   /* =============================h h       
// //      DATE PICKER
// //      ============================= */

// //   async openCalendar(type: 'start' | 'end') {

// //     const popover = await this.popoverCtrl.create({
// //       component: DatePopoverComponent,
// //       componentProps: {
// //         selected: new Date()
// //       },
// //       translucent: true,
// //       showBackdrop: true
// //     });

// //     await popover.present();
// //     const { data } = await popover.onDidDismiss();

// //     if (data) {
// //       const pickedDate = new Date(data);
// //       const localStr = this.formatDateLocal(pickedDate);

// //       if (type === 'start') {
// //         this.startDateObj = pickedDate;
// //         this.startDate = localStr;
// //       } else {
// //         this.endDateObj = pickedDate;
// //         this.endDate = localStr;
// //       }

// //       this.applyFilters();
// //     }
// //   }

// //   /* =============================
// //      LOCAL DATE FORMAT (YYYY-MM-DD)
// //      ============================= */

// //   formatDateLocal(date: Date): string {
// //     const y = date.getFullYear();
// //     const m = String(date.getMonth() + 1).padStart(2, '0');
// //     const d = String(date.getDate()).padStart(2, '0');
// //     return `${y}-${m}-${d}`;
// //   }

// //   /* =============================
// //      CARD DATE FORMAT (US)
// //      ============================= */
// //   formatCardDate(dateStr: string): string {
// //     if (!dateStr || dateStr === '-') return '-';

// //     const d = new Date(dateStr);
// //     return d.toLocaleDateString('en-US', {
// //       month: 'short',   // Jan
// //       day: '2-digit',
// //       year: 'numeric'
// //     });
// //   }

// //   /* =============================
// //      EDIT NAVIGATION
// //      ============================= */
// // editTimesheet(row: any) {
// //   if (!row.Timesheet_Id) return;

// //   this.router.navigate([
// //     '/timesheet-entry',
// //     row.Timesheet_Id,
// //     row.Leave_Id || 0
// //   ]);
// // }

// //   /* =============================
// //      CLEAR FILTERS
// //      ============================= */
// //   clearFilters() {
// //     this.selectedStatus = 'All';

// //     this.startDateObj = null;
// //     this.endDateObj = null;

// //     this.startDate = null;
// //     this.endDate = null;

// //     this.viewReports = [...this.allReports];
// //   }
// // }


// import { Component } from '@angular/core';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { Router } from '@angular/router';
// import {
//   IonicModule,
//   PopoverController
// } from '@ionic/angular';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';

// import { DatePopoverComponent } from '../timesheet-entry/date-popover.component';
// import { UserService } from '../user.service';
// import { AppHeaderComponent } from '../sidebar/app-header/app-header.component';

// @Component({
//   selector: 'app-timesheet-reports',
//   templateUrl: './timesheet-reports.page.html',
//   styleUrls: ['./timesheet-reports.page.scss'],
//   standalone: true,
//   imports: [
//     IonicModule,
//     CommonModule,
//     RouterModule,
//     HttpClientModule,
//     AppHeaderComponent
//   ]
// })
// export class TimesheetReportsPage {

//   /* ================= USER ================= */
//   employeeId: string = '';

//   /* ================= DATE FILTER ================= */

//   // For UI display
//   startDateObj: Date | null = null;
//   endDateObj: Date | null = null;

//   // For filtering logic (YYYY-MM-DD)
//   startDate: string | null = null;
//   endDate: string | null = null;

//   /* ================= STATUS FILTER ================= */
//   selectedStatus: string = 'All';

//   /* ================= DATA ================= */
//   allReports: any[] = [];
//   viewReports: any[] = [];

//   constructor(
//     private http: HttpClient,
//     private router: Router,
//     private popoverCtrl: PopoverController,
//     private userService: UserService
//   ) {}

//   /* ================= PAGE ENTER ================= */
//   ionViewWillEnter() {
//     this.clearFilters();

//     this.userService.user$.subscribe(user => {
//       if (user?.Employee_Id) {
//         this.employeeId = user.Employee_Id;
//         this.loadReports();
//       }
//     });
//   }

//   /* ================= LOAD REPORTS ================= */
//   loadReports() {
//     this.http
//       .get<any[]>(`/api/project/getEmployeeDetails/${this.employeeId}`)
//       .subscribe({
//         next: res => {
//           this.allReports = res;
//           this.viewReports = [...res];
//         },
//         error: err => {
//           console.error('Failed to load reports', err);
//         }
//       });
//   }

//   /* ================= STATUS BUTTON FILTER ================= */
//   filterByStatus(status: string) {
//     this.selectedStatus = status;

//     // If ALL → reset everything
//     if (status === 'All') {
//       this.clearFilters();
//       return;
//     }

//     // Apply status filter immediately
//     this.viewReports = this.allReports.filter(
//       row => row.Timesheet_Status === status
//     );
//   }

//   /* ================= FILTER BUTTON ================= */
//   applyFilters() {
//     this.viewReports = this.allReports.filter(row => {

//       const rowStart = row.Start_Date && row.Start_Date !== '-'
//         ? this.normalizeDate(new Date(row.Start_Date))
//         : null;

//       const rowEnd = row.End_Date && row.End_Date !== '-'
//         ? this.normalizeDate(new Date(row.End_Date))
//         : null;

//       const filterStart = this.startDate
//         ? this.normalizeDate(new Date(this.startDate))
//         : null;

//       const filterEnd = this.endDate
//         ? this.normalizeDate(new Date(this.endDate))
//         : null;

//       const statusMatch =
//         this.selectedStatus === 'All' ||
//         row.Timesheet_Status === this.selectedStatus;

//       const startMatch =
//         !filterStart || !rowStart || rowStart >= filterStart;

//       const endMatch =
//         !filterEnd || !rowEnd || rowEnd <= filterEnd;

//       return statusMatch && startMatch && endMatch;
//     });
//   }

//   /* ================= DATE PICKER ================= */
//   async openCalendar(type: 'start' | 'end') {

//     const popover = await this.popoverCtrl.create({
//       component: DatePopoverComponent,
//       componentProps: {
//         selected: new Date()
//       },
//       translucent: true,
//       showBackdrop: true
//     });

//     await popover.present();
//     const { data } = await popover.onDidDismiss();

//     if (data) {
//       const pickedDate = new Date(data);
//       const localStr = this.formatDateLocal(pickedDate);

//       if (type === 'start') {
//         this.startDateObj = pickedDate;
//         this.startDate = localStr;
//       } else {
//         this.endDateObj = pickedDate;
//         this.endDate = localStr;
//       }

//       // ❌ DO NOT auto-filter here
//       // Filtering happens ONLY on Filter button click
//     }
//   }

//   /* ================= DATE NORMALIZATION ================= */
//   normalizeDate(date: Date): Date {
//     const d = new Date(date);
//     d.setHours(0, 0, 0, 0);
//     return d;
//   }

//   /* ================= DATE FORMAT (YYYY-MM-DD) ================= */
//   formatDateLocal(date: Date): string {
//     const y = date.getFullYear();
//     const m = String(date.getMonth() + 1).padStart(2, '0');
//     const d = String(date.getDate()).padStart(2, '0');
//     return `${y}-${m}-${d}`;
//   }

//   /* ================= CARD DATE FORMAT ================= */
//   formatCardDate(dateStr: string): string {
//     if (!dateStr || dateStr === '-') return '-';

//     const d = new Date(dateStr);
//     return d.toLocaleDateString('en-US', {
//       month: 'short',
//       day: '2-digit',
//       year: 'numeric'
//     });
//   }

//   /* ================= EDIT NAVIGATION ================= */
//   // editTimesheet(row: any) {
//   //   if (!row.Timesheet_Id) return;

//   //   this.router.navigate([
//   //     '/timesheet-entry',
//   //     row.Timesheet_Id,
//   //     row.Leave_Id || 0
//   //   ]);
//   // }


//   editTimesheet(row: any) {
//   if (!row.Timesheet_Id) return;

//   this.router.navigate([
//     '/timesheet-entry',
//     row.Timesheet_Id,
//     row.Leave_Id || 0
//   ]);
// }

//   /* ================= CLEAR FILTERS ================= */
//   clearFilters() {
//     this.selectedStatus = 'All';

//     this.startDateObj = null;
//     this.endDateObj = null;

//     this.startDate = null;
//     this.endDate = null;

//     this.viewReports = [...this.allReports];
//   }
// }

// import { Component } from '@angular/core';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { Router } from '@angular/router';
// import {
//   IonicModule,
//   PopoverController
// } from '@ionic/angular';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { FormsModule } from '@angular/forms';

// import { DatePopoverComponent } from '../timesheet-entry/date-popover.component';
// import { UserService } from '../user.service';

// @Component({
//   selector: 'app-timesheet-reports',
//   templateUrl: './timesheet-reports.page.html',
//   styleUrls: ['./timesheet-reports.page.scss'],
//   standalone: true,
//   imports: [
//     IonicModule,
//     CommonModule,
//     RouterModule,
//     HttpClientModule,
//     FormsModule
//   ]
// })
// export class TimesheetReportsPage {

//   /* ================= USER / ROLE ================= */
//   employeeId: string = '';
//   employeeRole: 'User' | 'Admin' = 'User';

//   /* ================= DATE FILTER ================= */
//   startDate: string | null = null;
//   endDate: string | null = null;

//   /* ================= STATUS FILTER ================= */
//   selectedStatus: string = 'All';

//   /* ================= DATA ================= */
//   allReports: any[] = [];
//   viewReports: any[] = [];

//   constructor(
//     private http: HttpClient,
//     private router: Router,
//     private popoverCtrl: PopoverController,
//     private userService: UserService
//   ) {}

//   /* ================= PAGE ENTER ================= */
//   ionViewWillEnter() {
//     this.clearFilters();

//     this.userService.user$.subscribe(user => {
//       if (!user) return;

//       this.employeeId = user.Employee_Id;
//       this.employeeRole = user.Employee_Role;

//       if (this.employeeRole === 'User') {
//         this.loadUserReports();
//       } else {
//         this.loadAdminReports();
//       }
//     });
//   }

//   /* ================= USER REPORT ================= */
//   loadUserReports() {
//     this.http
//       .get<any[]>(`/api/project/getEmployeeDetails/${this.employeeId}`)
//       .subscribe({
//         next: res => {
//           this.allReports = res;
//           this.viewReports = [...res];
//         },
//         error: err => console.error('User report error', err)
//       });
//   }

//   /* ================= ADMIN REPORT ================= */
//   loadAdminReports() {
//     this.http
//       .get<any[]>(`/api/project/admin/reports`)
//       .subscribe({
//         next: res => {
//           this.allReports = res;
//           this.viewReports = [...res];
//         },
//         error: err => console.error('Admin report error', err)
//       });
//   }

//   /* ================= STATUS FILTER ================= */
//   filterByStatus(status: string) {
//     this.selectedStatus = status;

//     if (status === 'All') {
//       this.viewReports = [...this.allReports];
//       return;
//     }

//     this.viewReports = this.allReports.filter(
//       r => r.Timesheet_Status === status
//     );
//   }

//   /* ================= DATE FILTER ================= */
//   applyFilters() {
//     this.viewReports = this.allReports.filter(row => {

//       const rowStart = row.Start_Date ? new Date(row.Start_Date) : null;
//       const rowEnd = row.End_Date ? new Date(row.End_Date) : null;

//       const filterStart = this.startDate ? new Date(this.startDate) : null;
//       const filterEnd = this.endDate ? new Date(this.endDate) : null;

//       const statusMatch =
//         this.selectedStatus === 'All' ||
//         row.Timesheet_Status === this.selectedStatus;

//       const startMatch = !filterStart || !rowStart || rowStart >= filterStart;
//       const endMatch = !filterEnd || !rowEnd || rowEnd <= filterEnd;

//       return statusMatch && startMatch && endMatch;
//     });
//   }

//   /* ================= DATE PICKER ================= */
//   async openCalendar(type: 'start' | 'end') {
//     const popover = await this.popoverCtrl.create({
//       component: DatePopoverComponent,
//       componentProps: { selected: new Date() }
//     });

//     await popover.present();
//     const { data } = await popover.onDidDismiss();

//     if (!data) return;

//     const formatted = this.formatDateLocal(new Date(data));

//     if (type === 'start') {
//       this.startDate = formatted;
//     } else {
//       this.endDate = formatted;
//     }
//   }

//   /* ================= ADMIN APPROVE ================= */
//   approveTimesheet(row: any) {
//     this.updateWeeklyStatus(row, 'Approved');
//   }

//   /* ================= ADMIN REJECT ================= */
//   rejectTimesheet(row: any) {
//     this.updateWeeklyStatus(row, 'Rejected');
//   }

//   /* ================= ADMIN UPDATE ================= */
//   updateWeeklyStatus(row: any, status: 'Approved' | 'Rejected') {

//     const body = {
//       employeeId: row.Employee_Id,
//       projectId: row.Project_Id,
//       startDate: row.Start_Date,
//       endDate: row.End_Date,
//       status,
//       approverEmployeeId: this.employeeId
//     };

//     this.http
//       .put('/api/project/admin/updateWeeklyStatus', body)
//       .subscribe({
//         next: () => {
//           row.Timesheet_Status = status;
//           alert(`Successfully ${status}`);
//         },
//         error: err => {
//           console.error(err);
//           alert('Action failed');
//         }
//       });
//   }

//   /* ================= EDIT (USER) ================= */
//   editTimesheet(row: any) {
//     if (!row.Timesheet_Id) return;

//     this.router.navigate([
//       '/timesheet-entry',
//       row.Timesheet_Id,
//       row.Leave_Id || 0
//     ]);
//   }

//   /* ================= HELPERS ================= */
//   formatDateLocal(date: Date): string {
//     const y = date.getFullYear();
//     const m = String(date.getMonth() + 1).padStart(2, '0');
//     const d = String(date.getDate()).padStart(2, '0');
//     return `${y}-${m}-${d}`;
//   }

//   formatCardDate(dateStr: string): string {
//     if (!dateStr) return '-';
//     return new Date(dateStr).toLocaleDateString('en-US', {
//       month: 'short',
//       day: '2-digit',
//       year: 'numeric'
//     });
//   }

//   clearFilters() {
//     this.selectedStatus = 'All';
//     this.startDate = null;
//     this.endDate = null;
//     this.viewReports = [...this.allReports];
//   }
// }


import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { IonicModule, PopoverController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { DatePopoverComponent } from '../timesheet-entry/date-popover.component';
import { UserService } from '../user.service';

@Component({
  selector: 'app-timesheet-reports',
  templateUrl: './timesheet-reports.page.html',
  styleUrls: ['./timesheet-reports.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    FormsModule, HttpClientModule
  ]
})
export class TimesheetReportsPage {

  /* ================= AUTH ================= */
  loggedInEmployeeId: string = '';
  employeeRole: 'User' | 'Admin' = 'User';

  /* ================= FILTER STATE ================= */
  startDate: string | null = null;     // YYYY-MM-DD
  endDate: string | null = null;       // YYYY-MM-DD
  // filterEmployeeId: string = '';
  filterEmployeeId: number | null = null;
  selectedStatus: 'All' | 'Pending' | 'Approved' | 'Rejected' = 'Pending';

  /* ================= DATA ================= */
  allReports: any[] = [];
  filteredReports: any[] = [];
  viewReports: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private popoverCtrl: PopoverController,
    private userService: UserService
  ) {}


  
  /* ================= PAGE LOAD ================= */
  ionViewWillEnter() {
    // reset UI state
    this.startDate = null;
    this.endDate = null;
    this.filterEmployeeId = null;
    this.selectedStatus = 'Pending';

    this.userService.user$.subscribe(user => {
      if (!user) return;

      this.loggedInEmployeeId = user.Employee_Id;
      this.employeeRole = user.Employee_Role;

      if (this.employeeRole === 'Admin') {
        this.loadAdminReports();
      } else {
        this.loadUserReports();
      }
    });
  }

  /* ================= LOAD REPORTS ================= */
  loadAdminReports() {
    this.http
      .get<any[]>('/api/project/admin/reports')
      .subscribe({
        next: res => {
          this.allReports = res || [];
          this.applyFilterButton();
        },
        error: err => console.error('Admin reports error', err)
      });
  }

  loadUserReports() {
    this.http
      .get<any[]>(`/api/project/getEmployeeDetails/${this.loggedInEmployeeId}`)
      .subscribe({
        next: res => {
          this.allReports = res || [];
          this.applyFilterButton();
        },
        error: err => console.error('User reports error', err)
      });
  }

  /* ================= FILTER BUTTON ================= */
applyFilterButton() {

  this.filteredReports = this.allReports.filter(row => {

    const rowStart = new Date(row.Start_Date);
    const rowEnd = new Date(row.End_Date);

    rowStart.setHours(0, 0, 0, 0);
    rowEnd.setHours(23, 59, 59, 999);

    let dateMatch = true;

    if (this.startDate && this.endDate) {
      const filterStart = new Date(this.startDate);
      const filterEnd = new Date(this.endDate);

      filterStart.setHours(0, 0, 0, 0);
      filterEnd.setHours(23, 59, 59, 999);

      // ✅ OVERLAP LOGIC (THIS IS THE KEY)
      dateMatch =
        rowStart <= filterEnd &&
        rowEnd >= filterStart;
    }

    const employeeMatch =
      this.employeeRole !== 'Admin' ||
      this.filterEmployeeId === null ||
      Number(row.Employee_Id) === this.filterEmployeeId;

    return dateMatch && employeeMatch;
  });

  this.applyStatusFilter();
}


  /* ================= STATUS BUTTONS ================= */
  filterByStatus(status: 'All' | 'Pending' | 'Approved' | 'Rejected') {
    this.selectedStatus = status;
    this.applyStatusFilter();
  }

  applyStatusFilter() {
    if (this.selectedStatus === 'All') {
      this.viewReports = [...this.filteredReports];
    } else {
      this.viewReports = this.filteredReports.filter(
        row => row.Timesheet_Status === this.selectedStatus
      );
    }
  }

  /* ================= CLEAR ================= */
  clearFilters() {
    this.startDate = null;
    this.endDate = null;
    this.filterEmployeeId = null;
    this.selectedStatus = 'Pending';
    this.applyFilterButton();
  }

  /* ================= DATE PICKER ================= */
  async openCalendar(type: 'start' | 'end') {
    const popover = await this.popoverCtrl.create({
      component: DatePopoverComponent,
      componentProps: { selected: new Date() }
    });

    await popover.present();
    const { data } = await popover.onDidDismiss();
    if (!data) return;

    const formatted = this.toYYYYMMDD(new Date(data));

    if (type === 'start') {
      this.startDate = formatted;
    } else {
      this.endDate = formatted;
    }
  }

  /* ================= DATE FORMAT ================= */
  toYYYYMMDD(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  /* ================= ADMIN ACTIONS ================= */
  approveTimesheet(row: any) {
    this.updateWeeklyStatus(row, 'Approved');
  }

  rejectTimesheet(row: any) {
    this.updateWeeklyStatus(row, 'Rejected');
  }

  updateWeeklyStatus(row: any, status: 'Approved' | 'Rejected') {
    const body = {
      projectId: row.Project_Id,
      startDate: row.Start_Date,
      endDate: row.End_Date,
      status,
      approverEmployeeId: this.loggedInEmployeeId
    };

    this.http
      .put('/api/project/admin/updateWeeklyStatus', body)
      .subscribe({
        next: () => row.Timesheet_Status = status,
        error: err => {
          console.error(err);
          alert('Approve / Reject failed');
        }
      });
  }

  /* ================= USER EDIT ================= */
  editTimesheet(row: any) {
    if (!row.Timesheet_Id) return;

    this.router.navigate([
      '/timesheet-entry',
      row.Timesheet_Id,
      row.Leave_Id || 0
    ]);
  }

  /* ================= UI HELPERS ================= */
  // formatCardDate(dateStr: string): string {
  //   if (!dateStr) return '-';
  //   return new Date(dateStr).toLocaleDateString('en-US', {
  //     month: 'short',
  //     day: '2-digit',
  //     year: 'numeric'
  //   });
  // }

  formatCardDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

}

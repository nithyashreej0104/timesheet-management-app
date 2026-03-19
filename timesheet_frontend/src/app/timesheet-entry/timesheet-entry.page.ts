
import { Component, OnInit } from '@angular/core';
import {
  PopoverController,
  IonicModule,
  ToastController
} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService } from '../user.service';
import { DatePopoverComponent } from './date-popover.component';
import { ActivatedRoute } from '@angular/router';
import { AppHeaderComponent } from '../sidebar/app-header/app-header.component';


@Component({
  selector: 'app-timesheet-entry',
  templateUrl: './timesheet-entry.page.html',
  styleUrls: ['./timesheet-entry.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AppHeaderComponent,
    HttpClientModule
  ]
})
export class TimesheetEntryPage implements OnInit {


  /* ================= BASIC DATA ================= */

  employeeId!: string;

  projects: any[] = [];
  selectedProjectId: string | null = null;
  selectedProject: any = null;

  selectedDate: Date = new Date();
  weekData: any[] = [];

  /* ================= STATE ================= */

  timesheetId: string | null = null;
  leaveId: string | null = null;
  timesheetStatus: string | null = null;

  isEditFromReport = false;
  isExistingRecord = false;

  totalWorked = 0;
  totalLeave = 0;

  isSubmittedView = false;

  /* ================= PERMISSION ================= */

  canEditProject(): boolean {
    if (this.isEditFromReport) return false;
    return true;
  }

  canEditDate(): boolean {
    return !this.isEditFromReport;
  }

  canEditHours(): boolean {
    if (this.isEditFromReport) return true;     // report edit
    if (this.isSubmittedView) return false;    // submitted normal view
    return true;                                // new entry
  }

  /* ================= CONSTRUCTOR ================= */

  constructor(
    private popoverCtrl: PopoverController,
    private toastCtrl: ToastController,
    private http: HttpClient,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.generateWeek(this.selectedDate);
  }

  // ================= VALIDATION =================
  validateWeekData(): boolean {
    let hasError = false;
    this.weekData.forEach(d => d.error = '');

    this.weekData.forEach(d => {
      if (!this.isValidWorkDay(d)) return;

      const worked = Number(d.worked || 0);
      const leave = Number(d.leave || 0);
      const total = worked + leave;

      if (worked < 0 || leave < 0) {
        d.error = 'Hours cannot be negative';
        hasError = true;
        return;
      }

      if (worked > 24) {
        d.error = 'Working hours cannot exceed 24';
        hasError = true;
        return;
      }

      if (leave > 8) {
        d.error = 'Leave hours cannot exceed 8';
        hasError = true;
        return;
      }

      if (total > 24) {
        d.error = 'Total hours cannot exceed 24';
        hasError = true;
        return;
      }

      if (leave > 0 && total !== 8) {
        d.error = 'Working + Leave must equal 8 hours';
        hasError = true;
        return;
      }

      if (leave === 0 && worked < 8) {
        d.error = 'Working hours must be minimum 8';
        hasError = true;
        return;
      }

      if (worked === 8 && leave === 8) {
        d.error = 'Cannot enter both 8 worked and 8 leave';
        hasError = true;
        return;
      }

      if (leave > 0 && worked > 8) {
        d.error = 'Working hours cannot exceed 8 when leave is added';
        hasError = true;
        return;
      }
    });

    return !hasError;
  }



  async submitTimesheet() {

    if (!this.selectedProjectId) {
      await this.presentToast('Select project', 'warning');
      return;
    }

    if (!this.validateWeekData()) {
      await this.presentToast('Please fix validation errors', 'danger');
      return;
    }

    const startDate = this.formatDateLocal(this.weekData[0].full);
    const endDate = this.formatDateLocal(this.weekData[6].full);

    const timesheetPayload = {
      Employee_Id: this.employeeId,
      Project_Id: this.selectedProjectId,
      Timesheet_Start_Date: startDate,
      Timesheet_End_Date: endDate,
      Day1_Hrs: this.weekData[0].worked,
      Day2_Hrs: this.weekData[1].worked,
      Day3_Hrs: this.weekData[2].worked,
      Day4_Hrs: this.weekData[3].worked,
      Day5_Hrs: this.weekData[4].worked,
      Day6_Hrs: this.weekData[5].worked,
      Day7_Hrs: this.weekData[6].worked
    };

    const leavePayload = {
      Employee_Id: this.employeeId,
      Project_Id: this.selectedProjectId,
      Leave_Start_Date: startDate,
      Leave_End_Date: endDate,
      Day1_Hrs: this.weekData[0].leave || 0,
      Day2_Hrs: this.weekData[1].leave || 0,
      Day3_Hrs: this.weekData[2].leave || 0,
      Day4_Hrs: this.weekData[3].leave || 0,
      Day5_Hrs: this.weekData[4].leave || 0,
      Day6_Hrs: this.weekData[5].leave || 0,
      Day7_Hrs: this.weekData[6].leave || 0
    };

    try {

/* ================= TIMESHEET ================= */
if (this.isEditFromReport) {
  await this.http.put(
    `/api/project/updateTimesheet/${this.timesheetId}`,
    timesheetPayload
  ).toPromise();
} else {
  await this.http.post(
    `/api/project/timesheetsubmit`,
    timesheetPayload
  ).toPromise();
}

/* ================= LEAVE ================= */

const hasLeave = this.weekData.some(d => Number(d.leave) > 0);

if (hasLeave) {
  if (this.leaveId) {
    await this.http.put(
      `/api/project/updateLeave/${this.leaveId}`,
      leavePayload
    ).toPromise();
  } else {
    await this.http.post(
      `/api/project/leavesubmit`,
      leavePayload
    ).toPromise();
  }
}

      await this.presentToast('Submitted successfully', 'success');
      this.isSubmittedView = true;
this.timesheetStatus = 'Approval';

    } catch (e) {
      console.error('Submit error:', e);
      await this.presentToast('Submit failed', 'danger');
    }
  }

  /* ================= INIT ================= */
  ngOnInit() {
    this.timesheetId = this.route.snapshot.paramMap.get('timesheetId');
    this.leaveId = this.route.snapshot.paramMap.get('leaveId');

   this.isEditFromReport = !!this.timesheetId;

if (this.isEditFromReport) {
  this.isSubmittedView = false;     // allow editing
}

    if (this.leaveId === '0') this.leaveId = null;

    this.userService.user$.subscribe(user => {
      if (!user?.Employee_Id) return;

      this.employeeId = user.Employee_Id;

      this.fetchProjectDetails().then(() => {
        if (this.isEditFromReport) {
          this.loadEditDataByIds();
        } else {
          this.generateWeek(this.selectedDate);
        }
      });
    });
  }

  /* ================= PROJECT ================= */

  fetchProjectDetails(): Promise<void> {
    return new Promise(resolve => {
      this.http
        .get<any[]>(`/api/project/pro_details/${this.employeeId}`)
        .subscribe(res => {
          this.projects = res.map(p => ({
            id: p.Project_Id,
            name: p.Project_Name
          }));
          resolve();
        });
    });
  }

  onProjectChange() {
    this.selectedProject =
      this.projects.find(p => p.id === this.selectedProjectId) || null;

    if (!this.isEditFromReport) {
      this.fetchExistingData();
    }
  }

  // ================= WEEK GENERATION =================
  generateWeek(date: Date) {
    const given = new Date(date);
    given.setHours(0, 0, 0, 0);

    const day = given.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(given);
    monday.setDate(given.getDate() + diff);

    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.weekData = [];


    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);

      const dayIndex = d.getDay();
      const isWorkingDay = dayIndex >= 1 && dayIndex <= 5;

      this.weekData.push({
        label: labels[i],
        full: d,
        day: d.getDate(),
        month: months[d.getMonth()],
        worked: 0,
        leave: 0,
        isWorkingDay,
        isHoliday: false,
        error: ''
      });
    }


    this.loadHolidays();
    this.calculateTotals();
  }

  // ================= DATE PICKER =================
  async openMonthPopover(ev: any) {
    if (!this.canEditDate()) return;

    const popover = await this.popoverCtrl.create({
      event: ev,
      component: DatePopoverComponent,
      componentProps: { selected: this.selectedDate }
    });

    await popover.present();
    const result = await popover.onWillDismiss();

    if (result.data) {
      this.selectedDate = new Date(result.data);
      this.generateWeek(this.selectedDate);

      if (!this.isEditFromReport) {
        this.fetchExistingData();
      }
    }
  }

  // ================= HOLIDAYS =================
  fetchHolidays(startDate: string) {
    return this.http.get<any[]>(
      `/api/project/getHolidays/${startDate}`
    );
  }

  loadHolidays() {
    const startDate = this.formatDateLocal(this.weekData[0].full);

    this.fetchHolidays(startDate).subscribe(holidays => {
      const holidaySet = holidays.map(h =>
        this.formatDateLocal(new Date(h.Event_Date))
      );

      this.weekData.forEach(d => {
        const dStr = this.formatDateLocal(d.full);
        if (holidaySet.includes(dStr)) {
          d.isHoliday = true;
          d.worked = null;
          d.leave = null;
        }
      });

      this.calculateTotals();
    });
  }

  // ================= HELPERS =================

  formatDateLocal(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  isValidWorkDay(d: any): boolean {
    return d.isWorkingDay && !d.isHoliday;
  }


  // ================= TOTALS =================

  calculateTotals() {
    let workedSum = 0;
    let leaveSum = 0;

    this.weekData.forEach(d => {
      if (this.isValidWorkDay(d)) {
        workedSum += Number(d.worked || 0);
        leaveSum += Number(d.leave || 0);
      }
    });

    this.totalWorked = workedSum;
    this.totalLeave = leaveSum;
  }

  // ================= INPUT LIMITS =================
  limitWorked(d: any, event: any) {
    let val = Number(event.detail.value || 0);

    if (val < 0) val = 0;
    if (val > 24) val = 24;

    d.worked = val;
    this.calculateTotals();
  }

  limitLeave(d: any, event: any) {
    let val = Number(event.detail.value || 0);

    if (val < 0) val = 0;
    if (val > 8) val = 8;

    d.leave = val;
    this.calculateTotals();
  }

  // ================= QUICK FILL =================
  quickFillWorked() {
    this.weekData.forEach(d => {
      if (this.isValidWorkDay(d)) {
        d.worked = 8;
        d.leave = 0;
        d.error = '';
      }
    });
    this.calculateTotals();
  }

  quickFillLeave() {
    this.weekData.forEach(d => {
      if (this.isValidWorkDay(d)) {
        d.leave = 8;
        d.worked = 0;
        d.error = '';
      }
    });
    this.calculateTotals();
  }
  /* ================= FETCH EXISTING ================= */

  fetchExistingData() {
    if (!this.selectedProjectId) return;

    const startDate = this.formatDateLocal(this.weekData[0].full);

    // ================= TIMESHEET =================
    this.http.get<any>(
      `/api/project/getTimesheet/${this.employeeId}/${this.selectedProjectId}/${startDate}`
    ).subscribe(res => {

      if (res && res.Timesheet_Id) {
        this.timesheetId = res.Timesheet_Id;
        this.timesheetStatus = res.Timesheet_Status;

        // ✅ Submitted week (normal open)
        this.isSubmittedView = true;

        this.weekData.forEach((d, i) => {
          d.worked = res[`Day${i + 1}_Hrs`] ?? 0;
        });

      } else {
        // New entry
        this.isSubmittedView = false;
        this.timesheetId = null;

        this.weekData.forEach(d => d.worked = 0);
      }

      this.calculateTotals();
    });

    // ================= LEAVE =================
    this.http.get<any>(
      `/api/project/getLeave/${this.employeeId}/${this.selectedProjectId}/${startDate}`
    ).subscribe(res => {

      if (res && res.Leave_Id) {
        this.leaveId = res.Leave_Id;

        this.weekData.forEach((d, i) => {
          d.leave = res[`Day${i + 1}_Hrs`] ?? 0;
        });

      } else {
        this.leaveId = null;
        this.weekData.forEach(d => d.leave = 0);
      }

      this.loadHolidays();
      this.calculateTotals();
    });
  }

  /* ================= EDIT MODE LOAD ================= */

  loadEditDataByIds() {

    this.http.get<any>(
      `/api/project/getTimesheetByIds/${this.timesheetId}/${this.leaveId}`
    ).subscribe(res => {

      this.timesheetStatus = res.Timesheet_Status;
      this.leaveId = res.Leave_Id || null;


      // 1️⃣ Select project
      this.selectedProjectId = res.Project_Id;
      this.selectedProject = this.projects.find(
        p => p.id === res.Project_Id
      );

      //  Generate correct week FIRST
      this.selectedDate = new Date(res.Timesheet_Start_Date);
      this.generateWeek(this.selectedDate);


      // fill worked & leave
      this.weekData.forEach((d, i) => {
        d.worked = res[`Day${i + 1}_Hrs`] === "Holiday" ? null : res[`Day${i + 1}_Hrs`] ?? 0;
        d.leave = res[`Leave_Day${i + 1}`] === "Holiday" ? null : res[`Leave_Day${i + 1}`] ?? 0;
      });

      this.calculateTotals();
    });
  }

  // ================= TOAST =================
  async presentToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  /* ================= CLEAR ================= */
  clearWeekValues() {
    this.weekData.forEach(d => {
      d.worked = 0;
      d.leave = 0;
      d.error = '';
    });

    this.timesheetId = null;
    this.leaveId = null;
    this.timesheetStatus = null;
  }

} 
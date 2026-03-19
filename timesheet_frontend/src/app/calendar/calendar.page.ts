import { Component, OnInit } from '@angular/core';
import {
  IonicModule,
  AlertController,
  MenuController,
  PopoverController
} from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService } from '../user.service';
import { DatePopoverComponent } from '../timesheet-entry/date-popover.component';
import { AppHeaderComponent } from '../sidebar/app-header/app-header.component';


interface CalendarEvent {
  id: number;
  title: string;
  time: string;
  date: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule, AppHeaderComponent],
})
export class CalendarPage implements OnInit {

  /* ================= USER ================= */
  employeeRole = '';

  /* ================= CALENDAR ================= */
  today = new Date();
  selectedDate!: string;

  month!: number;
  year!: number;
  monthName!: string;

  selectedEditDate = '';
  days: (number | null)[] = [];
  showMonthYearPopup = false;

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  years = Array.from({ length: 11 }, (_, i) => 2024 + i);

  /* ================= EVENTS ================= */
  eventList: { [date: string]: CalendarEvent[] } = {};
  events: CalendarEvent[] = [];
  viewAll = false;

  holidays: string[] = [];

  eventColors = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8'];

  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private menuCtrl: MenuController,
    private userService: UserService,
    private popoverCtrl: PopoverController
  ) { }

  /* ================= INIT ================= */
  ngOnInit() {
    const d = new Date();

    this.month = d.getMonth();
    this.year = d.getFullYear();
    this.selectedDate = this.formatDate(d);

    const user = this.userService.getCurrentUser();
    if (user) {
      this.employeeRole = user.Employee_Role;
    }

    this.updateMonthName();
    this.generateCalendar();
    this.loadEvents();
    this.loadHolidays();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  /* ================= CALENDAR LOGIC ================= */
  updateMonthName() {
    this.monthName = this.months[this.month];
  }

  generateCalendar() {
    const firstDay = new Date(this.year, this.month, 1).getDay();
    const totalDays = new Date(this.year, this.month + 1, 0).getDate();

    this.days = [
      ...Array(firstDay).fill(null),
      ...Array.from({ length: totalDays }, (_, i) => i + 1),
    ];
  }

  prevMonth() {

    this.month === 0 ? (this.month = 11, this.year--) : this.month--;
    this.refreshCalendar();

    this.generateCalendar();
    this.loadHolidays();
  }

  nextMonth() {
    this.month === 11 ? (this.month = 0, this.year++) : this.month++;
    this.refreshCalendar();
    this.generateCalendar();
    this.loadHolidays();
  }

  select(day: number) {
    const date = new Date(this.year, this.month, day);
    this.selectedDate = this.formatDate(date);
    this.viewAll = false;
    this.loadEventsForDate();
    this.loadHolidays();
  }

  isToday(day: number) {
    return (
      day === this.today.getDate() &&
      this.month === this.today.getMonth() &&
      this.year === this.today.getFullYear()
    );
  }

  isSelected(day: number) {
    return this.selectedDate === this.formatDate(new Date(this.year, this.month, day));
  }

  toggleMonthYearPopup() {
    this.showMonthYearPopup = !this.showMonthYearPopup;
  }

  selectMonth(i: number) {
    this.month = i;
    this.closePopupAndRefresh();
    this.updateMonthName();
    this.generateCalendar();
    this.showMonthYearPopup = false;

    // ✅ FIX: auto-select first day
    const newDate = new Date(this.year, this.month, 1);
    this.selectedDate = this.formatDate(newDate);

    this.viewAll = false;
    this.loadEventsForDate();
    this.loadHolidays();
  }

  selectYear(y: number) {
    this.year = y;
    this.closePopupAndRefresh();
    this.updateMonthName();
    this.generateCalendar();
    this.showMonthYearPopup = false;

    // ✅ FIX: auto-select first day
    const newDate = new Date(this.year, this.month, 1);
    this.selectedDate = this.formatDate(newDate);

    this.viewAll = false;
    this.loadEventsForDate();
    this.loadHolidays();
  }

  closePopupAndRefresh() {
    this.showMonthYearPopup = false;

    const newDate = new Date(this.year, this.month, 1);
    this.selectedDate = this.formatDate(newDate);

    this.updateMonthName();
    this.generateCalendar();
  }

  refreshCalendar() {
    this.updateMonthName();
    this.generateCalendar();
  }

  formatDate(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  hasEvents(day: number): boolean {
    const dateStr = this.formatDate(new Date(this.year, this.month, day));
    return this.eventList[dateStr] && this.eventList[dateStr].length > 0;
  }

  /* ================= EVENTS ================= */
  showAllEvents() {
    this.viewAll = !this.viewAll;
    this.loadEventsForDate();
  }

  loadEvents() {
    this.http.get<any>('/api/calendar/events').subscribe(res => {
      this.eventList = {};

      res.events.forEach((e: any) => {
        const dateKey = e.Event_Date.split('T')[0];
        if (!this.eventList[dateKey]) {
          this.eventList[dateKey] = [];
        }

        this.eventList[dateKey].push({
          id: e.CalendarID,
          title: e.Event_Name,
          time: e.Event_Type,
          date: dateKey,
        });
      });

      this.loadEventsForDate();
    });
  }

  loadEventsForDate() {
    if (this.viewAll) {
      this.events = Object.values(this.eventList).reduce(
        (all, current) => all.concat(current),
        [] as CalendarEvent[]
      );
    } else {
      this.events = this.eventList[this.selectedDate] || [];
    }

    if (this.events.length === 0) {
      this.events = [{
        id: -1,                      // ✅ dummy id
        title: 'No holiday',
        time: '',
        date: this.selectedDate
      }];
    }
  }


  async viewEventDetails(event: CalendarEvent) {
    if (event.id === -1) return; // Skip dummy "No events"

    const alert = await this.alertCtrl.create({
      header: event.title,
      message: `Date: ${event.date}<br>Time: ${event.time}`,
      buttons: ['OK']
    });

    await alert.present();
  }

  /* ================= ADD HOLIDAY (ADMIN) ================= */

  async presentAddEventAlert() {
    if (!this.userService.isAdmin()) return;

    const alert = await this.alertCtrl.create({
      cssClass: 'holiday-alert',
      header: 'Add Holiday',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Holiday Name',
        },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Next',
          handler: async (data) => {
            if (!data.name) {
              this.showAlert('Error', 'Holiday name required');
              return false;
            }

            // Close the initial alert before opening the date picker
            await alert.dismiss();

            const selectedDate = await this.openHolidayCalendar();
            if (!selectedDate) return false;

            const confirm = await this.alertCtrl.create({
              header: 'Confirm holiday',
              message: `Add "${data.name}" on ${selectedDate}?`,
              buttons: [
                { text: 'Cancel', role: 'cancel' },
                {
                  text: 'Confirm',
                  handler: () => {
                    this.addEvent(data.name, selectedDate);
                  },
                },
              ],
            });

            await confirm.present();
            return false;
          },
        },
      ],
    });

    await alert.present();
  }

  async openHolidayCalendar(): Promise<string | null> {
    const popover = await this.popoverCtrl.create({
      component: DatePopoverComponent,
      componentProps: { selected: new Date() },
      cssClass: 'calendar-popover',
    });

    await popover.present();
    const { data } = await popover.onDidDismiss();

    if (data) {
      return this.formatDate(data);
    }

    return null;
  }

  addEvent(name: string, date: string) {
    this.http.post('/api/calendar/insert-event', {
      Event_Name: name,
      Event_Date: date,
      Event_Type: 'holiday', // ✅ AUTO
      Event_EveryYear: 'yes',
    }).subscribe(() => this.loadEvents());
  }

  /* ================= EDIT ================= */
  // async editEvent(event: CalendarEvent, index: number) {
  //   const alert = await this.alertCtrl.create({
  //     header: 'Edit Event',
  //     inputs: [
  //       { name: 'name', type: 'text', value: event.title },
  //       { name: 'date', type: 'date', value: event.date },
  //     ],
  //     buttons: [
  //       { text: 'Cancel', role: 'cancel' },
  //       {
  //         text: 'Update',
  //         handler: (data) => {
  //           this.updateEvent(event, data);
  //         },
  //       },
  //     ],
  //   });

  //   await alert.present();
  // }

  async editEvent(event: CalendarEvent) {
    this.selectedEditDate = event.date; // ✅ initial value

    const alert = await this.alertCtrl.create({
      header: 'Edit Event',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: event.title
        },
        {
          name: 'date',
          type: 'text',
          value: event.date,
          placeholder: 'Tap to select date',
          attributes: {
            readonly: true
          }
        }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Update',
          handler: (data) => {
            this.updateEvent(event, {
              name: data.name,
              date: this.selectedEditDate // ✅ USE THIS
            });
          }
        }
      ]
    });

    await alert.present();
    this.attachCalendarToAlertInput(alert);
    this.attachCalendarIcon(alert);
  }



  async attachCalendarToAlertInput(alert: HTMLIonAlertElement) {
    setTimeout(async () => {
      const input = alert.querySelector(
        'input[placeholder="Tap to select date"]'
      ) as HTMLInputElement;

      if (!input) return;

      input.addEventListener('click', async () => {
        const popover = await this.popoverCtrl.create({
          component: DatePopoverComponent,
          componentProps: {
            selected: input.value ? new Date(input.value) : new Date()
          },
          cssClass: 'calendar-popover'
        });

        await popover.present();

        const { data } = await popover.onDidDismiss();
        if (data) {
          const formatted = this.formatDate(data);
          input.value = formatted;
          this.selectedEditDate = formatted;
        }
      });
    }, 300);

  }


  // update code 

  updateEvent(event: CalendarEvent, data: any) {
    this.http.patch(
      `/api/calendar/update-event/${event.id}`,   // ✅ CalendarID
      {
        Event_Name: data.name,
        Event_Date: data.date
      }
    ).subscribe({
      next: () => {
        this.loadEvents();
      },
      error: (err) => {
        console.error('Update failed', err);
      }
    });
  }


  /* ================= DELETE ================= */
  async deleteEvent(event: CalendarEvent) {
    if (!this.userService.isAdmin()) return;

    const alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: `Delete "${event.title}"?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.http
              .delete(`/api/calendar/delete-event/${encodeURIComponent(event.title)}`)
              .subscribe(() => this.loadEvents());
          },
        },
      ],
    });

    await alert.present();
  }

  /* ================= HOLIDAYS ================= */
  loadHolidays() {
    this.http
      .get<any>(`/api/calendar/holidays/${this.selectedDate}`)
      .subscribe(res => {
        this.holidays = res.holidays || [];
      });
  }

  /* ================= UTIL ================= */

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }


  //  calenadar icon 
  async attachCalendarIcon(alert: HTMLIonAlertElement) {
    setTimeout(async () => {
      const input = alert.querySelector(
        'input[placeholder="Select date"]'
      ) as HTMLInputElement;

      if (!input) return;

      // Create icon button
      const icon = document.createElement('ion-icon');
      icon.setAttribute('name', 'calendar-outline');
      icon.style.position = 'absolute';
      icon.style.right = '16px';
      icon.style.top = '50%';
      icon.style.transform = 'translateY(-50%)';
      icon.style.fontSize = '20px';
      icon.style.color = '#2dd36f';
      icon.style.cursor = 'pointer';

      const wrapper = input.parentElement as HTMLElement;
      wrapper.style.position = 'relative';
      wrapper.appendChild(icon);

      icon.addEventListener('click', async () => {
        const popover = await this.popoverCtrl.create({
          component: DatePopoverComponent,
          componentProps: {
            selected: input.value ? new Date(input.value) : new Date()
          },
          cssClass: 'calendar-popover'
        });

        await popover.present();
        const { data } = await popover.onDidDismiss();

        if (data) {
          input.value = this.formatDate(data);
        }
      });
    }, 300);
  }

}

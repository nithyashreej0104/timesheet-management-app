import { Component, Input } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-popover',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './date-popover.component.html',
  styleUrls: ['./date-popover.component.scss']
})
export class DatePopoverComponent {

  @Input() selected!: Date;

  month!: number;
  year!: number;
  monthName!: string;

  days: (number | null)[] = [];

  constructor(private popCtrl: PopoverController) {}

  ngOnInit() {
    const d = this.selected || new Date();

    this.month = d.getMonth();
    this.year = d.getFullYear();

    this.updateMonthName();
    this.generateCalendar();
  }

  updateMonthName() {
    this.monthName = new Date(this.year, this.month)
      .toLocaleString('default', { month: 'long' });
  }

  generateCalendar() {
    const firstDay = new Date(this.year, this.month, 1).getDay();
    const totalDays = new Date(this.year, this.month + 1, 0).getDate();

    this.days = [
      ...Array(firstDay).fill(null),
      ...Array.from({ length: totalDays }, (_, i) => i + 1)
    ];
  }

//   isWeekend(day: number): boolean {
//   const date = new Date(this.year, this.month, day);
//   const dayOfWeek = date.getDay();  // 0: Sunday, 6: Saturday
//   return dayOfWeek === 0 || dayOfWeek === 6;
// }

isWeekend(day: number): boolean {
  const date = new Date(this.year, this.month, day);
  return date.getDay() === 6; // ✅ only Saturday blocked
}


  prevMonth() {
    if (this.month === 0) {
      this.month = 11;
      this.year--;
    } else {
      this.month--;
    }
    this.updateMonthName();
    this.generateCalendar();
  }

  nextMonth() {
    if (this.month === 11) {
      this.month = 0;
      this.year++;
    } else {
      this.month++;
    }
    this.updateMonthName();
    this.generateCalendar();
  }

  select(day: number) {
    const selectedDate = new Date(this.year, this.month, day);
    this.popCtrl.dismiss(selectedDate);
  }

  close() {
    this.popCtrl.dismiss();
  }

  isToday(day: number) {
    const today = new Date();
    return (
      day === today.getDate() &&
      this.month === today.getMonth() &&
      this.year === today.getFullYear()
    );
  }

  isSelected(day: number) {
    return (
      this.selected &&
      day === this.selected.getDate() &&
      this.month === this.selected.getMonth() &&
      this.year === this.selected.getFullYear()
    );
  }
  today = new Date();
}


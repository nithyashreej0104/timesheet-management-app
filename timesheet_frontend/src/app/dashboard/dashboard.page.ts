

import {
  Component,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, MenuController } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs';

import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [CommonModule, IonicModule, HttpClientModule]
})
export class DashboardPage {

  employeeId!: number;
  employeeRole!: 'User' | 'Admin';

  userSummary = {
    total_worked_hrs: 0,
    total_worked_days: 0,
    pending_timesheets: 0,
    total_leave_days: 0
  };

  adminSummary = {
    total_approved: 0,
    total_pending: 0,
    total_rejected: 0
  };

  @ViewChild('userStatusChart') userStatusChartRef!: ElementRef;
  @ViewChild('adminStatusChart') adminStatusChartRef!: ElementRef;

  userChart!: Chart;
  adminChart!: Chart;
  userSub!: Subscription;


  constructor(
    private http: HttpClient,
    private userService: UserService,
    private menuCtrl: MenuController
  ) {}

  /* ✅ IONIC LIFECYCLE (IMPORTANT) */
  // ionViewWillEnter() {
  //   this.menuCtrl.enable(true);
  //   this.loadDashboard();
  // }

  ionViewWillEnter() {
  this.menuCtrl.enable(true);

  this.userSub = this.userService.user$.subscribe(user => {
    if (!user) return;

    this.employeeId = user.Employee_Id;
    this.employeeRole = user.Employee_Role;

    console.log('Dashboard user:', user);

    if (this.employeeRole === 'User') {
      this.loadUserDashboard();
    } else {
      this.loadAdminDashboard();
    }
  });
}

ionViewWillLeave() {
  this.userSub?.unsubscribe();
}

  /* ================= LOAD DASHBOARD ================= */
  loadDashboard() {
    const user = this.userService.getCurrentUser();

    // ⛔ wait until login data is ready
    if (!user) {
      setTimeout(() => this.loadDashboard(), 300);
      return;
    }

    this.employeeId = user.Employee_Id;
    this.employeeRole = user.Employee_Role;

    console.log('Dashboard loading for user:', this.employeeId);

    if (this.employeeRole === 'User') {
      this.loadUserDashboard();
    } else {
      this.loadAdminDashboard();
    }
  }

  /* ================= USER ================= */
  loadUserDashboard() {
    this.http
      .get<any>(`/api/user/dashboard/summary/${this.employeeId}?t=${Date.now()}`)
      .subscribe(res => {
        this.userSummary = res;
      });

    this.http
      .get<any>(`/api/user/dashboard/statusChart/${this.employeeId}?t=${Date.now()}`)
      .subscribe(res => {
        // ⏳ wait until canvas exists
        setTimeout(() => this.renderChart(res, 'user'), 0);
      });
  }

  /* ================= ADMIN ================= */
  loadAdminDashboard() {
    this.http
      .get<any>(`/api/admin/dashboard/summary?t=${Date.now()}`)
      .subscribe(res => {
        this.adminSummary = res;
        setTimeout(() => this.renderChart(res, 'admin'), 0);
      });
  }
  

  /* ================= CHART ================= */
renderChart(data: any, type: 'user' | 'admin') {
  const ctx =
    type === 'user'
      ? this.userStatusChartRef?.nativeElement
      : this.adminStatusChartRef?.nativeElement;

  if (!ctx) return;

  // Destroy old chart if exists
  if (type === 'user' && this.userChart) {
    this.userChart.destroy();
  }
  if (type === 'admin' && this.adminChart) {
    this.adminChart.destroy();
  }

  const chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Approved', 'Pending', 'Rejected'],
      datasets: [
        {
          data: [
            data.approved ?? data.total_approved ?? 0,
            data.pending ?? data.total_pending ?? 0,
            data.rejected ?? data.total_rejected ?? 0
          ],
          backgroundColor: ['#2ecc71', '#f1c40f', '#e74c3c'],
          hoverBackgroundColor: ['#27ae60', '#f39c12', '#c0392b'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      animation: {
        animateRotate: true,
        duration: 900,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            boxWidth: 10,
            padding: 16,
            font: {
              size: 12,
              weight: 500
            }
          }
        },
        tooltip: {
          backgroundColor: '#2c3e50',
          titleFont: {
            size: 13,
            weight:100
          },
          bodyFont: {
            size: 12
          },
          padding: 10,
          cornerRadius: 6
        }
      }
    }
  });

  // Save chart reference
  if (type === 'user') {
    this.userChart = chart;
  } else {
    this.adminChart = chart;
  }
}





}

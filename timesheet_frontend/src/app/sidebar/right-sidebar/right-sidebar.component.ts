// new code 

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, MenuController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService } from '../../user.service'; // Correct relative path

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [IonicModule, CommonModule, HttpClientModule],
  templateUrl: './right-sidebar.component.html',
  styleUrls: ['./right-sidebar.component.scss'],
})
export class RightSidebarComponent implements OnInit {

  user: any = null;

  constructor(
    private router: Router,
    private menu: MenuController,
    private http: HttpClient,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Subscribe to logged-in user
    this.userService.user$.subscribe((user: { Employee_Id: any; }) => {
      if (user) {
        this.user = user;

        // Fetch fresh user details from backend
        this.http.get(`/api/user/user-profile/${user.Employee_Id}`).subscribe({
          next: (res) => this.user = res,
          error: (err) => console.error('Error fetching user:', err),
        });
      } else {
        this.user = null;
      }
    });
  }

 async logout() {
  console.log('Logout clicked');
  await this.menu.close('rightMenu');
  await this.menu.enable(false, 'leftMenu');
  await this.menu.enable(false, 'rightMenu');

  // Clear user data
  this.userService.clearUser();

  // Navigate to home/login
  this.router.navigate(['/home']);
}
}

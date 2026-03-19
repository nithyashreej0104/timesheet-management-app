
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-left-sidebar',
  imports: [IonicModule, RouterModule, CommonModule],
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent {

  currentRoute: string = '';

  constructor(private router: Router) {
    // Track route changes to highlight active menu item
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }

}

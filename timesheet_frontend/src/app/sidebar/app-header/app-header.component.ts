

import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule
  ],
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent {

  title = '';

  // constructor(
  //   private router: Router,
  //   private route: ActivatedRoute
  // ) {
  //   this.router.events
  //     .pipe(filter(event => event instanceof NavigationEnd))
  //     .subscribe(() => {

  //       let activeRoute = this.route.firstChild;
  //       while (activeRoute?.firstChild) {
  //         activeRoute = activeRoute.firstChild;
  //       }

  //       this.title = activeRoute?.snapshot.data['title'] ?? '';

  //     });
  // }

  showHeader = true;

constructor(private router: Router, private route: ActivatedRoute) {
  this.router.events
    .pipe(filter(e => e instanceof NavigationEnd))
    .subscribe(() => {
      let active = this.route.firstChild;
      while (active?.firstChild) active = active.firstChild;

      const data = active?.snapshot.data;
      this.title = data?.['title'] ?? '';
      this.showHeader = !data?.['hideHeader'];
    });
}


  
}


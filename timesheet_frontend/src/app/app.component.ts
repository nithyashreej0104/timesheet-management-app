// import { Component } from '@angular/core';
// import { IonicModule, IonMenu, IonRouterOutlet, MenuController } from '@ionic/angular';
// import { Router } from '@angular/router';
// import { LeftSidebarComponent } from './sidebar/left-sidebar/left-sidebar.component';
// import { RightSidebarComponent } from './sidebar/right-sidebar/right-sidebar.component';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   standalone: true,
//   imports: [
//     IonicModule,           // required for general Ionic components
//     LeftSidebarComponent,
//     RightSidebarComponent
//   ]
// })
// export class AppComponent {
//   constructor(private router: Router, private menu: MenuController) {}

//   logout() {
//     console.log('Logout clicked');
//     this.menu.close();
//     this.router.navigate(['/home']); // or login page
//   }
// }

import { Component, OnInit } from '@angular/core';
import { IonicModule, MenuController } from '@ionic/angular';
import { Router, RouterOutlet } from '@angular/router';

import { AppHeaderComponent } from './sidebar/app-header/app-header.component';
import { LeftSidebarComponent } from './sidebar/left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from './sidebar/right-sidebar/right-sidebar.component';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
   styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    LeftSidebarComponent,
    RightSidebarComponent,
    AppHeaderComponent,
  ]
})
export class AppComponent implements OnInit {

  
  constructor(
    private router: Router,
    private menu: MenuController
  ) {}

  ngOnInit() {
    // ✅ FIX: Prevent content from going under status bar (Redmi / MIUI)
    StatusBar.setOverlaysWebView({ overlay: false });

    // ✅ Match status bar color with your theme
    StatusBar.setBackgroundColor({ color: 'linear-gradient(135deg, #1d6e6f, #23D5D1);' });

    // ✅ White status bar icons (best contrast)
    StatusBar.setStyle({ style: Style.Light });

    this.menu.enable(false, 'leftMenu');
this.menu.enable(false, 'rightMenu');

  }

  logout() {
    console.log('Logout clicked');
    this.menu.close();
    this.router.navigate(['/home']);
  }
}

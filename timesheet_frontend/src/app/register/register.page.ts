
// // ======================new code ================

// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule, NgForm } from '@angular/forms';
// import { IonicModule, ToastController } from '@ionic/angular';
// import { Router } from '@angular/router';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { UserService } from '../user.service';
// import { MenuController } from '@ionic/angular';


// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [CommonModule, FormsModule, IonicModule, HttpClientModule],
//   templateUrl: './register.page.html',
//   styleUrls: ['./register.page.scss'],
// })
// export class RegisterPage {
//   submissionType: 'login' | 'signup' | 'forgot' | 'otp' | 'reset' = 'login';

//   Employee_Id = '';
//   Employee_Name = '';
//   Email = '';
//   Contact_No = '';
//   Password = '';
//   confirmPassword = '';

//   forgotEmail = '';
//   otp = '';
//   newPassword = '';

//   showPassword = false;
//   showConfirmPassword = false;
//   otpVerified = false;

//   passwordVisibility: { [key: string]: boolean } = {};


//   constructor(
//     private http: HttpClient,
//     private router: Router,
//     private toastController: ToastController,
//     private userService: UserService, 
//     private menu: MenuController

//   ) { }

//   toggleSubmission(type: any) {
//     this.submissionType = type;
//   }

//   async presentToast(message: string, color: string = 'danger') {
//     const toast = await this.toastController.create({
//       message,
//       duration: 2000,
//       color,
//       position: 'bottom',
//     });
//     toast.present();
//   }

//    ionViewWillEnter() {
//     this.menu.enable(false, 'leftMenu');
//     this.menu.enable(false, 'rightMenu');
//   }

//   togglePasswordVisibility(field: 'password' | 'confirmPassword') {
//     if (field === 'password') this.showPassword = !this.showPassword;
//     else this.showConfirmPassword = !this.showConfirmPassword;
//   }

//   isPasswordValid(password: string): boolean {
//     const regex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-_])[A-Za-z\d@$!%*?&]{8,}$/;
//     return regex.test(password);
//   }

//   validateSignup(): boolean {
//     if (!this.Employee_Id || !this.Employee_Name || !this.Email || !this.Contact_No || !this.Password || !this.confirmPassword) {
//       this.presentToast('All fields are required', 'warning');
//       return false;
//     }

//     if (!/^\d+$/.test(this.Employee_Id)) {
//       this.presentToast('Employee ID must contain only numbers', 'danger');
//       return false;
//     }

//     if (!/^\d{10}$/.test(this.Contact_No)) {
//       this.presentToast('Mobile Number must be 10 digits', 'danger');
//       return false;
//     }

//     if (!/\S+@\S+\.\S+/.test(this.Email)) {
//       this.presentToast('Invalid email format', 'danger');
//       return false;
//     }

//     if (!this.isPasswordValid(this.Password)) {
//       this.presentToast(
//         'Password must have 8 characters, uppercase, lowercase, number & special character',
//         'danger'
//       );
//       return false;
//     }

//     if (this.Password !== this.confirmPassword) {
//       this.presentToast('Passwords do not match', 'danger');
//       return false;
//     }

//     return true;
//   }

//   onSubmit(form: NgForm) {
//     if (!form.valid) {
//       this.presentToast('Please fill all required fields', 'warning');
//       return;
//     }

//     switch (this.submissionType) {
//       case 'signup':
//         this.signup();
//         break;
//       case 'login':
//         this.login();
//         break;
//       case 'forgot':
//         this.sendOtp();
//         break;
//       case 'otp':
//         this.verifyOtpAndResetPassword();
//         break;
//     }
//   }

//   // ---- for eye in password -----

//   toggleVisibility(field: string) {
//   this.passwordVisibility[field] = !this.passwordVisibility[field];
// }


//   // ---------------- Signup ----------------
//   signup() {
//     if (!this.validateSignup()) return;

//     const userData = {
//       Employee_Id: this.Employee_Id,
//       Employee_Name: this.Employee_Name,
//       Email: this.Email,
//       Contact_No: this.Contact_No,
//       Password: this.Password
//     };

//     this.http.post('/api/user/signup', userData).subscribe({
//       next: (res: any) => {
//         this.presentToast(res.message || 'Signup successful!', 'success');
//         this.toggleSubmission('login');
//       },
//       error: (err) => {
//         this.presentToast(err.error?.error || 'Signup failed', 'danger');
//       }
//     });
//   }

//   // ---------------- Login ----------------
//   login() {
//     const loginData = {
//       Employee_Id: this.Employee_Id.trim(),
//       Password: this.Password.trim()
//     };

//     this.http.post('/api/user/login', loginData).subscribe({
//       next: async (res: any) => {
//         this.presentToast(res.message || 'Login successful!', 'success');

//         this.userService.setUser(res.user);

//         await this.menu.enable(true, 'leftMenu');
//         await this.menu.enable(true, 'rightMenu');

//         this.router.navigate(['/dashboard']);
//       },
//       error: (err) => {
//         this.presentToast(err.error?.error || 'Login failed', 'danger');
//       }
//     });
//   }


//   // ---------------- Forgot Password ----------------

//   sendOtp() {
//     if (!this.forgotEmail) {
//       this.presentToast('Email is required', 'warning');
//       return;
//     }

//     this.http.post('/api/user/forgot-password', { email: this.forgotEmail })
//       .subscribe({
//         next: (res: any) => {
//           this.presentToast(res.message || 'OTP sent successfully!', 'success');
//           this.submissionType = 'otp';
//           this.otp = '';
//              this.otpVerified = false;
//         },
//         error: (err: any) => {
//           this.presentToast(err.error?.error || 'Email not found', 'danger');
//         }
//       });
//   }

//   onOtpChange(value: string) {
//     this.otp = value;
//     if (this.otp.length === 6) this.verifyOtpOnly();
//     else this.otpVerified = false;
//   }


//     /* ---------------- VERIFY OTP ---------------- */

//   verifyOtpOnly() {
//     this.http.post('/api/user/verify-otp', {
//       email: this.forgotEmail,
//       otp: this.otp
//     }).subscribe({
//       next: (res: any) => {
//         if (res.success) {
//           this.presentToast('OTP verified', 'success');
//           this.otpVerified = true;
//           this.submissionType = 'reset'; // ⭐ IMPORTANT
//         } else {
//           this.presentToast('Invalid or expired OTP');
//         }
//       },
//       error: () => {
//         this.presentToast('OTP verification failed');
//       }
//     });
//   }

//    /* ---------------- RESET PASSWORD ---------------- */


//   verifyOtpAndResetPassword() {
//     if (!this.newPassword || !this.confirmPassword) {
//       this.presentToast('All fields are required', 'warning');
//       return;
//     }

//     if (!this.isPasswordValid(this.newPassword)) {
//       this.presentToast('Password not strong enough');
//       return;
//     }

//     if (this.newPassword !== this.confirmPassword) {
//       this.presentToast('Passwords do not match');
//       return;
//     }

//     this.http.post('/api/user/reset-password', {
//       email: this.forgotEmail,
//       otp: this.otp,
//       newPassword: this.newPassword
//     }).subscribe({
//       next: () => {
//         this.presentToast('Password reset successful', 'success');
//         this.submissionType = 'login';
//         this.otp = '';
//         this.newPassword = '';
//         this.confirmPassword = '';
//         this.otpVerified = false;
//       },
//       error: () => {
//         this.presentToast('Reset failed');
//       }
//     });
//   }

// }

// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { IonicModule, ToastController, MenuController } from '@ionic/angular';
// import { Router } from '@angular/router';
// import { HttpClient, HttpClientModule } from '@angular/common/http';
// import { UserService } from '../user.service';

// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [CommonModule, FormsModule, IonicModule, HttpClientModule],
//   templateUrl: './register.page.html',
//   styleUrls: ['./register.page.scss'],
// })
// export class RegisterPage {

//   submissionType: 'login' | 'signup' | 'forgot' | 'otp' | 'reset' = 'login';

//   Employee_Id = '';
//   Employee_Name = '';
//   Email = '';
//   Contact_No = '';
//   Password = '';
//   confirmPassword = '';

//   forgotEmail = '';
//   otp = '';
//   newPassword = '';
//   otpVerified = false;

//   // 👁️ SINGLE source for all password eyes
//   passwordVisibility: { [key: string]: boolean } = {};

//   constructor(
//     private http: HttpClient,
//     private router: Router,
//     private toastController: ToastController,
//     private userService: UserService,
//     private menu: MenuController
//   ) {}

//   ionViewWillEnter() {
//     this.menu.enable(false, 'leftMenu');
//     this.menu.enable(false, 'rightMenu');
//   }

//   async presentToast(message: string, color: string = 'danger') {
//     const toast = await this.toastController.create({
//       message,
//       duration: 2000,
//       color,
//       position: 'bottom',
//     });
//     toast.present();
//   }

//   toggleSubmission(type: any) {
//     this.submissionType = type;
//   }

//   // 👁️ Toggle eye
//   toggleVisibility(field: string) {
//     this.passwordVisibility[field] = !this.passwordVisibility[field];
//   }

//   isPasswordValid(password: string): boolean {
//     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-_]).{8,}$/.test(password);
//   }

//   signup() {
//     if (this.Password !== this.confirmPassword) {
//       this.presentToast('Passwords do not match');
//       return;
//     }

//     this.http.post('/api/user/signup', {
//       Employee_Id: this.Employee_Id,
//       Employee_Name: this.Employee_Name,
//       Email: this.Email,
//       Contact_No: this.Contact_No,
//       Password: this.Password
//     }).subscribe(() => {
//       this.presentToast('Signup successful', 'success');
//       this.submissionType = 'login';
//     });
//   }

//   login() {
//     this.http.post('/api/user/login', {
//       Employee_Id: this.Employee_Id,
//       Password: this.Password
//     }).subscribe({
//       next: async (res: any) => {
//         this.presentToast('Login successful', 'success');
//         this.userService.setUser(res.user);
//         await this.menu.enable(true, 'leftMenu');
//         await this.menu.enable(true, 'rightMenu');
//         this.router.navigate(['/dashboard']);
//       },
//       error: () => this.presentToast('Login failed')
//     });
//   }

//   sendOtp() {
//     this.http.post('/api/user/forgot-password', {
//       email: this.forgotEmail
//     }).subscribe(() => {
//       this.presentToast('OTP sent', 'success');
//       this.submissionType = 'otp';
//     });
//   }

//   verifyOtpOnly() {
//     this.http.post('/api/user/verify-otp', {
//       email: this.forgotEmail,
//       otp: this.otp
//     }).subscribe((res: any) => {
//       if (res.success) {
//         this.presentToast('OTP verified', 'success');
//         this.submissionType = 'reset';
//         this.otpVerified = true;
//       } else {
//         this.presentToast('Invalid OTP');
//       }
//     });
//   }

//   verifyOtpAndResetPassword() {
//     if (this.newPassword !== this.confirmPassword) {
//       this.presentToast('Passwords do not match');
//       return;
//     }

//     this.http.post('/api/user/reset-password', {
//       email: this.forgotEmail,
//       otp: this.otp,
//       newPassword: this.newPassword
//     }).subscribe(() => {
//       this.presentToast('Password reset successful', 'success');
//       this.submissionType = 'login';
//     });
//   }
// }


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonicModule,
  ToastController,
  MenuController
} from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, HttpClientModule],
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  // ---------- UI STATE ----------
  submissionType: 'login' | 'signup' | 'forgot' | 'otp' | 'reset' = 'login';
  otpVerified = false;

  // ---------- FORM DATA ----------
  Employee_Id = '';
  Employee_Name = '';
  Email = '';
  Contact_No = '';
  Password = '';
  confirmPassword = '';

  forgotEmail = '';
  otp = '';
  newPassword = '';

  // ---------- PASSWORD EYE (SINGLE SOURCE) ----------
  passwordVisibility: { [key: string]: boolean } = {};

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastController,
    private userService: UserService,
    private menu: MenuController
  ) {}

  // ---------- LIFECYCLE ----------
  ionViewWillEnter() {
    this.menu.enable(false, 'leftMenu');
    this.menu.enable(false, 'rightMenu');
  }

  // ---------- HELPERS ----------
  toggleVisibility(key: string) {
    this.passwordVisibility[key] = !this.passwordVisibility[key];
  }

  toggleSubmission(type: 'login' | 'signup' | 'forgot' | 'otp' | 'reset') {
    this.submissionType = type;

    // reset flags when switching screens
    if (type !== 'reset') {
      this.otpVerified = false;
    }
  }

  async presentToast(message: string, color: string = 'danger') {
    const t = await this.toast.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    t.present();
  }

  isPasswordValid(password: string): boolean {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-_]).{8,}$/.test(password);
  }

  // ---------- SIGNUP ----------
  signup() {
    if (this.Password !== this.confirmPassword) {
      this.presentToast('Passwords do not match');
      return;
    }

    this.http.post('/api/user/signup', {
      Employee_Id: this.Employee_Id,
      Employee_Name: this.Employee_Name,
      Email: this.Email,
      Contact_No: this.Contact_No,
      Password: this.Password
    }).subscribe({
      next: () => {
        this.presentToast('Signup successful', 'success');
        this.toggleSubmission('login');
      },
      error: () => this.presentToast('Signup failed')
    });
  }

  // ---------- LOGIN ----------
  login() {
    this.http.post('/api/user/login', {
      Employee_Id: this.Employee_Id,
      Password: this.Password
    }).subscribe({
      next: async (res: any) => {
        this.presentToast('Login successful', 'success');
        this.userService.setUser(res.user);
    this.menu.enable(true, 'leftMenu');
this.menu.enable(true, 'rightMenu');
// this.router.navigate(['/dashboard']);
this.router.navigateByUrl('/dashboard', { replaceUrl: true });

      },
      error: () => this.presentToast('Login failed')
    });
  }

  // ---------- FORGOT ----------
  sendOtp() {
    if (!this.forgotEmail) {
      this.presentToast('Email is required');
      return;
    }

    this.http.post('/api/user/forgot-password', {
      email: this.forgotEmail
    }).subscribe({
      next: () => {
        this.presentToast('OTP sent', 'success');
        this.submissionType = 'otp';
      },
      error: () => this.presentToast('Email not found')
    });
  }

  // ---------- OTP VERIFY ----------
  verifyOtpOnly() {
    this.http.post('/api/user/verify-otp', {
      email: this.forgotEmail,
      otp: this.otp
    }).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.presentToast('OTP verified', 'success');
          this.otpVerified = true;
          this.submissionType = 'reset';
        } else {
          this.presentToast('Invalid OTP');
        }
      },
      error: () => this.presentToast('OTP verification failed')
    });
  }

  // ---------- RESET PASSWORD ----------
  verifyOtpAndResetPassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.presentToast('Passwords do not match');
      return;
    }

    if (!this.isPasswordValid(this.newPassword)) {
      this.presentToast('Password not strong enough');
      return;
    }

    this.http.post('/api/user/reset-password', {
      email: this.forgotEmail,
      otp: this.otp,
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.presentToast('Password reset successful', 'success');
        this.toggleSubmission('login');

        // clear sensitive data
        this.otp = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: () => this.presentToast('Reset failed')
    });
  }
}

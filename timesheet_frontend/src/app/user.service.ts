import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      this.userSubject.next(JSON.parse(storedUser));
    }
  }

  setUser(user: any) {
    this.userSubject.next(user);
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  }

  clearUser() {
    this.userSubject.next(null);
    localStorage.removeItem('loggedInUser');
  }

  getCurrentUser() {
    return this.userSubject.getValue();
  }

  // ✅ ADD BELOW (VERY IMPORTANT FOR ROLE LOGIC)

  getEmployeeId(): string | null {
    return this.getCurrentUser()?.Employee_Id || null;
  }

  getEmployeeRole(): string {
    return this.getCurrentUser()?.Employee_Role || '';
  }

  isAdmin(): boolean {
     return this.getCurrentUser()?.Employee_Role === 'Admin';
  }
}

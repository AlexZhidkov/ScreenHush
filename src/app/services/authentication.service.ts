import { Injectable, inject } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private analytics: Analytics = inject(Analytics);
  private auth: Auth = inject(Auth);

  constructor(private router: Router) {

  }

  logEvent(eventName: string): void {
    logEvent(this.analytics, eventName);
  }

  onAuthStateChanged(callback: (user: User | null) => void): void {
    onAuthStateChanged(this.auth, callback);
  }

  contactDeveloper(): void {
    this.logEvent('email_developer');
    window.open(
      'mailto:azhidkov@gmail.com?subject=Team%20Builder%20App&body=Hi%20Alex,%20Love%20your%20app!'
    );
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      // Sign-out successful.
      this.router.navigate(['/']); // Assuming you want to navigate to the home page after sign-out
    } catch (e) {
      // An error happened.
      console.error('An error happened while signing out!', e);
    }
  }
}

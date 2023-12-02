import { Injectable, inject } from '@angular/core';
import { Analytics, logEvent, setUserId } from '@angular/fire/analytics';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private analytics: Analytics = inject(Analytics);

  setUserId(userId: string) {
    setUserId(this.analytics, userId);
  }

  logEvent(eventName: string, eventParams: any = {}): void {
    logEvent(this.analytics, eventName, eventParams);
  }

  contactDeveloper(): void {
    this.logEvent('email_developer');
    window.open(
      'mailto:azhidkov@gmail.com?subject=Team%20Builder%20App&body=Hi%20Alex,%20Love%20your%20app!'
    );
  }
}

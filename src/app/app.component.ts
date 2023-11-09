import { Component, inject } from '@angular/core';
import { LinkMenuItem } from './auth-firebaseui-avatar/auth-firebaseui-avatar.component';
import { Analytics, logEvent } from '@angular/fire/analytics';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private analytics: Analytics = inject(Analytics);

  avatarLinks: LinkMenuItem[] = [
    { icon: 'account_circle', text: `Profile`, callback: () => { this.router.navigate(['profile']); } },
    { icon: 'info', text: `About the app`, callback: () => { this.router.navigate(['about']); } },
    {
      icon: 'mail', text: `Contact the developer`, callback: () => {
        logEvent(this.analytics, 'email_developer');
        window.open('mailto:azhidkov@gmail.com?subject=Team%20Builder%20App&body=Hi%20Alex,%20Love%20your%20app!');
      }
    },
  ];

  constructor(private router: Router) { }

  onSignOut(): void {
    logEvent(this.analytics, 'user_signed_out');
    this.router.navigate(['/']).then(() => location.reload());
  }
}

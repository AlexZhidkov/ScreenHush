import { Component, OnInit } from '@angular/core';
import { LinkMenuItem } from './auth-firebaseui-avatar/auth-firebaseui-avatar.component';
import { Router } from '@angular/router';
import { AutocompleteResult } from './model/autocomplete-result.model';
import { GeolocationService } from './services/geolocation.service';
import { FilterService } from './services/filter.service';
import { Geopoint } from 'geofire-common';
import { User } from '@angular/fire/auth';
import { AuthenticationService } from './services/authentication.service';
import { AnalyticsService } from './services/analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit {
  user: User | null = null;
  title = 'ScreenHush';

  avatarLinks: LinkMenuItem[] = [
    {
      icon: 'account_circle',
      text: `Profile`,
      callback: () => {
        this.router.navigate(['profile']);
      },
    },
    {
      icon: 'info',
      text: `About the app`,
      callback: () => {
        this.router.navigate(['about']);
      },
    },
    {
      icon: 'mail',
      text: `Contact the developer`,
      callback: () => {
        this.analyticsService.logEvent('email_developer');
        window.open(
          'mailto:azhidkov@gmail.com?subject=ScreenHush%20App&body=Hi%20Alex,%20Love%20your%20app!'
        );
      },
    },
  ];

  equalsRoute(route: string) {
    return this.router.url === route;
  }

  constructor(
    private router: Router,
    private geolocationService: GeolocationService,
    private filterService: FilterService,
    private analyticsService: AnalyticsService,
    private firebaseService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.firebaseService.onAuthStateChanged((user) => {
      if (!user) {
        this.router.navigate(['/account']);
      }
      this.user = user;
    });
  }

  onSignOut() {
    this.router.navigate(['/account']);
  }

  onMyLocationSelected(useMyLocation: boolean) {
    this.filterService.updateData({ UseCurrentLocation: true });
  }

  onLocationSelected(suggestion: AutocompleteResult) {
    this.geolocationService
      .getGeoLocation(suggestion.placeId)
      .then((geoLocations) => {
        const locationResult = geoLocations[0];
        const location = [
          locationResult.latitude,
          locationResult.longitude,
        ] as Geopoint;

        this.filterService.updateData({ Location: location });
      })
      .catch((error) => {
        // this.geoLocationError = true;
      });
  }
}

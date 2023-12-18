import { Component, Input } from '@angular/core';
import { LinkMenuItem } from '../auth-firebaseui-avatar/auth-firebaseui-avatar.component';
import { Router } from '@angular/router';
import { AnalyticsService } from '../services/analytics.service';
import { FilterService } from '../services/filter.service';
import { AutocompleteResult } from '../model/autocomplete-result.model';
import { Geopoint } from 'geofire-common';
import { GeolocationService } from '../services/geolocation.service';
import { ActivitiesService } from '../services/activities.service';
import { DocumentReference } from '@angular/fire/firestore';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Input() displayName: string;
  @Input() showFilterButtons: boolean = false;

  constructor(
    private router: Router,
    private analyticsService: AnalyticsService,
    private filterService: FilterService,
    private geolocationService: GeolocationService,
    private activitiesService: ActivitiesService,
  ) {}

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

  displayFilterButtons() {
    return this.showFilterButtons;
  }

  onSignOut() {
    this.router.navigate(['/account']);
  }

  createNewActivity() {
    this.activitiesService.createNewActivity().then((newActivityReference: DocumentReference) => {
      this.router.navigate([`edit-activity/${newActivityReference.id}`]);
    });
  }
}

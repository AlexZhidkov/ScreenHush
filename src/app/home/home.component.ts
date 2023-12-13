import { Component } from '@angular/core';
import { User } from '@angular/fire/auth';
import { TagsService } from '../services/tags.service';
import { MatChipOption } from '@angular/material/chips';
import { Geopoint } from 'geofire-common';
import { FilterService } from '../services/filter.service';
import { Subscription } from 'rxjs';
import { HomeSection } from '../model/home-activity-model';
import { DocumentReference } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ActivitiesService } from '../services/activities.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  isLoading: boolean = true;
  geoLocationError = false;
  user: User | null = null;
  allActivities: any[] = [];
  selectedActivities: any[] = [];
  homeSection: HomeSection[] = [];
  allTags: string[] = [];
  selectedTags: string[] = [];
  filterIsOpen = true;
  selectedTagChips: MatChipOption[] = [];
  geoLocationHash: string | null = null;
  geoLocationState: PermissionState | undefined = undefined;
  center: Geopoint = [0, 0];
  radiusInMeters = 5 * 1000;
  subscription: Subscription;
  searchPrompt: string | null = null;
  isMobile: boolean;

  constructor(
    private tagsService: TagsService,
    private filterService: FilterService,
    private activitiesService: ActivitiesService,
    private router: Router,
    private deviceService: DeviceDetectorService
  ) {
    this.allTags = tagsService.getAllTags();


    this.getDeviceInformation();

    this.subscription = filterService.filterSource$.subscribe((filter) => {
      if (filter.UseCurrentLocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          console.log(position);
          this.center = [
            position.coords.latitude,
            position.coords.longitude,
          ] as Geopoint;
          activitiesService.getGeoActivitiesBySection(this.center).then((x) => {
            this.homeSection = x;
          });
        });
      } else {
        this.center = filter.Location ? filter.Location : [0, 0];
      }
    });

    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      this.geoLocationState = result.state;
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        this.center = [
          position.coords.latitude,
          position.coords.longitude,
        ] as Geopoint;

        activitiesService.getGeoActivitiesBySection(this.center).then((x: HomeSection[]) => {
          this.homeSection = x;
          this.isLoading = false;
        });
      });
    }
  }

  getDeviceInformation() {
    this.isMobile = this.deviceService.isMobile();
  }

  createNewActivity() {
    this.activitiesService.createNewActivity().then((newActivityReference: DocumentReference) => {
      this.router.navigate([`edit-activity/${newActivityReference.id}`]);
    });
  }

  search() {
    if (!this.searchPrompt) { return }
    this.isLoading = true;
    this.activitiesService.search(this.searchPrompt).then((x: HomeSection[]) => {
      this.homeSection = x;
      this.isLoading = false;
      this.searchPrompt = null
    });
  }
}

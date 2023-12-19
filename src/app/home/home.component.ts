import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { TagsService } from '../services/tags.service';
import { MatChipOption } from '@angular/material/chips';
import { Geopoint } from 'geofire-common';
import { FilterService } from '../services/filter.service';
import { Subscription } from 'rxjs';
import { HomeSection } from '../model/home-activity-model';
import { ActivitiesService } from '../services/activities.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CacheService } from '../services/cache.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoading = false;
  geoLocationError = false;
  user: User | null = null;
  allActivities: any[] = [];
  selectedActivities: any[] = [];
  homeSection: HomeSection[] | null = [];
  allTags: string[] = [];
  selectedTags: string[] = [];
  filterIsOpen = true;
  selectedTagChips: MatChipOption[] = [];
  geoLocationHash: string | null = null;
  geoLocationState: PermissionState | undefined = undefined;
  center: Geopoint = [0, 0];
  radiusInMeters = 5 * 1000;
  filterSubscription: Subscription;
  searchPrompt: string | null = null;
  isMobile: boolean;
  cacheKey = 'home-activities';
  private activitiesSubscription: Subscription;

  constructor(
    private cacheService: CacheService<HomeSection[]>,
    private tagsService: TagsService,
    private filterService: FilterService,
    private activitiesService: ActivitiesService,
    private deviceService: DeviceDetectorService
  ) {
    this.allTags = tagsService.getAllTags();
    this.filterSubscription = filterService.filterSource$.subscribe((filter) => {
      this.handleFilterChange(filter);
    });

    this.activitiesSubscription = this.cacheService.cache$.subscribe((cachedActivities) => {
      this.homeSection = cachedActivities;
    });

    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      this.geoLocationState = result.state;
    });
  }

 async ngOnInit() {
    this.isLoading = true;
    await this.getHomeData(this.cacheKey);
  }

  ngOnDestroy() {
    this.filterSubscription.unsubscribe();
    this.activitiesSubscription.unsubscribe();
  }

  private async getHomeData(key: string) {
    const cachedActivities = await this.cacheService.get(key);

    if (!cachedActivities) {
      this.isLoading = false;
      if (navigator.geolocation) {
        this.getActivitiesByLocation();
        this.isLoading = false;
      }
    } else {
      this.isLoading = false;
    }
  }

  private async handleFilterChange(filter: any) {
    if (filter.UseCurrentLocation) {
      await this.getActivitiesByLocation();
    } else {
      this.center = filter.Location ? filter.Location : [0, 0];
    }
  }

  private async getActivitiesByLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = [position.coords.latitude, position.coords.longitude] as Geopoint;
      this.getActivities();
    });
  }

  private async getActivities() {
     this.activitiesService.getGeoActivitiesBySection(this.center).then((homeSection) => {
      this.cacheService.set(this.cacheKey, homeSection);
    });
  }

  getDeviceInformation() {
    this.isMobile = !this.deviceService.isDesktop();
  }

  search() {
    if (!this.searchPrompt) {
      return;
    }
    this.isLoading = true;
    this.activitiesService.search(this.searchPrompt).then((x: HomeSection[]) => {
      this.homeSection = x;
      this.isLoading = false;
      this.searchPrompt = null;
    });
  }
}
